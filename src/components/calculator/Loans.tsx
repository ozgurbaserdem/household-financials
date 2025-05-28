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
import { HandCoins, Percent, Calendar } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { LoanInputField } from "./LoanInputField";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  loanAmount: z.number().min(0),
  interestRates: z.array(z.number()),
  amortizationRates: z.array(z.number()),
});

export type LoansFormValues = z.infer<typeof formSchema>;

interface LoansFormProps {
  onChange: (values: LoansFormValues) => void;
  values?: LoansFormValues;
}

export function Loans({ onChange, values }: LoansFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: values?.loanAmount ?? 0,
      interestRates: values?.interestRates ?? [3.5],
      amortizationRates: values?.amortizationRates ?? [2],
    },
  });

  const t = useTranslations("loan_parameters");

  useEffect(() => {
    if (values) {
      form.reset({
        loanAmount: values.loanAmount,
        interestRates: values.interestRates,
        amortizationRates: values.amortizationRates,
      });
    }
  }, [values, form]);

  const handleFieldChange = () => {
    const currentValues = form.getValues();
    onChange(currentValues);
  };

  // Calculate monthly payment for display
  const loanAmount = form.watch("loanAmount");
  const interestRate = form.watch("interestRates")[0] || 0;
  const amortizationRate = form.watch("amortizationRates")[0] || 0;
  const monthlyPayment =
    loanAmount * ((interestRate + amortizationRate) / 100 / 12);

  return (
    <Card gradient glass delay={0.1}>
      <CardHeader>
        <CardIcon>
          <HandCoins className="w-6 h-6 text-purple-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={t("title_aria")}>
            {t("title")}
          </CardTitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-300 mt-1"
          >
            {t("estimated_monthly_payment")}:{" "}
            <span className="text-orange-400 font-semibold">
              {new Intl.NumberFormat("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              }).format(monthlyPayment)}
            </span>
          </motion.p>
        </Box>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form data-testid="loan-form" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LoanInputField
                form={form}
                name="loanAmount"
                label={t("loan_amount")}
                ariaLabel={t("loan_amount_aria")}
                onBlur={handleFieldChange}
                className="modern-input text-lg"
              />
              {loanAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2"
                >
                  <Box className="flex items-center gap-4 text-sm text-gray-300">
                    <span>
                      {t("monthly")}:{" "}
                      {new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                        maximumFractionDigits: 0,
                      }).format(monthlyPayment)}
                    </span>
                    <span>•</span>
                    <span>
                      {t("total_interest")}:{" "}
                      {new Intl.NumberFormat("sv-SE", {
                        style: "currency",
                        currency: "SEK",
                        maximumFractionDigits: 0,
                      }).format(loanAmount * (interestRate / 100))}
                    </span>
                  </Box>
                </motion.div>
              )}
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
                <Box
                  className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3"
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
                                      onChange({
                                        ...form.getValues(),
                                        interestRates: newValue,
                                      });
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
              </Box>

              <Box className="space-y-3">
                <Box className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <FormLabel className="text-lg text-gray-200">
                    {t("amortization_rates")}
                  </FormLabel>
                </Box>
                <Box
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
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
                                    onChange({
                                      ...form.getValues(),
                                      amortizationRates: newValue,
                                    });
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
