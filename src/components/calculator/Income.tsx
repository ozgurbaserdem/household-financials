"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BadgeDollarSign, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { IncomeInputField } from "./IncomeInputField";
import { NumberOfAdultsRadioGroup } from "./NumberOfAdultsRadioGroup";

const formSchema = z.object({
  income1: z.number().min(0),
  income2: z.number().min(0),
  income3: z.number().min(0),
  income4: z.number().min(0),
  childBenefits: z.number().min(0),
  otherBenefits: z.number().min(0),
  otherIncomes: z.number().min(0),
});

interface IncomeFormValues {
  income1: number;
  income2: number;
  income3: number;
  income4: number;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
}

interface IncomeFormProps {
  values: IncomeFormValues;
  onChange: (values: IncomeFormValues) => void;
}

export function Income({ values, onChange }: IncomeFormProps) {
  const [showExtraIncomes, setShowExtraIncomes] = useState(false);
  const [numberOfAdults, setNumberOfAdults] = useState<"1" | "2">("1");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
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
      onChange({
        ...currentValues,
        income2: 0,
        income4: 0,
      });
    }
  };

  // Call onChange on every field change
  const handleFieldChange = () => {
    const currentValues = form.getValues();
    onChange(currentValues);
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
          <form data-testid="income-form">
            <Box className="grid grid-cols-1 gap-6">
              <NumberOfAdultsRadioGroup
                value={numberOfAdults}
                onChange={handleAdultsChange}
              />

              <IncomeInputField
                form={form}
                name="income1"
                label={t("income1")}
                ariaLabel={t("income1_aria")}
                onBlur={handleFieldChange}
              />

              <IncomeInputField
                form={form}
                name="income2"
                label={t("income2")}
                ariaLabel={t("income2_aria")}
                hidden={numberOfAdults === "1"}
                onBlur={handleFieldChange}
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
                    <IncomeInputField
                      form={form}
                      name="income3"
                      label={t("income3")}
                      ariaLabel={t("income3_aria")}
                      onBlur={handleFieldChange}
                    />
                    <IncomeInputField
                      form={form}
                      name="income4"
                      label={t("income4")}
                      ariaLabel={t("income4_aria")}
                      hidden={numberOfAdults === "1"}
                      onBlur={handleFieldChange}
                    />
                  </Box>
                </div>
              </Box>

              {/* Additional Income Fields */}
              <Box className="space-y-6">
                <IncomeInputField
                  form={form}
                  name="childBenefits"
                  label={t("child_benefits")}
                  ariaLabel={t("child_benefits_aria")}
                  onBlur={handleFieldChange}
                />

                <IncomeInputField
                  form={form}
                  name="otherBenefits"
                  label={t("other_benefits")}
                  ariaLabel={t("other_benefits_aria")}
                  onBlur={handleFieldChange}
                />

                <IncomeInputField
                  form={form}
                  name="otherIncomes"
                  label={t("other_incomes")}
                  ariaLabel={t("other_incomes_aria")}
                  onBlur={handleFieldChange}
                />
              </Box>
            </Box>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export type { IncomeFormValues };
