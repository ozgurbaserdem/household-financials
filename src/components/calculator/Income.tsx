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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  income1: z.number().min(0),
  income2: z.number().min(0),
  income3: z.number().min(0),
  income4: z.number().min(0),
  childBenefits: z.number().min(0),
  otherBenefits: z.number().min(0),
  otherIncomes: z.number().min(0),
});

interface IncomeFormProps {
  onSubmit: (state: Partial<CalculatorState>) => void;
  values?: {
    income1: number;
    income2: number;
    income3: number;
    income4: number;
    childBenefits: number;
    otherBenefits: number;
    otherIncomes: number;
  };
}

export function Income({ onSubmit, values }: IncomeFormProps) {
  const [showExtraIncomes, setShowExtraIncomes] = useState(false);
  const [numberOfAdults, setNumberOfAdults] = useState<"1" | "2">("1");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
    },
  });

  const t = useTranslations("income");

  // Reset form when values prop changes (e.g. after import)
  useEffect(() => {
    if (values) {
      form.reset(values);
    }
  }, [values, form]);

  // Handle number of adults change
  const handleAdultsChange = (value: "1" | "2") => {
    setNumberOfAdults(value);
    if (value === "1") {
      // Clear income2 and income4 when switching to 1 adult
      form.setValue("income2", 0);
      form.setValue("income4", 0);
      const currentValues = form.getValues();
      onSubmit({
        ...currentValues,
        income2: 0,
        income4: 0,
        grossIncome2: 0,
        grossIncome4: 0,
      });
    }
  };

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
            data-testid="income-form"
            onSubmit={form.handleSubmit((values) => {
              onSubmit({
                income1: values.income1,
                income2: values.income2,
                income3: values.income3,
                income4: values.income4,
                childBenefits: values.childBenefits,
                otherBenefits: values.otherBenefits,
                otherIncomes: values.otherIncomes,
                grossIncome1: values.income1,
                grossIncome2: values.income2,
                grossIncome3: values.income3,
                grossIncome4: values.income4,
              });
            })}
          >
            <Box className="grid grid-cols-1 gap-6">
              {/* Number of adults radio group with accessible fieldset/legend */}
              <fieldset>
                <legend
                  id="adults-group-label"
                  className="calculator-form-label"
                  aria-label={t("number_of_adults_full")}
                >
                  {t("number_of_adults")}
                </legend>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="adults-group-label"
                    value={numberOfAdults}
                    onValueChange={(value: string) =>
                      handleAdultsChange(value as "1" | "2")
                    }
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t("one_adult")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t("two_adults")}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </fieldset>

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
                              childBenefits: values.childBenefits,
                              otherBenefits: values.otherBenefits,
                              otherIncomes: values.otherIncomes,
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
                  <FormItem className={numberOfAdults === "1" ? "hidden" : ""}>
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
                              childBenefits: values.childBenefits,
                              otherBenefits: values.otherBenefits,
                              otherIncomes: values.otherIncomes,
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
                  <Box
                    id="extra-incomes-section"
                    className="space-y-6"
                    aria-hidden={!showExtraIncomes}
                  >
                    <FormField
                      control={form.control}
                      aria-hidden={!showExtraIncomes}
                      name="income3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="calculator-form-label">
                            {t("income3")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              aria-hidden={!showExtraIncomes}
                              tabIndex={showExtraIncomes ? 0 : -1}
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
                                    childBenefits: values.childBenefits,
                                    otherBenefits: values.otherBenefits,
                                    otherIncomes: values.otherIncomes,
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
                        <FormItem
                          className={numberOfAdults === "1" ? "hidden" : ""}
                        >
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
                                    childBenefits: values.childBenefits,
                                    otherBenefits: values.otherBenefits,
                                    otherIncomes: values.otherIncomes,
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

              {/* Additional Income Fields */}
              <Box className="space-y-6">
                <FormField
                  control={form.control}
                  name="childBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="calculator-form-label">
                        {t("child_benefits")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          aria-label={t("child_benefits_aria")}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={() => {
                            if (form.formState.dirtyFields["childBenefits"]) {
                              const values = form.getValues();
                              onSubmit({
                                income1: values.income1,
                                income2: values.income2,
                                income3: values.income3,
                                income4: values.income4,
                                childBenefits: values.childBenefits,
                                otherBenefits: values.otherBenefits,
                                otherIncomes: values.otherIncomes,
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
                  name="otherBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="calculator-form-label">
                        {t("other_benefits")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          aria-label={t("other_benefits_aria")}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={() => {
                            if (form.formState.dirtyFields["otherBenefits"]) {
                              const values = form.getValues();
                              onSubmit({
                                income1: values.income1,
                                income2: values.income2,
                                income3: values.income3,
                                income4: values.income4,
                                childBenefits: values.childBenefits,
                                otherBenefits: values.otherBenefits,
                                otherIncomes: values.otherIncomes,
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
                  name="otherIncomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="calculator-form-label">
                        {t("other_incomes")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          aria-label={t("other_incomes_aria")}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          onBlur={() => {
                            if (form.formState.dirtyFields["otherIncomes"]) {
                              const values = form.getValues();
                              onSubmit({
                                income1: values.income1,
                                income2: values.income2,
                                income3: values.income3,
                                income4: values.income4,
                                childBenefits: values.childBenefits,
                                otherBenefits: values.otherBenefits,
                                otherIncomes: values.otherIncomes,
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
            </Box>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
