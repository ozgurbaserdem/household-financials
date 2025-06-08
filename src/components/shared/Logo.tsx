"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import React from "react";

import { Box } from "@/components/ui/Box";
import { useRouter } from "@/i18n/navigation";

import { BudgetkollenLogo } from "../ui/BudgetKollenLogo";

interface LogoProps {
  onLogoClick?: () => void;
}

export const Logo = ({ onLogoClick }: LogoProps) => {
  const router = useRouter();

  const handleLogoClick = () => {
    onLogoClick?.();
    // Navigate to landing page (root without query parameters)
    router.push("/");
  };

  return (
    <button
      className="flex items-center gap-3 group cursor-pointer"
      onClick={handleLogoClick}
    >
      <motion.div
        className="relative"
        transition={{ duration: 0.5 }}
        whileHover={{ rotate: 180 }}
      >
        <Box className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
          <Calculator className="w-6 h-6 text-white" />
        </Box>
        <Box className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 blur-md opacity-50" />
      </motion.div>
      <motion.span
        transition={{ type: "spring", stiffness: 400 }}
        whileHover={{ scale: 1.05 }}
      >
        <BudgetkollenLogo variant="text-check" />
      </motion.span>
    </button>
  );
};
