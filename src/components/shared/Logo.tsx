"use client";

import React from "react";

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
      className="flex items-center group cursor-pointer transition-opacity duration-200 hover:opacity-80"
      onClick={handleLogoClick}
    >
      <BudgetkollenLogo variant="minimal" />
    </button>
  );
};
