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
import type { CalculatorState } from "@/lib/types";
import { BadgeDollarSign, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";

const formSchema = z.object({
  income1: z.number().min(0),
  income2: z.number().min(0),
  income3: z.number().min(0),
  income4: z.number().min(0),
});

interface IncomeFormProps {
  onSubmit: (state: Partial<CalculatorState>) => void;
  values?: {
    income1: number;
    income2: number;
    income3: number;
    income4: number;
  };
}

export function Income({ onSubmit, values }: IncomeFormProps) {
  const [showExtraIncomes, setShowExtraIncomes] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
    },
  });

  const t = useTranslations("income");

  // Reset form when values prop changes (e.g. after import)
  useEffect(() => {
    if (values) {
      form.reset(values);
    }
  }, [values, form]);

  return (
    <Card>
      <CardHeader>
        <BadgeDollarSign className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("title_aria")}>
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              onSubmit({
                income1: values.income1,
                income2: values.income2,
                income3: values.income3,
                income4: values.income4,
                grossIncome1: values.income1,
                grossIncome2: values.income2,
                grossIncome3: values.income3,
                grossIncome4: values.income4,
              });
            })}
          >
            <Box className="grid grid-cols-1 gap-6">
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
                        onBlur={() => {
                          if (form.formState.dirtyFields["income1"]) {
                            const values = form.getValues();
                            onSubmit({
                              income1: values.income1,
                              income2: values.income2,
                              income3: values.income3,
                              income4: values.income4,
                              grossIncome1: values.income1,
                              grossIncome2: values.income2,
                              grossIncome3: values.income3,
                              grossIncome4: values.income4,
                            });
                          }
                        }}
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
                        onBlur={() => {
                          if (form.formState.dirtyFields["income2"]) {
                            const values = form.getValues();
                            onSubmit({
                              income1: values.income1,
                              income2: values.income2,
                              income3: values.income3,
                              income4: values.income4,
                              grossIncome1: values.income1,
                              grossIncome2: values.income2,
                              grossIncome3: values.income3,
                              grossIncome4: values.income4,
                            });
                          }
                        }}
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
                      ${showExtraIncomes ? "w-[calc(100%+1rem)] -mx-2" : "w-full"} flex items-center gap-2 justify-start shadow-none
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
                              onBlur={() => {
                                if (form.formState.dirtyFields["income3"]) {
                                  const values = form.getValues();
                                  onSubmit({
                                    income1: values.income1,
                                    income2: values.income2,
                                    income3: values.income3,
                                    income4: values.income4,
                                    grossIncome1: values.income1,
                                    grossIncome2: values.income2,
                                    grossIncome3: values.income3,
                                    grossIncome4: values.income4,
                                  });
                                }
                              }}
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
                              onBlur={() => {
                                if (form.formState.dirtyFields["income4"]) {
                                  const values = form.getValues();
                                  onSubmit({
                                    income1: values.income1,
                                    income2: values.income2,
                                    income3: values.income3,
                                    income4: values.income4,
                                    grossIncome1: values.income1,
                                    grossIncome2: values.income2,
                                    grossIncome3: values.income3,
                                    grossIncome4: values.income4,
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
                </div>
              </Box>
            </Box>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
