"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Calculator } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { getStepParam, getStepName } from "@/utils/navigation";
import { motion } from "framer-motion";
import { Box } from "@/components/ui/box";
import BudgetkollenLogo from "../ui/BudgetKollen.logo";

interface LogoProps {
  onLogoClick?: () => void;
}

export function Logo({ onLogoClick }: LogoProps) {
  const locale = useLocale();
  const router = useRouter();

  const handleLogoClick = () => {
    onLogoClick?.();
    const stepParam = getStepParam(locale);
    const firstStep = {
      label: "Inkomst", // Use hardcoded Swedish value as fallback
      component: null,
    };
    const firstStepName = getStepName(firstStep, locale);
    router.push({ pathname: "/", query: { [stepParam]: firstStepName } });
  };

  return (
    <button onClick={handleLogoClick} className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Box className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
          <Calculator className="w-6 h-6 text-white" />
        </Box>
        <Box className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 blur-md opacity-50" />
      </motion.div>
      <motion.span
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <BudgetkollenLogo variant="text-check" />
      </motion.span>
    </button>
  );
}
