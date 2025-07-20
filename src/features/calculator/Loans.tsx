"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as BaseFormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { SliderInput } from "@/components/ui/SliderInput";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";

const formSchema = z
  .object({
    hasLoan: z.boolean(),
    loanAmount: z.number().min(0),
    interestRate: z.number().min(0.01).max(20),
    amortizationRate: z.number().min(0.01).max(10),
  })
  .refine(
    (data) => {
      // If user says they have no loan, validation passes
      if (!data.hasLoan) return true;

      // If they have a loan, they must provide:
      // 1. Loan amount > 0
      if (data.loanAmount <= 0) return false;

      // 2. Interest rate must be provided (must be > 0)
      if (data.interestRate <= 0 || data.interestRate > 20) return false;

      // 3. Amortization rate must be provided (must be > 0)
      if (data.amortizationRate <= 0 || data.amortizationRate > 10)
        return false;

      return true;
    },
    {
      message:
        "When you have loans, you must provide loan amount, interest rate, and amortization rate",
      path: ["hasLoan"],
    }
  );

export interface LoansFormValues {
  loanAmount: number;
  interestRate: number;
  amortizationRate: number;
  hasLoan: boolean;
}

interface LoansFormProps {
  onChange: (values: LoansFormValues) => void;
  values: LoansFormValues;
  numberOfAdults: "1" | "2";
}

export const Loans = ({ onChange, values, numberOfAdults }: LoansFormProps) => {
  const [isUserToggling, setIsUserToggling] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      hasLoan: values.hasLoan,
      loanAmount: values.loanAmount,
      interestRate: values.interestRate,
      amortizationRate: values.amortizationRate,
    },
  });

  const t = useTranslations("loan_parameters");

  useEffect(() => {
    // Initialize the form once with props values
    if (!isInitialized) {
      form.setValue("hasLoan", values.hasLoan);
      form.setValue("loanAmount", values.loanAmount);
      form.setValue("interestRate", values.interestRate);
      form.setValue("amortizationRate", values.amortizationRate);
      setIsInitialized(true);
    }
    // After initialization, only sync non-hasLoan values when not toggling
    else if (isInitialized && !isUserToggling) {
      form.setValue("loanAmount", values.loanAmount);
      form.setValue("interestRate", values.interestRate);
      form.setValue("amortizationRate", values.amortizationRate);
    }
  }, [values, form, isUserToggling, isInitialized]);
  const handleFieldChange = (forceHasLoan?: boolean): void => {
    const currentValues = form.getValues();
    const hasLoan =
      forceHasLoan !== undefined ? forceHasLoan : currentValues.hasLoan;

    // If no loan, reset values
    if (!hasLoan) {
      onChange({
        loanAmount: 0,
        interestRate: 3.5, // Default interest rate
        amortizationRate: 2, // Default amortization rate
        hasLoan: false,
      });
    } else {
      // When switching to "has loan", use previous values or defaults
      const prevLoanAmount = values.loanAmount || 0;
      const prevInterestRate = values.interestRate || 3.5;
      const prevAmortizationRate = values.amortizationRate || 2;

      // If we're just updating (not toggling), keep the current values
      // If toggling to "has loan", start with previous values or defaults
      const loanAmountToUse =
        forceHasLoan === undefined ? currentValues.loanAmount : prevLoanAmount;
      const interestRateToUse =
        forceHasLoan === undefined
          ? currentValues.interestRate
          : prevInterestRate;
      const amortizationRateToUse =
        forceHasLoan === undefined
          ? currentValues.amortizationRate
          : prevAmortizationRate;

      onChange({
        loanAmount: loanAmountToUse,
        interestRate: interestRateToUse,
        amortizationRate: amortizationRateToUse,
        hasLoan: true,
      });
    }
  };

  // Calculate monthly payment for display
  const hasLoan = form.watch("hasLoan");
  const loanAmount = form.watch("loanAmount");
  const interestRate = form.watch("interestRate");
  const amortizationRate = form.watch("amortizationRate");

  // Calculate monthly payment based on current rates
  const calculateMonthlyPayment = (): number => {
    if (!hasLoan || loanAmount <= 0) {
      return 0;
    }

    const monthlyPayment =
      loanAmount * ((interestRate + amortizationRate) / 100 / 12);

    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div>
      <StepHeader step="loans">
        <div className="text-sm text-muted-foreground">
          {hasLoan && monthlyPayment > 0 ? (
            <>
              {t("estimated_monthly_payment")}:{" "}
              <CurrencyDisplay
                amount={monthlyPayment}
                className="text-foreground font-semibold"
                showDecimals={false}
                variant="warning"
              />
            </>
          ) : (
            t("no_loan", { count: Number.parseInt(numberOfAdults) })
          )}
        </div>
      </StepHeader>

      <div>
        <Form {...form}>
          <form className="space-y-4" data-testid="loan-form">
            {/* Has Loan Toggle */}
            <div>
              <FormField
                control={form.control}
                name="hasLoan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Box className="flex items-center gap-3">
                        <Button
                          className="flex-1"
                          type="button"
                          variant={field.value ? "gradient" : "secondary"}
                          onClick={() => {
                            setIsUserToggling(true);
                            field.onChange(true);
                            handleFieldChange(true);
                            // Reset the flag after a short delay
                            setTimeout(() => setIsUserToggling(false), 300);
                          }}
                        >
                          {t("has_loan", {
                            count: Number.parseInt(numberOfAdults),
                          })}
                        </Button>
                        <Button
                          className="flex-1"
                          type="button"
                          variant={!field.value ? "gradient" : "secondary"}
                          onClick={() => {
                            setIsUserToggling(true);
                            field.onChange(false);
                            handleFieldChange(false);
                            // Reset the flag after a short delay
                            setTimeout(() => setIsUserToggling(false), 300);
                          }}
                        >
                          {t("no_loan", {
                            count: Number.parseInt(numberOfAdults),
                          })}
                        </Button>
                      </Box>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {hasLoan && (
              <>
                <div>
                  <FormField
                    control={form.control}
                    name="loanAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("loan_amount")}</FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            type="number"
                            {...field}
                            aria-label={t("loan_amount_aria")}
                            className="modern-input text-lg"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value);
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                        <BaseFormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-foreground" />
                          {t("interest_rate")}
                        </FormLabel>
                        <FormControl>
                          <SliderInput
                            ariaLabel={t("interest_rate_aria")}
                            max={20}
                            min={0.05}
                            step={0.05}
                            suffix="%"
                            value={field.value || 3.5}
                            onChange={(value) => {
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                        <Text className="text-xs text-muted-foreground mt-1">
                          {t("interest_rate_help")}
                        </Text>
                        <BaseFormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amortizationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-foreground" />
                          {t("amortization_rate")}
                        </FormLabel>
                        <FormControl>
                          <SliderInput
                            ariaLabel={t("amortization_rate_aria")}
                            max={10}
                            min={0.05}
                            step={0.05}
                            suffix="%"
                            value={field.value || 2}
                            onChange={(value) => {
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                        <Text className="text-xs text-muted-foreground mt-1">
                          {t("amortization_rate_help")}
                        </Text>
                        <BaseFormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Show any form-level validation errors */}
            {form.formState.errors.root && (
              <div className="mt-4">
                <BaseFormMessage className="text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {form.formState.errors.root.message}
                </BaseFormMessage>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
