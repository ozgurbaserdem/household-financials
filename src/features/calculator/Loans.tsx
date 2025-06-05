"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { HandCoins, Percent, Calendar, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { FormMessage as BaseFormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { Plus, X } from "lucide-react";
import { getAllInterestRates, hasValidLoan } from "@/lib/types";

const formSchema = z
  .object({
    hasLoan: z.boolean(),
    loanAmount: z.number().min(0),
    interestRates: z.array(z.number()),
    amortizationRates: z.array(z.number()),
    customInterestRates: z.array(z.number()),
    customInterestRate: z.number().optional(),
  })
  .refine(
    (data) => {
      // If user says they have no loan, validation passes
      if (!data.hasLoan) return true;

      // If they have a loan, they must provide:
      // 1. Loan amount > 0
      if (data.loanAmount <= 0) return false;

      // 2. At least one interest rate (preset or custom)
      const hasInterestRate =
        data.interestRates.length > 0 || data.customInterestRates.length > 0;
      if (!hasInterestRate) return false;

      // 3. At least one amortization rate
      if (data.amortizationRates.length === 0) return false;

      return true;
    },
    {
      message:
        "When you have loans, you must provide loan amount, interest rate, and amortization rate",
      path: ["hasLoan"],
    }
  );

export type LoansFormValues = {
  loanAmount: number;
  interestRates: number[];
  amortizationRates: number[];
  customInterestRates: number[];
  hasLoan: boolean;
};

interface LoansFormProps {
  onChange: (values: LoansFormValues) => void;
  values: LoansFormValues;
}

