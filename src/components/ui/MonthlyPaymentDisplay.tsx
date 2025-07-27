"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

interface MonthlyPaymentDisplayProps {
  hasLoan: boolean;
  loanAmount: number;
  interestRate: number;
  amortizationRate: number;
  numberOfAdults: "1" | "2";
  estimatedPaymentText: string;
}

export const MonthlyPaymentDisplay = ({
  hasLoan,
  loanAmount,
  interestRate,
  amortizationRate,
  numberOfAdults,
  estimatedPaymentText,
}: MonthlyPaymentDisplayProps) => {
  const t = useTranslations("loan_parameters");
  const monthlyPayment = useMemo(() => {
    if (!hasLoan || loanAmount <= 0) {
      return 0;
    }

    return loanAmount * ((interestRate + amortizationRate) / 100 / 12);
  }, [hasLoan, loanAmount, interestRate, amortizationRate]);

  const adultsCount = Number.parseInt(numberOfAdults);

  return (
    <div className="text-sm text-muted-foreground">
      {hasLoan && monthlyPayment > 0 ? (
        <>
          {estimatedPaymentText}:{" "}
          <CurrencyDisplay
            amount={monthlyPayment}
            className="text-foreground font-semibold"
            showDecimals={false}
            variant="warning"
          />
        </>
      ) : (
        t("no_loan", { count: adultsCount })
      )}

      {/* Screen reader announcement for payment changes */}
      <div aria-atomic="true" aria-live="polite" className="sr-only">
        {hasLoan &&
          monthlyPayment > 0 &&
          t("monthly_payment_updated", {
            amount: Math.round(monthlyPayment),
            currency: t("currency_sek"),
          })}
      </div>
    </div>
  );
};
