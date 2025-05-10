"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  calculateNetIncome,
  calculateNetIncomeSecond,
} from "@/lib/calculations";
import { Calculator, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
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
  runningCosts: z.number().min(0),
});

interface CalculatorFormProps {
  onSubmit: (state: Partial<CalculatorState>) => void;
  values?: {
    loanAmount: number;
    interestRates: number[];
    amortizationRates: number[];
    income1: number;
    income2: number;
    income3: number;
    income4: number;
    runningCosts: number;
  };
}

export function CalculatorForm({ onSubmit, values }: CalculatorFormProps) {
  const [showExtraIncomes, setShowExtraIncomes] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 0,
      interestRates: [3.5],
      amortizationRates: [2],
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
      runningCosts: 0,
    },
  });

  const t = useTranslations("loan_parameters");

  // Reset form when values prop changes (e.g. after import)
  useEffect(() => {
    if (values) {
      form.reset(values);
    }
  }, [values, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const netIncome1 = calculateNetIncome(values.income1);
    const netIncome2 = calculateNetIncome(values.income2);
    const netIncome3 = calculateNetIncomeSecond(values.income3);
    const netIncome4 = calculateNetIncomeSecond(values.income4);
    onSubmit({
      loanParameters: {
        amount: values.loanAmount,
        interestRates: values.interestRates,
        amortizationRates: values.amortizationRates,
      },
      income1: netIncome1,
      income2: netIncome2,
      income3: netIncome3,
      income4: netIncome4,
      grossIncome1: values.income1,
      grossIncome2: values.income2,
      grossIncome3: values.income3,
      grossIncome4: values.income4,
      runningCosts: values.runningCosts,
    });
  };

  return (
    <Card>
      <CardHeader>
        <Calculator className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("title_aria")}>
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((rate) => (
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

              <Box className="calculator-form-box">
                <FormLabel className="calculator-form-box-form-label">
                  {t("amortization_rates")}
                </FormLabel>
                <Box
                  className="flex flex-wrap gap-4"
                  aria-label={t("amortization_rates_aria")}
                >
                  {[1, 2, 3, 4, 5].map((rate) => (
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
                name="income1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="calculator-form-label">
                      {t("income1")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        aria-label={t("income1_aria")}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="income2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="calculator-form-label">
                      {t("income2")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        aria-label={t("income2_aria")}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Collapsible extra incomes */}
              <Box
                className={`
                          border border-gray-200 dark:border-gray-700 
                          rounded-md mb-2
                          transition-all duration-300 ease-in-out
                          ${showExtraIncomes ? "px-2 pb-2" : "p-0"}
                        `}
              >
                <Button
                  type="button"
                  onClick={() => setShowExtraIncomes((v) => !v)}
                  aria-expanded={showExtraIncomes}
                  aria-controls="extra-incomes-section"
                  className={`
                    bg-white hover:bg-gray-100 text-black
                    dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
                    w-full flex items-center gap-2 justify-start shadow-none
                    p-2
                    `}
                >
                  <div
                    className={`transform transition-transform duration-300 ${
                      showExtraIncomes ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  {t("add_extra_incomes")}
                </Button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${showExtraIncomes ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
                >
                  <Box id="extra-incomes-section" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="income3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="calculator-form-label">
                            {t("income3")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              aria-label={t("income3_aria")}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="income4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="calculator-form-label">
                            {t("income4")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              aria-label={t("income4_aria")}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Box>
                </div>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
            <Button
              type="submit"
              variant="outline"
              aria-label={t("calculate_aria")}
              className="bg-white hover:bg-gray-100 text-black dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white"
            >
              {t("calculate")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
