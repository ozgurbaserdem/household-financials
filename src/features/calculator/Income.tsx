"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/ModernCard";
import { CardContent } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { TrendingUp, Wallet, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/Box";
import { IncomeInputField } from "./IncomeInputField";
import { NumberOfAdultsRadioGroup } from "./NumberOfAdultsRadioGroup";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/Form";
import kommunalskattData from "@/data/kommunalskatt_2025.json";
import type { KommunData } from "@/lib/types";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

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
  const titleRef = useFocusOnMount();
  const kommunList = kommunalskattData as KommunData[];
  const isMobile = useIsTouchDevice();

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
        key !== "includeChurchTax"
    )
    .reduce((sum, [, val]) => sum + (typeof val === "number" ? val : 0), 0);

  return (
    <Card gradient glass animate={!isMobile} hover={false}>
      <CardHeader>
        <CardIcon>
          <Wallet className="w-6 h-6 text-green-400" />
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
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-300 mt-1"
          >
            {t("total_monthly_income")}:{" "}
            <CurrencyDisplay
              amount={totalIncome}
              variant="positive"
              size="md"
              showDecimals={false}
              className="font-semibold"
            />
          </motion.p>
        </Box>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <TrendingUp className="w-8 h-8 text-green-400" />
        </motion.div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form data-testid="income-form">
            <Box className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <NumberOfAdultsRadioGroup
                  value={numberOfAdults}
                  onChange={handleAdultsChange}
                />
              </motion.div>

              {/* Kommun Selection and Church Tax */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-4"
              >
                {/* Kommun Select */}
                <div className="relative">
                  <Label
                    htmlFor="kommun-search"
                    className="text-sm font-medium text-gray-200 mb-2 block"
                  >
                    Välj kommun
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="kommun-search"
                      type="text"
                      placeholder="Sök kommun..."
                      value={kommunSearch}
                      onChange={(e) => {
                        setKommunSearch(e.target.value);
                        setShowKommunDropdown(true);
                      }}
                      onFocus={() => setShowKommunDropdown(true)}
                      className="pl-10 modern-input"
                    />
                    {selectedKommunData && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300">
                        {selectedKommunData.kommunalSkatt}%
                      </div>
                    )}
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showKommunDropdown && filteredKommuner.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="kommun-dropdown absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-gray-900/70 backdrop-blur-md rounded-lg border border-gray-700 shadow-xl"
                      >
                        {filteredKommuner.slice(0, 10).map((kommun) => (
                          <button
                            key={kommun.kommunNamn}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-800 text-gray-100 text-sm transition-colors flex justify-between items-center"
                            onClick={() => {
                              form.setValue(
                                "selectedKommun",
                                kommun.kommunNamn
                              );
                              setKommunSearch(kommun.kommunNamn);
                              setShowKommunDropdown(false);
                              handleFieldChange();
                            }}
                          >
                            <span>{kommun.kommunNamn}</span>
                            <span className="text-gray-400">
                              {kommun.kommunalSkatt}%
                            </span>
                          </button>
                        ))}
                        {filteredKommuner.length > 10 && (
                          <div className="px-4 py-2 text-xs text-gray-300 border-t border-gray-600">
                            Visar {10} av {filteredKommuner.length} kommuner
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      <FormLabel className="text-sm font-normal text-gray-200 cursor-pointer">
                        Räkna med kyrkoavgift
                        {selectedKommunData && field.value && (
                          <span className="text-gray-400 ml-2">
                            (+{selectedKommunData.kyrkoSkatt}%)
                          </span>
                        )}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IncomeInputField
                    form={form}
                    name="income1"
                    label={t("income1")}
                    ariaLabel={t("income1_aria")}
                    onBlur={handleFieldChange}
                    className="modern-input"
                  />

                  <AnimatePresence>
                    {numberOfAdults === "2" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IncomeInputField
                          form={form}
                          name="income2"
                          label={t("income2")}
                          ariaLabel={t("income2_aria")}
                          onBlur={handleFieldChange}
                          className="modern-input"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>

              {/* Secondary Income Accordion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="secondary-income"
                    className="border-none"
                  >
                    <AccordionTrigger
                      className="glass hover:bg-white/10 border border-gray-600 text-gray-100 
                                 px-4 py-3 rounded-lg group transition-all duration-300
                                 hover:no-underline [&[data-state=open]]:rounded-b-none"
                      data-testid="extra-incomes-toggle"
                    >
                      <span className="flex items-center justify-between w-full">
                        <span>{t("add_extra_incomes")}</span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 mr-2">
                          {t("optional")}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-0">
                      <Box
                        id="extra-incomes-section"
                        className="p-4 glass rounded-b-lg border border-t-0 border-gray-600"
                      >
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <IncomeInputField
                            form={form}
                            name="secondaryIncome1"
                            label={t("secondaryIncome1")}
                            ariaLabel={t("secondaryIncome1_aria")}
                            onBlur={handleFieldChange}
                            className="modern-input"
                          />
                          {numberOfAdults === "2" && (
                            <IncomeInputField
                              form={form}
                              name="secondaryIncome2"
                              label={t("secondaryIncome2")}
                              ariaLabel={t("secondaryIncome2_aria")}
                              onBlur={handleFieldChange}
                              className="modern-input"
                            />
                          )}
                        </Box>
                      </Box>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>

              {/* Additional Income Fields with Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="space-y-2">
                    <IncomeInputField
                      form={form}
                      name="childBenefits"
                      label={t("child_benefits")}
                      ariaLabel={t("child_benefits_aria")}
                      onBlur={handleFieldChange}
                      className="modern-input"
                    />
                  </Box>

                  <Box className="space-y-2">
                    <IncomeInputField
                      form={form}
                      name="otherBenefits"
                      label={t("other_benefits")}
                      ariaLabel={t("other_benefits_aria")}
                      onBlur={handleFieldChange}
                      className="modern-input"
                    />
                  </Box>
                </Box>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Box className="space-y-2">
                    <IncomeInputField
                      form={form}
                      name="otherIncomes"
                      label={t("other_incomes")}
                      ariaLabel={t("other_incomes_aria")}
                      onBlur={handleFieldChange}
                      className="modern-input"
                    />
                  </Box>

                  <Box className="space-y-2">
                    <IncomeInputField
                      form={form}
                      name="currentBuffer"
                      label={t("current_buffer_label")}
                      ariaLabel={t("current_buffer_aria")}
                      onBlur={handleFieldChange}
                      className="modern-input"
                    />
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export type { IncomeFormValues };
