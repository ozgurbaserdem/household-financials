"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SliderInput } from "@/components/ui/SliderInput";
import { StepHeader } from "@/components/ui/StepHeader";
import { kommunalskattData } from "@/data/kommunalskatt_2025";
import type { KommunData } from "@/lib/types";

import { IncomeInputField } from "./IncomeInputField";
import { NumberOfAdultsRadioGroup } from "./NumberOfAdultsRadioGroup";

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
  const [kommunSearch, setKommunSearch] = useState("");
  const [showKommunDropdown, setShowKommunDropdown] = useState(false);
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
      if (values.selectedKommun) {
        setKommunSearch(values.selectedKommun);
      }
    }
  }, [values, form]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("#kommun-search") &&
        !target.closest(".kommun-dropdown")
      ) {
        setShowKommunDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Filter and sort kommun list based on search
  const filteredKommuner = useMemo(() => {
    if (!kommunSearch) return kommunList;

    const searchLower = kommunSearch.toLowerCase();
    const filtered = kommunList.filter((kommun) =>
      kommun.kommunNamn.toLowerCase().includes(searchLower)
    );

    // Sort: prioritize names that start with the search term
    return filtered.sort((a, b) => {
      const aStarts = a.kommunNamn.toLowerCase().startsWith(searchLower);
      const bStarts = b.kommunNamn.toLowerCase().startsWith(searchLower);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // If both start or both don't start with search term, sort alphabetically
      return a.kommunNamn.localeCompare(b.kommunNamn, "sv");
    });
  }, [kommunSearch, kommunList]);

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
                {/* Kommun Select */}
                <div className="relative">
                  <Label
                    className="text-sm font-medium text-foreground mb-2 block"
                    htmlFor="kommun-search"
                  >
                    {t("select_municipality")}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      className="!pl-10"
                      id="kommun-search"
                      placeholder={t("search_municipality")}
                      type="text"
                      value={kommunSearch}
                      onChange={(e) => {
                        setKommunSearch(e.target.value);
                        setShowKommunDropdown(true);
                      }}
                      onFocus={() => setShowKommunDropdown(true)}
                    />
                    {selectedKommunData && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {selectedKommunData.kommunalSkatt}%
                      </div>
                    )}
                  </div>

                  {/* Dropdown */}
                  {showKommunDropdown && filteredKommuner.length > 0 && (
                    <div className="kommun-dropdown absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-background/70 backdrop-blur-md rounded-lg border border-border shadow-xl">
                      {filteredKommuner.slice(0, 10).map((kommun) => (
                        <button
                          key={kommun.kommunNamn}
                          className="w-full px-4 py-2 text-left hover:bg-muted text-foreground text-sm transition-colors flex justify-between items-center"
                          type="button"
                          onClick={() => {
                            form.setValue("selectedKommun", kommun.kommunNamn);
                            setKommunSearch(kommun.kommunNamn);
                            setShowKommunDropdown(false);
                            handleFieldChange();
                          }}
                        >
                          <span>{kommun.kommunNamn}</span>
                          <span className="text-muted-foreground">
                            {kommun.kommunalSkatt}%
                          </span>
                        </button>
                      ))}
                      {filteredKommuner.length > 10 && (
                        <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                          {t("showing_municipalities", {
                            shown: 10,
                            total: filteredKommuner.length,
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

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
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IncomeInputField
                    ariaLabel={t("income1_aria")}
                    className="modern-input"
                    form={form}
                    label={t("income1")}
                    name="income1"
                    onBlur={handleFieldChange}
                  />

                  {numberOfAdults === "2" && (
                    <div>
                      <IncomeInputField
                        ariaLabel={t("income2_aria")}
                        className="modern-input"
                        form={form}
                        label={t("income2")}
                        name="income2"
                        onBlur={handleFieldChange}
                      />
                    </div>
                  )}
                </Box>
              </div>

              {/* Secondary Income Accordion */}
              <div className="mt-6">
                <Accordion collapsible className="w-full" type="single">
                  <AccordionItem
                    className="border-none"
                    value="secondary-income"
                  >
                    <AccordionTrigger
                      className="input-base group transition-all duration-300
                                 hover:no-underline [&[data-state=open]]:rounded-b-none"
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
                    <AccordionContent className="pt-0 pb-0">
                      <Box
                        className="p-4 bg-muted/20 rounded-b-xl border border-t-0 border-[rgb(var(--border))]"
                        id="extra-incomes-section"
                      >
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <IncomeInputField
                            ariaLabel={t("secondaryIncome1_aria")}
                            className="modern-input"
                            form={form}
                            label={t("secondaryIncome1")}
                            name="secondaryIncome1"
                            onBlur={handleFieldChange}
                          />
                          {numberOfAdults === "2" && (
                            <IncomeInputField
                              ariaLabel={t("secondaryIncome2_aria")}
                              className="modern-input"
                              form={form}
                              label={t("secondaryIncome2")}
                              name="secondaryIncome2"
                              onBlur={handleFieldChange}
                            />
                          )}
                        </Box>

                        {/* Secondary Income Tax Rate Slider */}
                        {(form.watch("secondaryIncome1") > 0 ||
                          form.watch("secondaryIncome2") > 0) && (
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              {t("secondary_income_tax_rate")}
                            </Label>
                            <div className="text-xs text-muted-foreground mb-2">
                              {t("secondary_income_tax_rate_help")}
                            </div>
                            <FormField
                              control={form.control}
                              name="secondaryIncomeTaxRate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <SliderInput
                                      ariaLabel={t(
                                        "secondary_income_tax_rate_aria"
                                      )}
                                      decimals={0}
                                      max={40}
                                      min={25}
                                      step={1}
                                      suffix="%"
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        handleFieldChange();
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </Box>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Additional Income Fields with Icons */}
              <div className="space-y-4">
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="space-y-2">
                    <IncomeInputField
                      ariaLabel={t("child_benefits_aria")}
                      className="modern-input"
                      form={form}
                      label={t("child_benefits")}
                      name="childBenefits"
                      onBlur={handleFieldChange}
                    />
                  </Box>

                  <Box className="space-y-2">
                    <IncomeInputField
                      ariaLabel={t("other_benefits_aria")}
                      className="modern-input"
                      form={form}
                      label={t("other_benefits")}
                      name="otherBenefits"
                      onBlur={handleFieldChange}
                    />
                  </Box>
                </Box>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="space-y-2">
                    <IncomeInputField
                      ariaLabel={t("other_incomes_aria")}
                      className="modern-input"
                      form={form}
                      label={t("other_incomes")}
                      name="otherIncomes"
                      onBlur={handleFieldChange}
                    />
                  </Box>

                  <Box className="space-y-2">
                    <IncomeInputField
                      ariaLabel={t("current_buffer_aria")}
                      className="modern-input"
                      form={form}
                      label={t("current_buffer_label")}
                      name="currentBuffer"
                      onBlur={handleFieldChange}
                    />
                  </Box>
                </Box>
              </div>
            </Box>
          </form>
        </Form>
      </div>
    </div>
  );
};

export type { IncomeFormValues };
