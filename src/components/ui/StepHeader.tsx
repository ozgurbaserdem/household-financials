"use client";

import { Wallet, List, HandCoins, BarChart3, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { useFocusOnMount } from "@/shared/hooks/use-focus-management";

import { Box } from "./Box";

export type StepType = "income" | "expenses" | "loans" | "summary" | "results";

interface StepHeaderProps {
  step: StepType;
  children?: ReactNode;
  rightContent?: ReactNode;
  customTitle?: string;
  customIcon?: ReactNode;
  className?: string;
}

const stepConfig = {
  income: {
    icon: <Wallet className="w-6 h-6 text-golden" />,
    translationKey: "income",
  },
  expenses: {
    icon: <List className="w-6 h-6 text-golden" />,
    translationKey: "expense_categories",
  },
  loans: {
    icon: <HandCoins className="w-6 h-6 text-golden" />,
    translationKey: "loan_parameters",
  },
  summary: {
    icon: <ListChecks className="w-6 h-6 text-golden" />,
    translationKey: "summary",
  },
  results: {
    icon: <BarChart3 className="w-6 h-6 text-golden" />,
    translationKey: "results",
  },
};

export const StepHeader = ({
  step,
  children,
  rightContent,
  customTitle,
  customIcon,
  className = "",
}: StepHeaderProps) => {
  const config = stepConfig[step];
  const t = useTranslations(config.translationKey);
  const titleReference = useFocusOnMount();

  const icon = customIcon || config.icon;
  const title = customTitle || t("title");

  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${className}`}>
      <Box className="flex items-start gap-4 flex-1 w-full sm:w-auto">
        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <Box className="flex-1">
          <h2
            ref={titleReference}
            aria-label={`${title} section`}
            className="text-2xl font-semibold text-foreground focus:outline-none"
            tabIndex={0}
          >
            {title}
          </h2>
          {children && <div className="mt-1">{children}</div>}
        </Box>
      </Box>
      {rightContent && (
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          {rightContent}
        </div>
      )}
    </div>
  );
};
