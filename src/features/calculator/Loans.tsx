"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, HandCoins, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { CardContent } from "@/components/ui/Card";
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
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@/components/ui/ModernCard";
import { Text } from "@/components/ui/Text";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";

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
  const titleReference = useFocusOnMount();
  const isMobile = useIsTouchDevice();

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
    <Card glass gradient animate={!isMobile} delay={0.1} hover={false}>
      <CardHeader>
        <CardIcon>
          <HandCoins className="w-6 h-6 text-orange-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle
            ref={titleReference}
            aria-label={t("title_aria")}
            className="focus:outline-none"
            tabIndex={0}
          >
            {t("title")}
          </CardTitle>
          <motion.p
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 mt-1"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {hasLoan && monthlyPayment > 0 ? (
              <>
                {t("estimated_monthly_payment")}:{" "}
                <CurrencyDisplay
                  amount={monthlyPayment}
                  className="text-orange-400 font-semibold"
                  showDecimals={false}
                  variant="neutral"
                />
              </>
            ) : (
              t("no_loan", { count: Number.parseInt(numberOfAdults) })
            )}
          </motion.p>
        </Box>
      </CardHeader>

      <CardContent className="pb-6">
        <Form {...form}>
          <form className="space-y-4" data-testid="loan-form">
            {/* Has Loan Toggle */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.15 }}
            >
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
            </motion.div>

            {hasLoan && (
              <>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-blue-400" />
                          {t("interest_rate")}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="relative flex items-center gap-4">
                              <input
                                aria-label={t("interest_rate_aria")}
                                className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                                max={20}
                                min={0.05}
                                step={0.05}
                                style={{
                                  background: `linear-gradient(to right, 
                                    rgb(59 130 246) 0%, 
                                    rgb(147 51 234) ${(((field.value || 3.5) - 0.01) / (20 - 0.01)) * 100}%, 
                                    rgb(55 65 81) ${(((field.value || 3.5) - 0.01) / (20 - 0.01)) * 100}%, 
                                    rgb(55 65 81) 100%)`,
                                }}
                                type="range"
                                value={field.value || 3.5}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  field.onChange(value);
                                  handleFieldChange();
                                }}
                              />
                              <div className="flex-shrink-0">
                                <div className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 w-20 text-center">
                                  <Text className="text-sm font-semibold text-white">
                                    {(field.value || 3.5).toFixed(2)}%
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <Text className="text-xs text-gray-400 mt-1">
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
                          <Calendar className="w-4 h-4 text-purple-400" />
                          {t("amortization_rate")}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="relative flex items-center gap-4">
                              <input
                                aria-label={t("amortization_rate_aria")}
                                className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                                max={10}
                                min={0.05}
                                step={0.05}
                                style={{
                                  background: `linear-gradient(to right, 
                                    rgb(59 130 246) 0%, 
                                    rgb(147 51 234) ${(((field.value || 2) - 0.01) / (10 - 0.01)) * 100}%, 
                                    rgb(55 65 81) ${(((field.value || 2) - 0.01) / (10 - 0.01)) * 100}%, 
                                    rgb(55 65 81) 100%)`,
                                }}
                                type="range"
                                value={field.value || 2}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  field.onChange(value);
                                  handleFieldChange();
                                }}
                              />
                              <div className="flex-shrink-0">
                                <div className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 w-20 text-center">
                                  <Text className="text-sm font-semibold text-white">
                                    {(field.value || 2).toFixed(2)}%
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <Text className="text-xs text-gray-400 mt-1">
                          {t("amortization_rate_help")}
                        </Text>
                        <BaseFormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </>
            )}

            {/* Show any form-level validation errors */}
            {form.formState.errors.root && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
              >
                <BaseFormMessage className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {form.formState.errors.root.message}
                </BaseFormMessage>
              </motion.div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
