import type { WizardStepConfig } from "@/types/wizard";

export const getStepParameter = (locale: string): string => {
  return locale === "sv" ? "steg" : "step";
};

export const getStepName = (step: WizardStepConfig, locale: string): string => {
  // Create a mapping from step label to URL-friendly name
  const labelToUrlName: Record<string, string> = {
    // English labels
    Income: locale === "sv" ? "inkomst" : "income",
    Loans: locale === "sv" ? "lan" : "loans",
    Expenses: locale === "sv" ? "utgifter" : "expenses",
    Summary: locale === "sv" ? "summering" : "summary",
    Results: locale === "sv" ? "resultat" : "results",
    // Swedish labels
    Inkomst: locale === "sv" ? "inkomst" : "income",
    Lån: locale === "sv" ? "lan" : "loans",
    Utgifter: locale === "sv" ? "utgifter" : "expenses",
    summering: locale === "sv" ? "summering" : "summary",
    Resultat: locale === "sv" ? "resultat" : "results",
  };

  return labelToUrlName[step.label] || step.label.toLowerCase();
};

export const getStepIndexFromName = (
  name: string,
  steps: WizardStepConfig[]
): number => {
  // Create reverse mapping from URL name to possible step labels
  const urlNameToLabels: Record<string, string[]> = {
    income: ["Income", "Inkomst"],
    inkomst: ["Income", "Inkomst"],
    loans: ["Loans", "Lån"],
    lan: ["Loans", "Lån"],
    expenses: ["Expenses", "Utgifter"],
    utgifter: ["Expenses", "Utgifter"],
    summary: ["Summary", "summering"],
    summering: ["Summary", "summering"],
    results: ["Results", "Resultat"],
    resultat: ["Results", "Resultat"],
  };

  const possibleLabels = urlNameToLabels[name.toLowerCase()] || [];

  // Find the first matching step
  // eslint-disable-next-line unicorn/no-array-reduce
  const foundIndex = possibleLabels.reduce((acc, label) => {
    if (acc !== -1) return acc; // Already found a match
    const index = steps.findIndex((s) => s.label === label);
    return index !== -1 ? index : acc;
  }, -1);

  return foundIndex;
};
