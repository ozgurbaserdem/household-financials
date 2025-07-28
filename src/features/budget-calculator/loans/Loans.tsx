"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as BaseFormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { StepHeader } from "@/components/ui/StepHeader";

import { MonthlyPaymentDisplay } from "./MonthlyPaymentDisplay";
import { RateSliderField } from "./RateSliderField";
import { ToggleButtonGroup, type ToggleOption } from "./ToggleButtonGroup";

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
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: values,
  });

  const t = useTranslations("loan_parameters");
  const adultsCount = Number.parseInt(numberOfAdults);

  // Simplified form synchronization
  useEffect(() => {
    if (!isUserToggling) {
      form.reset(values);
    }
  }, [values, form, isUserToggling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, []);

  const handleFieldChange = useCallback((): void => {
    const currentValues = form.getValues();
    onChange(currentValues);
  }, [form, onChange]);

  const handleLoanToggle = useCallback(
    (hasLoan: boolean): void => {
      setIsUserToggling(true);

      // Clear any existing timeout
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }

      const newValues: LoansFormValues = hasLoan
        ? {
            hasLoan: true,
            loanAmount: values.loanAmount || 0,
            interestRate: values.interestRate || 3.5,
            amortizationRate: values.amortizationRate || 2,
          }
        : {
            hasLoan: false,
            loanAmount: 0,
            interestRate: 3.5,
            amortizationRate: 2,
          };

      form.reset(newValues);
      onChange(newValues);

      // Reset toggling flag after a delay
      timeoutReference.current = setTimeout(() => {
        setIsUserToggling(false);
      }, 100);
    },
    [form, onChange, values]
  );

  // Watch form values efficiently
  const formValues = form.watch();
  const { hasLoan, loanAmount, interestRate, amortizationRate } = formValues;

  // Create toggle options
  const toggleOptions: ToggleOption<boolean>[] = [
    {
      value: true,
      label: t("has_loan", { count: adultsCount }),
    },
    {
      value: false,
      label: t("no_loan", { count: adultsCount }),
    },
  ];

  return (
    <div>
      <StepHeader step="loans">
        <MonthlyPaymentDisplay
          amortizationRate={amortizationRate}
          estimatedPaymentText={t("estimated_monthly_payment")}
          hasLoan={hasLoan}
          interestRate={interestRate}
          loanAmount={loanAmount}
          numberOfAdults={numberOfAdults}
        />
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
                      <ToggleButtonGroup
                        ariaLabel={t("loan_toggle_aria", {
                          count: adultsCount,
                        })}
                        name="hasLoan"
                        options={toggleOptions}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleLoanToggle(value as boolean);
                        }}
                      />
                    </FormControl>
                    <BaseFormMessage />
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
                            value={field.value ?? ""}
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
                  <RateSliderField
                    ariaLabel={t("interest_rate_aria")}
                    control={form.control}
                    defaultValue={3.5}
                    helpText={t("interest_rate_help")}
                    icon={Percent}
                    label={t("interest_rate")}
                    max={20}
                    name="interestRate"
                    onChange={handleFieldChange}
                  />

                  <RateSliderField
                    ariaLabel={t("amortization_rate_aria")}
                    control={form.control}
                    defaultValue={2}
                    helpText={t("amortization_rate_help")}
                    icon={Calendar}
                    label={t("amortization_rate")}
                    max={10}
                    name="amortizationRate"
                    onChange={handleFieldChange}
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
