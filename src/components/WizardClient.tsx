"use client";

import React, { useMemo } from "react";
import { Box } from "@/components/ui/box";
import { WizardLayout } from "@/features/wizard/WizardLayout";
import { IncomeStep } from "@/features/wizard/steps/IncomeStep";
import { LoansStep } from "@/features/wizard/steps/LoansStep";
import { ExpensesStep } from "@/features/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/features/wizard/steps/SummaryStep";
import { ResultsStep } from "@/features/wizard/steps/ResultsStep";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export const WizardClient = () => {
  const t = useTranslations("wizard");

  const steps = useMemo(
    () => [
      { label: t("income"), component: <IncomeStep /> },
      { label: t("loans"), component: <LoansStep /> },
      { label: t("expenses"), component: <ExpensesStep /> },
      { label: t("summary"), component: <SummaryStep /> },
      { label: t("results"), component: <ResultsStep /> },
    ],
    [t]
  );

  return (
    <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <WizardLayout steps={steps} />
      </motion.div>
    </Box>
  );
};
