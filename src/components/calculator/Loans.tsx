"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { CalculatorState } from "@/lib/types";
import { HandCoins } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";

const formSchema = z.object({
  loanAmount: z.number().min(0),
  interestRates: z.array(z.number()),
  amortizationRates: z.array(z.number()),
  income1: z.number().min(0),
  income2: z.number().min(0),
  income3: z.number().min(0),
  income4: z.number().min(0),
  childBenefits: z.number().min(0),
  otherBenefits: z.number().min(0),
  otherIncomes: z.number().min(0),
  runningCosts: z.number().min(0),
});

interface LoansFormProps {
  onSubmit: (state: Partial<CalculatorState>) => void;
  values?: {
    loanAmount: number;
    interestRates: number[];
    amortizationRates: number[];
    runningCosts: number;
  };
}

export function Loans({ onSubmit, values }: LoansFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: values?.loanAmount ?? 0,
      interestRates: values?.interestRates ?? [3.5],
      amortizationRates: values?.amortizationRates ?? [2],
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      runningCosts: values?.runningCosts ?? 0,
    },
  });

  const t = useTranslations("loan_parameters");

  // Reset form when values prop changes (e.g. after import or parent update)
  useEffect(() => {
    if (values) {
      form.reset({
        loanAmount: values.loanAmount,
        interestRates: values.interestRates,
        amortizationRates: values.amortizationRates,
        income1: 0,
        income2: 0,
        income3: 0,
        income4: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        runningCosts: values.runningCosts,
      });
    }
  }, [values, form]);

  return (
    <Card>
      <CardHeader>
        <HandCoins className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("title_aria")}>
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              onSubmit({
                loanParameters: {
                  amount: values.loanAmount,
                  interestRates: values.interestRates,
                  amortizationRates: values.amortizationRates,
                },
                runningCosts: values.runningCosts,
              });
            })}
            className="space-y-6"
          >
            <Box className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="calculator-form-label">
                      {t("loan_amount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        aria-label={t("loan_amount_aria")}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={() => {
                          if (form.formState.dirtyFields["loanAmount"]) {
                            const values = form.getValues();
                            onSubmit({
                              loanParameters: {
                                amount: values.loanAmount,
                                interestRates: values.interestRates,
                                amortizationRates: values.amortizationRates,
                              },
                              runningCosts: values.runningCosts,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Box className="calculator-form-box">
                <FormLabel className="calculator-form-box-form-label">
                  {t("interest_rates")}
                </FormLabel>
                <Box
                  className="flex flex-wrap gap-4"
                  aria-label={t("interest_rates_aria")}
                >
                  {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(
                    (rate) => (
                      <FormField
                        key={rate}
                        control={form.control}
                        name="interestRates"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(rate)}
                                aria-label={`${rate}%`}
                                onCheckedChange={(checked: boolean) => {
                                  const newValue = checked
                                    ? [...field.value, rate]
                                    : field.value.filter(
                                        (r: number) => r !== rate
                                      );
                                  field.onChange(newValue);
                                  const values = form.getValues();
                                  onSubmit({
                                    loanParameters: {
                                      amount: values.loanAmount,
                                      interestRates: newValue,
                                      amortizationRates:
                                        values.amortizationRates,
                                    },
                                    runningCosts: values.runningCosts,
                                  });
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                              {rate}%
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    )
                  )}
                </Box>
              </Box>

              <Box className="calculator-form-box">
                <FormLabel className="calculator-form-box-form-label">
                  {t("amortization_rates")}
                </FormLabel>
                <Box
                  className="flex flex-wrap gap-4"
                  aria-label={t("amortization_rates_aria")}
                >
                  {[0, 1, 2, 3, 4, 5].map((rate) => (
                    <FormField
                      key={rate}
                      control={form.control}
                      name="amortizationRates"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes(rate)}
                              aria-label={`${rate}%`}
                              onCheckedChange={(checked: boolean) => {
                                const newValue = checked
                                  ? [...field.value, rate]
                                  : field.value.filter(
                                      (r: number) => r !== rate
                                    );
                                field.onChange(newValue);
                                const values = form.getValues();
                                onSubmit({
                                  loanParameters: {
                                    amount: values.loanAmount,
                                    interestRates: values.interestRates,
                                    amortizationRates: newValue,
                                  },
                                  runningCosts: values.runningCosts,
                                });
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                            {rate}%
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </Box>
              </Box>

              <FormField
                control={form.control}
                name="runningCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="calculator-form-label">
                      {t("running_costs")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        aria-label={t("running_costs_aria")}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={() => {
                          if (form.formState.dirtyFields["runningCosts"]) {
                            const values = form.getValues();
                            onSubmit({
                              loanParameters: {
                                amount: values.loanAmount,
                                interestRates: values.interestRates,
                                amortizationRates: values.amortizationRates,
                              },
                              runningCosts: values.runningCosts,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
