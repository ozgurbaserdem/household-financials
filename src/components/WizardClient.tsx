"use client";

import React from "react";
import { Box } from "@/components/ui/box";
import { WizardLayout } from "@/features/wizard/WizardLayout";
import { IncomeStep } from "@/features/wizard/steps/IncomeStep";
import { LoansStep } from "@/features/wizard/steps/LoansStep";
import { ExpensesStep } from "@/features/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/features/wizard/steps/SummaryStep";
import { ResultsStep } from "@/features/wizard/steps/ResultsStep";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function WizardClient() {
  const t = useTranslations("wizard");

  return (
    <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <WizardLayout
          steps={[
            { label: t("income"), component: <IncomeStep /> },
            { label: t("loans"), component: <LoansStep /> },
            { label: t("expenses"), component: <ExpensesStep /> },
            { label: t("summary"), component: <SummaryStep /> },
            { label: t("results"), component: <ResultsStep /> },
          ]}
        />
      </motion.div>
    </Box>
  );
}
