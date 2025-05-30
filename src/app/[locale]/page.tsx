"use client";

import React from "react";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/shared/Navbar";
import { WizardLayout } from "@/features/wizard/WizardLayout";
import { IncomeStep } from "@/features/wizard/steps/IncomeStep";
import { LoansStep } from "@/features/wizard/steps/LoansStep";
import { ExpensesStep } from "@/features/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/features/wizard/steps/SummaryStep";
import { ResultsStep } from "@/features/wizard/steps/ResultsStep";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Home() {
  const t = useTranslations("wizard");

  return (
    <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh" />

      {/* Static gradient orbs for depth - no animation for better performance */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <Navbar />

      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
    </Main>
  );
}
