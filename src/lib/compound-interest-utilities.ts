import { FAQ_DATA, TIPS_DATA } from "@/data/compoundInterestData";
import { formatCurrencyNoDecimals } from "@/lib/formatting";

// Constants for magic numbers
export const CALCULATION_STEPS = 4;
export const BENEFITS_COUNT = 3;

// Example financial data - should be moved to configuration
export const EXAMPLE_FINANCIAL_DATA = {
  invested: 300000,
  growth: 483000,
  total: 783000,
} as const;

// Content preparation utilities
export const prepareContentData = (t: (key: string) => string) => ({
  tips: TIPS_DATA.map((tip) => ({
    ...tip,
    content: t(tip.translationKey),
  })),
  faqs: FAQ_DATA.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  })),
});

// Generate step data
export const generateStepData = (t: (key: string) => string) =>
  Array.from({ length: CALCULATION_STEPS }, (_, i) => ({
    stepNumber: i + 1,
    title: t(`how_to_calculate_section.step${i + 1}.title`),
    description: t(`how_to_calculate_section.step${i + 1}.description`),
  }));

// Re-export formatCurrencyNoDecimals for convenience
export const formatCurrency = formatCurrencyNoDecimals;
