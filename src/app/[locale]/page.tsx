"use client";

import React from "react";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/Navbar";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { IncomeStep } from "@/components/wizard/steps/IncomeStep";
import { LoansStep } from "@/components/wizard/steps/LoansStep";
import { ExpensesStep } from "@/components/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/components/wizard/steps/SummaryStep";
import { ResultsStep } from "@/components/wizard/steps/ResultsStep";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import HushallskalkylContent from "@/components/hushallskalkyl/HushallskalkylContent";

export default function Home() {
  const t = useTranslations("wizard");
  const [open, setOpen] = React.useState(false);
  const locale = "sv";

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        {/* Hushållskalkyl Section */}
        <Dialog open={open} onOpenChange={setOpen}>
          <Box className="mb-8 p-6 rounded-lg bg-blue-50 dark:bg-blue-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {t("hushallskalkylTitle", {
                  default: "Hushållskalkyl & Hushållsbudget",
                })}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                {t("hushallskalkylDesc", {
                  default:
                    "Skapa din hushållsbudget och hushållskalkyl enkelt med Budgetkollen. Få full kontroll över din ekonomi och planera för framtiden.",
                })}
              </p>
            </div>
            <DialogTrigger asChild>
              <Button variant="default" size="lg">
                {t("hushallskalkylCta", { default: "Läs mer" })}
              </Button>
            </DialogTrigger>
          </Box>
          <DialogContent className="max-w-lg w-full sm:max-w-xl">
            <DialogTitle>
              {locale === "sv"
                ? "Hushållskalkyl & Hushållsbudget"
                : "Household Budget & Calculator"}
            </DialogTitle>
            <HushallskalkylContent locale={locale as "sv" | "en"} hideTitle />
            <Box className="flex flex-col gap-4 mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  {locale === "sv" ? "Stäng" : "Close"}
                </Button>
              </DialogClose>
            </Box>
          </DialogContent>
        </Dialog>
        {/* End Hushållskalkyl Section */}
        <WizardLayout
          steps={[
            { label: t("income"), component: <IncomeStep /> },
            { label: t("loans"), component: <LoansStep /> },
            { label: t("expenses"), component: <ExpensesStep /> },
            { label: t("summary"), component: <SummaryStep /> },
            { label: t("results"), component: <ResultsStep /> },
          ]}
        />
      </Box>
    </Main>
  );
}