export function Loans({ onChange, values }: LoansFormProps) {
  const [isUserToggling, setIsUserToggling] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      hasLoan: values.hasLoan,
      loanAmount: values.loanAmount,
      interestRates: values.interestRates,
      amortizationRates: values.amortizationRates,
      customInterestRates: values.customInterestRates,
      customInterestRate: undefined,
    },
  });

  const t = useTranslations("loan_parameters");
  const titleRef = useFocusOnMount();
  const isMobile = useIsTouchDevice();

  useEffect(() => {
    // Initialize the form once with props values
    if (!isInitialized) {
      form.setValue("hasLoan", values.hasLoan);
      form.setValue("loanAmount", values.loanAmount);
      form.setValue("interestRates", values.interestRates);
      form.setValue("amortizationRates", values.amortizationRates);
      form.setValue("customInterestRates", values.customInterestRates);
      setIsInitialized(true);
    }
    // After initialization, only sync non-hasLoan values when not toggling
    else if (isInitialized && !isUserToggling) {
      form.setValue("loanAmount", values.loanAmount);
      form.setValue("interestRates", values.interestRates);
      form.setValue("amortizationRates", values.amortizationRates);
      form.setValue("customInterestRates", values.customInterestRates);
    }
  }, [values, form, isUserToggling, isInitialized]);
  const handleFieldChange = (forceHasLoan?: boolean) => {
    const currentValues = form.getValues();
    const hasLoan =
      forceHasLoan !== undefined ? forceHasLoan : currentValues.hasLoan;

    // If no loan, reset values
    if (!hasLoan) {
      onChange({
        loanAmount: 0,
        interestRates: [],
        amortizationRates: [],
        customInterestRates: [],
        hasLoan: false,
      });
    } else {
      // When switching to "has loan", use previous values or start with 0
      const prevLoanAmount = values.loanAmount || 0;

      // If we're just updating (not toggling), keep the current loan amount
      // If toggling to "has loan", start with previous amount or 0
      const loanAmountToUse =
        forceHasLoan === undefined ? currentValues.loanAmount : prevLoanAmount;

      onChange({
        loanAmount: loanAmountToUse,
        interestRates: currentValues.interestRates,
        amortizationRates: currentValues.amortizationRates,
        customInterestRates: currentValues.customInterestRates || [],
        hasLoan: true,
      });
    }
  };

  // Calculate monthly payment range for display
  const hasLoan = form.watch("hasLoan");
  const loanAmount = form.watch("loanAmount");
  const interestRates = form.watch("interestRates");
  const amortizationRates = form.watch("amortizationRates");
  const customInterestRates = form.watch("customInterestRates") || [];

  // Calculate range of monthly payments based on selected rates
  const calculatePaymentRange = () => {
    const loanParams = {
      amount: loanAmount,
      interestRates,
      amortizationRates,
      customInterestRates: customInterestRates || [],
      hasLoan: hasLoan,
    };

    const allInterestRates = getAllInterestRates(loanParams);

    if (!hasLoan || !hasValidLoan(loanParams)) {
      return { min: 0, max: 0 };
    }

    let minPayment = Infinity;
    let maxPayment = 0;

    allInterestRates.forEach((interestRate) => {
      amortizationRates.forEach((amortizationRate) => {
        const monthlyPayment =
          loanAmount * ((interestRate + amortizationRate) / 100 / 12);
        minPayment = Math.min(minPayment, monthlyPayment);
        maxPayment = Math.max(maxPayment, monthlyPayment);
      });
    });

    return { min: minPayment, max: maxPayment };
  };

  const paymentRange = calculatePaymentRange();

  return (
    <Card gradient glass delay={0.1} animate={!isMobile} hover={false}>
      <CardHeader>
        <CardIcon>
          <HandCoins className="w-6 h-6 text-orange-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle
            ref={titleRef}
            tabIndex={0}
            aria-label={t("title_aria")}
            className="focus:outline-none"
          >
            {t("title")}
          </CardTitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-300 mt-1"
          >
            {hasLoan && paymentRange.max > 0 ? (
              <>
                {t("estimated_monthly_payment")}:{" "}
                <span className="text-orange-400 font-semibold">
                  {paymentRange.min === paymentRange.max
                    ? new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                        maximumFractionDigits: 0,
                      }).format(paymentRange.min)
                    : `${new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                        maximumFractionDigits: 0,
                      }).format(paymentRange.min)} - ${new Intl.NumberFormat(
                        "sv-SE",
                        {
                          style: "currency",
                          currency: "SEK",
                          maximumFractionDigits: 0,
                        }
                      ).format(paymentRange.max)}`}
                </span>
              </>
            ) : (
              t("no_loan")
            )}
          </motion.p>
        </Box>
      </CardHeader>

      <CardContent className="pb-6">
        <Form {...form}>
          <form data-testid="loan-form" className="space-y-6">
            {/* Has Loan Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                          type="button"
                          variant={field.value ? "gradient" : "secondary"}
                          onClick={() => {
                            setIsUserToggling(true);
                            field.onChange(true);
                            handleFieldChange(true);
                            // Reset the flag after a short delay
                            setTimeout(() => setIsUserToggling(false), 300);
                          }}
                          className="flex-1"
                        >
                          {t("has_loan")}
                        </Button>
                        <Button
                          type="button"
                          variant={!field.value ? "gradient" : "secondary"}
                          onClick={() => {
                            setIsUserToggling(true);
                            field.onChange(false);
                            handleFieldChange(false);
                            // Reset the flag after a short delay
                            setTimeout(() => setIsUserToggling(false), 300);
                          }}
                          className="flex-1"
                        >
                          {t("no_loan")}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                            type="number"
                            min={0}
                            {...field}
                            value={field.value || ""}
                            placeholder="0"
                            aria-label={t("loan_amount_aria")}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value);
                              field.onChange(value);
                              handleFieldChange();
                            }}
                            className="modern-input text-lg"
                          />
                        </FormControl>
                        <BaseFormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <Box className="space-y-3">
                    <Box className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-400" />
                      <FormLabel className="text-lg text-gray-200">
                        {t("interest_rates")}
                      </FormLabel>
                    </Box>
                    <Box className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <Text className="text-sm text-blue-200">
                        {t("multiple_rates_info")}
                      </Text>
                    </Box>
                    <Box
                      className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4"
                      aria-label={t("interest_rates_aria")}
                    >
                      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(
                        (rate) => (
                          <motion.div
                            key={rate}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FormField
                              control={form.control}
                              name="interestRates"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <label
                                      className={`
                                    chip cursor-pointer select-none
                                    ${field.value.includes(rate) ? "active" : ""}
                                  `}
                                    >
                                      <Checkbox
                                        checked={field.value.includes(rate)}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...field.value, rate]
                                            : field.value.filter(
                                                (r: number) => r !== rate
                                              );
                                          field.onChange(newValue);
                                          handleFieldChange();
                                        }}
                                        className="sr-only"
                                      />
                                      <span>{rate}%</span>
                                    </label>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        )
                      )}
                    </Box>

                    {/* Custom Interest Rates */}
                    <Box className="space-y-3">
                      <Box className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-green-400" />
                        <FormLabel className="text-lg text-gray-200">
                          {t("custom_interest_rate")}
                        </FormLabel>
                      </Box>

                      {/* Custom Interest Rate Input */}
                      <Box className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="customInterestRate"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  max={20}
                                  placeholder={t(
                                    "custom_interest_rate_placeholder"
                                  )}
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    let value: number | undefined;
                                    if (e.target.value === "") {
                                      value = undefined;
                                    } else {
                                      // Handle both comma and dot decimal separators
                                      const normalizedValue =
                                        e.target.value.replace(",", ".");
                                      const numValue = Number(normalizedValue);
                                      value = isNaN(numValue)
                                        ? undefined
                                        : numValue;
                                    }
                                    field.onChange(value);
                                  }}
                                  className="modern-input"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const customRate =
                              form.getValues("customInterestRate");
                            if (
                              customRate &&
                              !isNaN(customRate) &&
                              customRate > 0 &&
                              customRate <= 20
                            ) {
                              const currentCustomRates = form.getValues(
                                "customInterestRates"
                              );
                              // Round to 2 decimal places for comparison
                              const roundedRate =
                                Math.round(customRate * 100) / 100;
                              if (
                                !currentCustomRates.some(
                                  (rate) =>
                                    Math.round(rate * 100) / 100 === roundedRate
                                )
                              ) {
                                const newCustomRates = [
                                  ...currentCustomRates,
                                  roundedRate,
                                ];
                                form.setValue(
                                  "customInterestRates",
                                  newCustomRates
                                );
                                form.setValue("customInterestRate", undefined);
                                handleFieldChange();
                              }
                            }
                          }}
                          className="px-3"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </Box>

                      {/* Display Custom Interest Rates */}
                      {customInterestRates &&
                        customInterestRates.length > 0 && (
                          <Box className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {customInterestRates.map((rate, index) => (
                              <motion.div
                                key={`custom-${rate}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative"
                              >
                                <div className="chip active w-full flex items-center justify-between gap-1 pr-1 relative group">
                                  <span
                                    className="flex-1 cursor-pointer"
                                    onClick={() => {
                                      const newCustomRates =
                                        customInterestRates.filter(
                                          (_, i) => i !== index
                                        );
                                      form.setValue(
                                        "customInterestRates",
                                        newCustomRates
                                      );
                                      handleFieldChange();
                                    }}
                                    aria-label={t("remove_custom_rate", {
                                      rate,
                                    })}
                                  >
                                    {rate}%
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newCustomRates =
                                        customInterestRates.filter(
                                          (_, i) => i !== index
                                        );
                                      form.setValue(
                                        "customInterestRates",
                                        newCustomRates
                                      );
                                      handleFieldChange();
                                    }}
                                    className="h-4 w-4 p-0 hover:bg-red-500/20"
                                    aria-label={t("remove_custom_rate", {
                                      rate,
                                    })}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </Box>
                        )}
                    </Box>
                  </Box>

                  <Box className="space-y-3">
                    <Box className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <FormLabel className="text-lg text-gray-200">
                        {t("amortization_rates")}
                      </FormLabel>
                    </Box>
                    <Box
                      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                      aria-label={t("amortization_rates_aria")}
                    >
                      {[0, 1, 2, 3, 4, 5].map((rate) => (
                        <motion.div
                          key={rate}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FormField
                            control={form.control}
                            name="amortizationRates"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <label
                                    className={`
                                    chip cursor-pointer select-none
                                    ${field.value.includes(rate) ? "active" : ""}
                                  `}
                                  >
                                    <Checkbox
                                      checked={field.value.includes(rate)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, rate]
                                          : field.value.filter(
                                              (r: number) => r !== rate
                                            );
                                        field.onChange(newValue);
                                        handleFieldChange();
                                      }}
                                      className="sr-only"
                                    />
                                    <span>{rate}%</span>
                                  </label>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </>
            )}

            {/* Show any form-level validation errors */}
            {form.formState.errors.root && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
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
}
