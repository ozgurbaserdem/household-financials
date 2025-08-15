import {
  Baby,
  BadgeDollarSign,
  Briefcase,
  HandCoins,
  Home,
  List,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import React from "react";

export const ICON_BG_CLASSES = {
  success: "icon-bg-success",
  warning: "icon-bg-warning",
  destructive: "icon-bg-destructive",
} as const;

export const INCOME_ICONS = {
  income1: <Briefcase className="w-4 h-4" />,
  income2: <Briefcase className="w-4 h-4" />,
  secondaryIncome1: <TrendingUp className="w-4 h-4" />,
  secondaryIncome2: <TrendingUp className="w-4 h-4" />,
  childBenefits: <Baby className="w-4 h-4" />,
  otherBenefits: <Receipt className="w-4 h-4" />,
  otherIncomes: <MoreHorizontal className="w-4 h-4" />,
  currentBuffer: <PiggyBank className="w-4 h-4" />,
} as const;

export const SECTION_ICONS = {
  wallet: <Wallet className="w-5 h-5" />,
  handCoins: <HandCoins className="w-5 h-5" />,
  receipt: <Receipt className="w-5 h-5" />,
  badgeDollarSign: <BadgeDollarSign className="w-5 h-5" />,
  list: <List className="w-5 h-5" />,
  home: <Home className="w-4 h-4" />,
  trendingUp: <TrendingUp className="w-4 h-4" />,
  users: <Users className="w-3 h-3" />,
  user: <User className="w-3 h-3" />,
} as const;

export type ColorScheme = keyof typeof ICON_BG_CLASSES;
export type IncomeIconType = keyof typeof INCOME_ICONS;
export type SectionIconType = keyof typeof SECTION_ICONS;

// Constants for calculation defaults and magic numbers
export const CALCULATION_CONSTANTS = {
  // Default array index for single scenario calculations
  DEFAULT_SCENARIO_INDEX: 0,

  // Rounding precision for monetary values
  CURRENCY_ROUND_TO_NEAREST: 1,

  // Default fallback values
  DEFAULT_BUFFER_AMOUNT: 0,
  DEFAULT_SAVINGS_AMOUNT: 0,
} as const;
