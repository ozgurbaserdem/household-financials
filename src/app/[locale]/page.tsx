"use client";

import React from "react";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/Navbar";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { IncomeStep } from "@/components/wizard/steps/IncomeStep";
import { LoansStep } from "@/components/wizard/steps/LoansStep";
import { ExpensesStep } from "@/components/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/components/wizard/steps/SummaryStep";
import { ResultsStep } from "@/components/wizard/steps/ResultsStep";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("wizard");

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        <WizardLayout
          steps={[
            { label: t("income"), component: <IncomeStep /> },
            { label: t("loans"), component: <LoansStep /> },
            { label: t("expenses"), component: <ExpensesStep /> },
            { label: t("summary"), component: <SummaryStep /> },
            { label: t("results"), component: <ResultsStep /> },
          ]}
        />
      </Box>
    </Main>
  );
}
