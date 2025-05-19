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
import { HandCoins, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";

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
});

interface LoansFormProps {
  onSubmit: (state: Partial<CalculatorState>) => void;
  values?: {
    loanAmount: number;
    interestRates: number[];
    amortizationRates: number[];
  };
}

export function Loans({ onSubmit, values }: LoansFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isExpanded, setIsExpanded] = useState(!isMobile);
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
    },
  });

  const t = useTranslations("loan_parameters");

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  // Reset form when values prop changes
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
      });
    }
  }, [values, form]);

  return (
    <Card
      className={cn(
        "relative transition-all duration-300",
        isExpanded && !isMobile ? "p-0" : "p-0"
      )}
    >
      {isMobile && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between transition-colors",
            "hover:bg-gray-50 dark:hover:bg-gray-900",
            "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
            "rounded-lg p-4"
          )}
          aria-expanded={isExpanded}
          aria-controls="loan-form-content"
        >
          <div className="flex items-center gap-3">
            <HandCoins className="icon-primary" />
            <CardTitle tabIndex={0} aria-label={t("title_aria")}>
              {isExpanded ? t("hide_loans") : t("add_loans")}
            </CardTitle>
          </div>
          {isExpanded ? (
            <Minus className="h-5 w-5 text-gray-500" />
          ) : (
            <Plus className="h-5 w-5 text-gray-500" />
          )}
        </button>
      )}
      {isExpanded && (
        <>
          {!isMobile ? (
            <CardHeader className={cn("pt-6")}>
              <HandCoins className="icon-primary" />
              <CardTitle tabIndex={0} aria-label={t("title_aria")}>
                {t("title")}
              </CardTitle>
            </CardHeader>
          ) : null}
          <CardContent className="px-6 pb-6">
            <Form {...form}>
              <form
                data-testid="loan-form"
                onSubmit={form.handleSubmit((values) => {
                  onSubmit({
                    loanParameters: {
                      amount: values.loanAmount,
                      interestRates: values.interestRates,
                      amortizationRates: values.amortizationRates,
                    },
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onBlur={() => {
                              if (form.formState.dirtyFields["loanAmount"]) {
                                const values = form.getValues();
                                onSubmit({
                                  loanParameters: {
                                    amount: values.loanAmount,
                                    interestRates: values.interestRates,
                                    amortizationRates: values.amortizationRates,
                                  },
                                });
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Box>
                    <FormLabel className="calculator-form-box-form-label">
                      {t("interest_rates")}
                    </FormLabel>
                    <Box
                      className="flex flex-wrap gap-4"
                      aria-label={t("interest_rates_aria")}
                    >
                      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(
                        (rate) => (
                          <FormField
                            key={rate}
                            control={form.control}
                            name="interestRates"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 min-w-18">
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

                  <Box>
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
                            <FormItem
                              className={`flex items-center space-x-2 ${
                                isMobile ? "min-w-18" : ""
                              }`}
                            >
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
                </Box>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
