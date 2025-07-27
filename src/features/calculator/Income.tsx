"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Box } from "@/components/ui/Box";
import { Checkbox } from "@/components/ui/Checkbox";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/Form";
import { StepHeader } from "@/components/ui/StepHeader";
import { kommunalskattData } from "@/data/kommunalskatt_2025";
import type { KommunData } from "@/lib/types";

import { IncomeFieldGrid } from "./IncomeFieldGrid";
import { IncomeSection } from "./IncomeSection";
import { KommunSearchDropdown } from "./KommunSearchDropdown";
import { NumberOfAdultsRadioGroup } from "./NumberOfAdultsRadioGroup";
import { SecondaryIncomeTaxSlider } from "./SecondaryIncomeTaxSlider";

const formSchema = z.object({
  income1: z.number().min(0),
  income2: z.number().min(0),
  secondaryIncome1: z.number().min(0),
  secondaryIncome2: z.number().min(0),
  childBenefits: z.number().min(0),
  otherBenefits: z.number().min(0),
  otherIncomes: z.number().min(0),
  currentBuffer: z.number().min(0),
  selectedKommun: z.string().optional(),
  includeChurchTax: z.boolean().optional(),
  secondaryIncomeTaxRate: z.number().min(25).max(40),
});

interface IncomeFormValues {
  income1: number;
  income2: number;
  secondaryIncome1: number;
  secondaryIncome2: number;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
  currentBuffer: number;
  selectedKommun?: string;
  includeChurchTax?: boolean;
  secondaryIncomeTaxRate: number;
}

interface IncomeFormProps {
  values: IncomeFormValues;
  onChange: (values: IncomeFormValues) => void;
  numberOfAdults: "1" | "2";
  onNumberOfAdultsChange: (value: "1" | "2") => void;
}

export const Income = ({
  values,
  onChange,
  numberOfAdults,
  onNumberOfAdultsChange,
}: IncomeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: values,
  });

  const t = useTranslations("income");
  const kommunList = kommunalskattData as KommunData[];

  useEffect(() => {
    if (values) {
      form.reset(values);
    }
  }, [values, form]);

  const handleAdultsChange = (value: "1" | "2") => {
    onNumberOfAdultsChange(value);
    // Always clear income2 and secondaryIncome2 when switching
    form.setValue("income2", 0);
    form.setValue("secondaryIncome2", 0);
    const currentValues = form.getValues();
    onChange({
      ...currentValues,
      income2: 0,
      secondaryIncome2: 0,
    });
  };

  const handleFieldChange = () => {
    const currentValues = form.getValues();
    onChange(currentValues);
  };

  const selectedKommun = form.watch("selectedKommun");
  const selectedKommunData = useMemo(() => {
    return kommunList.find((k) => k.kommunNamn === selectedKommun);
  }, [selectedKommun, kommunList]);

  // Calculate total income for display (exclude currentBuffer and non-numeric fields)
  const totalIncome = Object.entries(form.watch())
    .filter(
      ([key]) =>
        key !== "currentBuffer" &&
        key !== "selectedKommun" &&
        key !== "includeChurchTax" &&
        key !== "secondaryIncomeTaxRate"
    )
    .reduce((sum, [, val]) => sum + (typeof val === "number" ? val : 0), 0);

  return (
    <div>
      <StepHeader step="income">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("total_monthly_income")}:{" "}
            <CurrencyDisplay
              amount={totalIncome}
              className="font-semibold"
              showDecimals={false}
              size="md"
              variant="success"
            />
          </span>
        </div>
      </StepHeader>

      <div>
        <Form {...form}>
          <form data-testid="income-form">
            <Box className="space-y-4">
              <div>
                <NumberOfAdultsRadioGroup
                  value={numberOfAdults}
                  onChange={handleAdultsChange}
                />
              </div>

              {/* Kommun Selection and Church Tax */}
              <div className="space-y-4">
                <KommunSearchDropdown
                  form={form}
                  onFieldChange={handleFieldChange}
                />

                {/* Church Tax Checkbox */}
                <FormField
                  control={form.control}
                  name="includeChurchTax"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange();
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                        {t("include_church_tax")}
                        {selectedKommunData && field.value && (
                          <span className="text-muted-foreground ml-2">
                            (+{selectedKommunData.kyrkoSkatt}%)
                          </span>
                        )}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <IncomeFieldGrid
                  form={form}
                  numberOfAdults={numberOfAdults}
                  primaryField={{
                    name: "income1",
                    label: t("income1"),
                    ariaLabel: t("income1_aria"),
                  }}
                  secondaryField={{
                    name: "income2",
                    label: t("income2"),
                    ariaLabel: t("income2_aria"),
                  }}
                  onFieldChange={handleFieldChange}
                />
              </div>

              {/* Secondary Income Accordion */}
              <div className="mt-6">
                <Accordion collapsible className="w-full" type="single">
                  <AccordionItem value="secondary-income">
                    <AccordionTrigger
                      className="py-4 text-left hover:no-underline transition-colors"
                      data-testid="extra-incomes-toggle"
                    >
                      <span className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">
                          {t("add_extra_incomes")}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-muted-foreground mr-2">
                          {t("optional")}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-4">
                      <div className="space-y-4" id="extra-incomes-section">
                        <IncomeFieldGrid
                          form={form}
                          numberOfAdults={numberOfAdults}
                          primaryField={{
                            name: "secondaryIncome1",
                            label: t("secondaryIncome1"),
                            ariaLabel: t("secondaryIncome1_aria"),
                          }}
                          secondaryField={{
                            name: "secondaryIncome2",
                            label: t("secondaryIncome2"),
                            ariaLabel: t("secondaryIncome2_aria"),
                          }}
                          onFieldChange={handleFieldChange}
                        />

                        <SecondaryIncomeTaxSlider
                          form={form}
                          isVisible={
                            form.watch("secondaryIncome1") > 0 ||
                            form.watch("secondaryIncome2") > 0
                          }
                          onFieldChange={handleFieldChange}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* <div className="border-b -border" /> */}
              </div>

              {/* Additional Income Fields */}
              <IncomeSection
                fields={[
                  {
                    name: "childBenefits",
                    label: t("child_benefits"),
                    ariaLabel: t("child_benefits_aria"),
                  },
                  {
                    name: "otherBenefits",
                    label: t("other_benefits"),
                    ariaLabel: t("other_benefits_aria"),
                  },
                  {
                    name: "otherIncomes",
                    label: t("other_incomes"),
                    ariaLabel: t("other_incomes_aria"),
                  },
                  {
                    name: "currentBuffer",
                    label: t("current_buffer_label"),
                    ariaLabel: t("current_buffer_aria"),
                  },
                ]}
                form={form}
                onFieldChange={handleFieldChange}
              />
            </Box>
          </form>
        </Form>
      </div>
    </div>
  );
};

export type { IncomeFormValues };
