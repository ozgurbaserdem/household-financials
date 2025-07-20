import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Form, FormMessage } from "@/components/ui/Form";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import {
  getStepParameter,
  getStepName,
  getStepIndexFromName,
} from "@/lib/utils/navigation";
import {
  getMaxAllowedStep,
  canAccessStep,
  getStepValidationErrorKey,
  getCurrentStepValidationError,
} from "@/lib/validation/stepValidation";
import { useAppSelector } from "@/store/hooks";
import type { WizardContextProps, WizardStepConfig } from "@/types/wizard";

import { ProgressStepper } from "./ProgressStepper";

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

// Schema for wizard-level validation
const wizardValidationSchema = z.object({
  wizard: z.string().optional(),
});

interface WizardLayoutProps {
  steps: WizardStepConfig[];
}

export const WizardLayout = ({ steps }: WizardLayoutProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const t = useTranslations("wizard");
  const isSyncingReference = useRef(false);
  const isMobile = useIsTouchDevice();
  const [direction, setDirection] = useState(0);

  // React Hook Form for wizard-level validation
  const form = useForm<z.infer<typeof wizardValidationSchema>>({
    resolver: zodResolver(wizardValidationSchema),
    mode: "onChange",
    defaultValues: {
      wizard: undefined,
    },
  });

  // Initialize stepIndex from URL to prevent flash
  // Get calculator state for validation using individual selectors to avoid object creation
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const income = useAppSelector((state) => state.income);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  // Memoize the calculator state object
  const calculatorState = useMemo(
    () => ({
      loanParameters,
      income,
      expenses,
      expenseViewMode,
      totalExpenses,
    }),
    [loanParameters, income, expenses, expenseViewMode, totalExpenses]
  );

  const [stepIndex, setStepIndex] = useState(() => {
    const param = getStepParameter(locale);
    const stepName = searchParameters.get(param);
    if (stepName) {
      const idx = getStepIndexFromName(stepName, steps);
      return idx >= 0 && idx < steps.length ? idx : 0;
    }
    return 0;
  });

  // Effect 1: Validate current step access and redirect if necessary
  useEffect(() => {
    if (isSyncingReference.current) return;

    // Always validate if the current stepIndex is accessible
    if (!canAccessStep(stepIndex, calculatorState)) {
      const maxStep = getMaxAllowedStep(calculatorState);
      const param = getStepParameter(locale);
      const redirectStepName = getStepName(steps[maxStep], locale);
      const params = new URLSearchParams(searchParameters.toString());
      params.set(param, redirectStepName);

      isSyncingReference.current = true;
      router.replace({
        pathname,
        query: Object.fromEntries(params.entries()),
      });

      setStepIndex(maxStep);
      setTimeout(() => {
        isSyncingReference.current = false;
      }, 0);
      return;
    }
  }, [
    stepIndex,
    calculatorState,
    locale,
    pathname,
    router,
    steps,
    searchParameters,
  ]);

  // Effect 2: Sync stepIndex from URL (only when URL/searchParams changes)
  useEffect(() => {
    if (isSyncingReference.current) return;

    const param = getStepParameter(locale);
    const stepName = searchParameters.get(param);

    if (stepName) {
      const idx = getStepIndexFromName(stepName, steps);
      if (idx >= 0 && idx < steps.length && idx !== stepIndex) {
        isSyncingReference.current = true;
        setDirection(idx > stepIndex ? 1 : -1);
        setStepIndex(idx);
        setTimeout(() => {
          isSyncingReference.current = false;
        }, 0);
      }
    }
    // ESLint disabled: stepIndex is intentionally excluded to prevent circular dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, searchParameters, steps, pathname, router]);

  // Effect 3: Sync URL from stepIndex (only when stepIndex changes)
  useEffect(() => {
    if (isSyncingReference.current) return;

    const param = getStepParameter(locale);
    const stepName = getStepName(steps[stepIndex], locale);
    const currentStepName = searchParameters.get(param);

    if (currentStepName !== stepName) {
      isSyncingReference.current = true;
      const params = new URLSearchParams(searchParameters.toString());
      params.set(param, stepName);

      // Use the router's replace method with the correct type
      router.replace({
        pathname,
        query: Object.fromEntries(params.entries()),
      });

      setTimeout(() => {
        isSyncingReference.current = false;
      }, 0);
    }
  }, [stepIndex, locale, pathname, router, steps, searchParameters]);

  // Effect 4: Reset to step 1 when navigating to root path
  useEffect(() => {
    // Check if we're on the root path without any step parameter
    const param = getStepParameter(locale);
    const stepName = searchParameters.get(param);

    // If no step parameter exists and we're not already on step 0
    if (!stepName && stepIndex !== 0) {
      setStepIndex(0);
    }
  }, [pathname, searchParameters, stepIndex, locale]);

  const goNext = () => {
    const nextStep = Math.min(stepIndex + 1, steps.length - 1);

    // Check if user can access the next step
    if (!canAccessStep(nextStep, calculatorState)) {
      // Set validation error using React Hook Form
      const errorKey = getCurrentStepValidationError(
        stepIndex,
        calculatorState
      );
      if (errorKey) {
        const message = t(
          errorKey.replace("wizard.validation.", "validation.")
        );
        form.setError("wizard", {
          type: "validation",
          message,
        });
      }
      return;
    }

    // Clear any validation errors when navigation succeeds
    form.clearErrors("wizard");

    setDirection(1);
    setStepIndex(nextStep);
  };

  const goBack = () => {
    // Clear any validation errors when going back
    form.clearErrors("wizard");

    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleStepClick = (idx: number) => {
    // Check if user can access the target step
    if (!canAccessStep(idx, calculatorState)) {
      const errorKey = getStepValidationErrorKey(idx, calculatorState);
      if (errorKey) {
        const message = t(
          errorKey.replace("wizard.validation.", "validation.")
        );
        form.setError("wizard", {
          type: "validation",
          message,
        });
      }
      return;
    }

    // Clear any validation errors when navigation succeeds
    form.clearErrors("wizard");

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
      <Form {...form}>
        <Box className="max-w-5xl mx-auto w-full">
          <ProgressStepper
            currentStep={stepIndex}
            steps={steps}
            onStepClick={handleStepClick}
          />
          {/* Step content area with card wrapper */}
          <Box
            className={`mt-4 md:mt-6 relative overflow-hidden ${stepIndex === 4 ? "" : "card-base shadow-sm p-4 md:p-6"}`}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={stepIndex}
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
                initial={
                  isMobile
                    ? {
                        x: direction > 0 ? 100 : -100,
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
          <Box className="mt-4 md:mt-6">
            {/* Validation Message using React Hook Form */}
            {form.formState.errors.wizard && (
              <Box className="mb-4">
                <FormMessage className="flex items-center gap-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {form.formState.errors.wizard.message}
                </FormMessage>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box
              className={`flex ${stepIndex === 0 ? "justify-end" : "justify-between"}`}
            >
              {stepIndex > 0 && (
                <Button variant="secondary" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t("back")}
                </Button>
              )}
              {stepIndex < steps.length - 1 && (
                <Button variant="default" onClick={goNext}>
                  {t("next")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Form>
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardLayout");
  return ctx;
};
