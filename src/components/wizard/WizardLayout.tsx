import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { ProgressStepper } from "./ProgressStepper";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { WizardContextProps, WizardStepConfig } from "@/types/wizard";
import {
  getStepParam,
  getStepName,
  getStepIndexFromName,
} from "@/utils/navigation";

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

interface WizardLayoutProps {
  steps: WizardStepConfig[];
}

export function WizardLayout({ steps }: WizardLayoutProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const t = useTranslations("wizard");
  const isSyncingRef = useRef(false);

  // Effect 1: Sync stepIndex from URL (only when URL/searchParams changes)
  useEffect(() => {
    if (isSyncingRef.current) return;
    const param = getStepParam(locale);
    const stepName = searchParams.get(param);
    if (stepName) {
      const idx = getStepIndexFromName(stepName, steps);
      if (idx >= 0 && idx < steps.length && idx !== stepIndex) {
        isSyncingRef.current = true;
        setStepIndex(idx);
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, searchParams, steps]);

  // Effect 2: Sync URL from stepIndex (only when stepIndex changes)
  useEffect(() => {
    if (isSyncingRef.current) return;
    const param = getStepParam(locale);
    const stepName = getStepName(steps[stepIndex], locale);
    const currentStepName = searchParams.get(param);
    if (currentStepName !== stepName) {
      isSyncingRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, stepName);
      router.replace(`${pathname}?${params.toString()}`);
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [stepIndex, locale, pathname, router, steps, searchParams]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleStepClick = (idx: number) => setStepIndex(idx);

  return (
    <WizardContext.Provider
      value={{
        stepIndex,
        setStepIndex,
        goNext,
        goBack,
        steps,
      }}
    >
      <Box className="max-w-5xl mx-auto w-full">
        <ProgressStepper
          steps={steps}
          currentStep={stepIndex}
          onStepClick={handleStepClick}
        />
        <Box className="mt-8">{steps[stepIndex].component}</Box>
        <Box
          className={`flex mt-8 ${stepIndex === 0 ? "justify-end" : "justify-between"}`}
        >
          {stepIndex > 0 && (
            <Button onClick={goBack} variant="secondary">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("back")}
            </Button>
          )}
          {stepIndex < steps.length - 1 && (
            <Button onClick={goNext}>
              {t("next")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </Box>
      </Box>
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardLayout");
  return ctx;
}
