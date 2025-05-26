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
  const t = useTranslations("wizard");
  const isSyncingRef = useRef(false);

  // Initialize stepIndex from URL to prevent flash
  const [stepIndex, setStepIndex] = useState(() => {
    const param = getStepParam(locale);
    const stepName = searchParams.get(param);
    if (stepName) {
      const idx = getStepIndexFromName(stepName, steps);
      return idx >= 0 && idx < steps.length ? idx : 0;
    }
    return 0;
  });

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
    // ESLint disabled: stepIndex is intentionally excluded to prevent circular dependency
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

      // Use the router's replace method with the correct type
      router.replace({
        pathname,
        query: Object.fromEntries(params.entries()),
      });

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [stepIndex, locale, pathname, router, steps, searchParams]);

  // Effect 3: Reset to step 1 when navigating to root path
  useEffect(() => {
    // Check if we're on the root path without any step parameter
    const param = getStepParam(locale);
    const stepName = searchParams.get(param);

    // If no step parameter exists and we're not already on step 0
    if (!stepName && stepIndex !== 0) {
      setStepIndex(0);
    }
  }, [pathname, searchParams, stepIndex, locale]);

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
