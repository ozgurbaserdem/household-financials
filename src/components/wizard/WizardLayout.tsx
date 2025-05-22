import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CalculatorState } from "@/lib/types";
import { ProgressStepper } from "./ProgressStepper";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface WizardContextProps {
  stepIndex: number;
  setStepIndex: (idx: number) => void;
  formData: CalculatorState;
  setFormData: React.Dispatch<React.SetStateAction<CalculatorState>>;
  goNext: () => void;
  goBack: () => void;
  steps: WizardStepConfig[];
}

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

export interface WizardStepConfig {
  label: string;
  component: ReactNode;
  optional?: boolean;
}

interface WizardLayoutProps {
  steps: WizardStepConfig[];
  initialData: CalculatorState;
}

export function WizardLayout({ steps, initialData }: WizardLayoutProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<CalculatorState>(initialData);
  const t = useTranslations("wizard");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("wizardFormData", JSON.stringify(formData));
  }, [formData]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <WizardContext.Provider
      value={{
        stepIndex,
        setStepIndex,
        formData,
        setFormData,
        goNext,
        goBack,
        steps,
      }}
    >
      <Box className="max-w-4xl mx-auto w-full">
        <ProgressStepper
          steps={steps}
          currentStep={stepIndex}
          onStepClick={setStepIndex}
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
