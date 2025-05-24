import { WizardStepConfig } from "@/types/wizard";

export function getStepParam(locale: string) {
  return locale === "sv" ? "steg" : "step";
}

export function getStepName(step: WizardStepConfig, locale: string) {
  const map: Record<string, string> = {
    Income: locale === "sv" ? "inkomst" : "income",
    Loans: locale === "sv" ? "lan" : "loans",
    Expenses: locale === "sv" ? "utgifter" : "expenses",
    Summary: locale === "sv" ? "sammanfattning" : "summary",
    Results: locale === "sv" ? "resultat" : "results",
  };
  return map[step.label] || step.label.toLowerCase();
}

export function getStepIndexFromName(name: string, steps: WizardStepConfig[]) {
  const map: Record<string, string> = {
    income: "Income",
    inkomst: "Income",
    loans: "Loans",
    lan: "Loans",
    expenses: "Expenses",
    utgifter: "Expenses",
    summary: "Summary",
    sammanfattning: "Summary",
    results: "Results",
    resultat: "Results",
  };
  const canonical = map[name.toLowerCase()];
  return steps.findIndex((s) => s.label === canonical);
}
