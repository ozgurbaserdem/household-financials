"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { HandCoins, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { LoanInputField } from "./LoanInputField";
import { RateCheckboxGroup } from "./RateCheckboxGroup";

const formSchema = z.object({
  loanAmount: z.number().min(0),
  interestRates: z.array(z.number()),
  amortizationRates: z.array(z.number()),
});

export type LoansFormValues = z.infer<typeof formSchema>;

interface LoansFormProps {
  onChange: (values: LoansFormValues) => void;
  values?: LoansFormValues;
}

export function Loans({ onChange, values }: LoansFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: values?.loanAmount ?? 0,
      interestRates: values?.interestRates ?? [3.5],
      amortizationRates: values?.amortizationRates ?? [2],
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
      });
    }
  }, [values, form]);

  // Call onChange on every field change
  const handleFieldChange = () => {
    const currentValues = form.getValues();
    onChange(currentValues);
  };

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
              <form data-testid="loan-form" className="space-y-6">
                <Box className="grid grid-cols-1 gap-6">
                  <LoanInputField
                    form={form}
                    name="loanAmount"
                    label={t("loan_amount")}
                    ariaLabel={t("loan_amount_aria")}
                    onBlur={handleFieldChange}
                  />

                  <RateCheckboxGroup
                    form={form}
                    fieldName="interestRates"
                    label={t("interest_rates")}
                    options={[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]}
                    ariaLabel={t("interest_rates_aria")}
                    onChange={(newValue) => {
                      form.setValue("interestRates", newValue);
                      handleFieldChange();
                    }}
                  />

                  <RateCheckboxGroup
                    form={form}
                    fieldName="amortizationRates"
                    label={t("amortization_rates")}
                    options={[0, 1, 2, 3, 4, 5]}
                    ariaLabel={t("amortization_rates_aria")}
                    onChange={(newValue) => {
                      form.setValue("amortizationRates", newValue);
                      handleFieldChange();
                    }}
                  />
                </Box>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
