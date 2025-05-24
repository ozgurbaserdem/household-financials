"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { HandCoins } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: values?.loanAmount ?? 0,
      interestRates: values?.interestRates ?? [3.5],
      amortizationRates: values?.amortizationRates ?? [2],
    },
  });

  const t = useTranslations("loan_parameters");

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
    <Card>
      <CardHeader>
        <HandCoins className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("title_aria")}>
          {t("title")}
        </CardTitle>
      </CardHeader>
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
    </Card>
  );
}
