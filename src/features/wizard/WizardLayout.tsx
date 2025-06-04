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
import { useAppSelector } from "@/store/hooks";
import { hasValidLoan } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";

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
  const isMobile = useIsTouchDevice();
  const [direction, setDirection] = useState(0);

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
        setDirection(idx > stepIndex ? 1 : -1);
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

  // Get loan state for validation
  const loanParameters = useAppSelector((state) => state.loanParameters);

  const canNavigateFromLoans = () => {
    // If no loan amount, always allow navigation
    if (loanParameters.amount === 0) return true;

    // Use the helper function for validation
    return hasValidLoan(loanParameters);
  };

  const goNext = () => {
    // Validate loan step before moving forward
    if (stepIndex === 1 && !canNavigateFromLoans()) {
      // Don't navigate if validation fails
      return;
    }
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleStepClick = (idx: number) => {
    // If trying to navigate past loans step, validate
    if (stepIndex === 1 && idx > 1 && !canNavigateFromLoans()) {
      return;
    }
    setDirection(idx > stepIndex ? 1 : -1);
    setStepIndex(idx);
  };

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
        <Box className="mt-6 relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={stepIndex}
              initial={
                isMobile
                  ? {
                      x: direction > 0 ? 100 : -100,
                      opacity: 0,
                    }
                  : { opacity: 0 }
              }
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={
                isMobile
                  ? {
                      x: direction > 0 ? -100 : 100,
                      opacity: 0,
                    }
                  : { opacity: 0 }
              }
              transition={{
                x: {
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                },
                opacity: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
            >
              {steps[stepIndex].component}
            </motion.div>
          </AnimatePresence>
        </Box>
        <Box
          className={`flex mt-6 ${stepIndex === 0 ? "justify-end" : "justify-between"}`}
        >
          {stepIndex > 0 && (
            <Button onClick={goBack} variant="secondary">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("back")}
            </Button>
          )}
          {stepIndex < steps.length - 1 && (
            <Button onClick={goNext} variant="gradient">
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
