import type { ReactNode } from "react";

export interface WizardStepConfig {
  label: string;
  component: ReactNode;
  optional?: boolean;
}

export interface WizardContextProps {
  stepIndex: number;
  setStepIndex: (idx: number) => void;
  goNext: () => void;
  goBack: () => void;
  steps: WizardStepConfig[];
}
