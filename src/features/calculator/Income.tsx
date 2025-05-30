"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { IncomeInputField } from "./IncomeInputField";
import { NumberOfAdultsRadioGroup } from "./NumberOfAdultsRadioGroup";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  income1: z.number().min(0),
  income2: z.number().min(0),
  secondaryIncome1: z.number().min(0),
  secondaryIncome2: z.number().min(0),
  childBenefits: z.number().min(0),
  otherBenefits: z.number().min(0),
  otherIncomes: z.number().min(0),
  currentBuffer: z.number().min(0),
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
}

interface IncomeFormProps {
  values: IncomeFormValues;
  onChange: (values: IncomeFormValues) => void;
  numberOfAdults: "1" | "2";
  onNumberOfAdultsChange: (value: "1" | "2") => void;
}

export function Income({
  values,
  onChange,
  numberOfAdults,
  onNumberOfAdultsChange,
}: IncomeFormProps) {
  const [showExtraIncomes, setShowExtraIncomes] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
  });

  const t = useTranslations("income");

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

  // Calculate total income for display (exclude currentBuffer)
  const totalIncome = Object.entries(form.watch())
    .filter(([key]) => key !== "currentBuffer")
    .reduce((sum, [, val]) => sum + (val || 0), 0);

  return (
    <Card gradient glass>
      <CardHeader>
        <CardIcon>
          <Wallet className="w-6 h-6 text-green-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={t("title_aria")}>
            {t("title")}
          </CardTitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-300 mt-1"
          >
            {t("total_monthly_income")}:{" "}
            <span className="text-green-400 font-semibold">
              {new Intl.NumberFormat("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              }).format(totalIncome)}
            </span>
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
            <Box className="space-y-6">
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

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
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
              </motion.div>

              {/* Collapsible extra incomes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button
                  type="button"
                  variant="gradient2"
                  onClick={() => setShowExtraIncomes((v) => !v)}
                  aria-expanded={showExtraIncomes}
                  aria-controls="extra-incomes-section"
                  data-testid="extra-incomes-toggle"
                  className="w-full glass hover:bg-white/10 border-gray-600 text-gray-100 
                           flex items-center gap-2 justify-between group transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: showExtraIncomes ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                    {t("add_extra_incomes")}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300">
                    {t("optional")}
                  </span>
                </Button>

                <AnimatePresence>
                  {showExtraIncomes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4 overflow-hidden"
                    >
                      <Box
                        id="extra-incomes-section"
                        className="space-y-4 p-4 glass rounded-xl"
                      >
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
                    </motion.div>
                  )}
                </AnimatePresence>
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
}

export type { IncomeFormValues };
