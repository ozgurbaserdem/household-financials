"use client";

import {
  FlagIcon as TargetIcon,
  BanknotesIcon as PiggyBankIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart3,
  HandCoins,
  List,
  ListChecks,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { XIcon } from "@/components/ui/XIcon";
import { useRouter } from "@/i18n/navigation";
import { getStepParameter } from "@/shared/utils/navigation";

import { CalculatorPreviews } from "./CalculatorPreviews";
import { FeatureCard } from "./FeatureCard";
import { NavigableCard } from "./NavigableCard";
import { ScrollIndicator } from "./ScrollIndicator";
import { SectionHeader } from "./SectionHeader";
import { StepCard } from "./StepCard";

export const LandingPage = () => {
  const t = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hide indicator when user scrolls more than 100px
      setShowScrollIndicator(scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartAnalysis = () => {
    const param = getStepParameter(locale);
    const stepValue = locale === "sv" ? "inkomst" : "income";
    router.push({
      pathname: "/hushallsbudget",
      query: { [param]: stepValue },
    });
  };

  const handleScrollDown = () => {
    const nextSection = document.querySelector('[data-section="how-it-works"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const steps = [
    {
      icon: Wallet,
      title: t("steps.income.title"),
      description: t("steps.income.description"),
      colorClass: "text-golden",
    },
    {
      icon: HandCoins,
      title: t("steps.loans.title"),
      description: t("steps.loans.description"),
      colorClass: "text-golden",
    },
    {
      icon: List,
      title: t("steps.expenses.title"),
      description: t("steps.expenses.description"),
      colorClass: "text-golden",
    },
    {
      icon: ListChecks,
      title: t("steps.summary.title"),
      description: t("steps.summary.description"),
      colorClass: "text-golden",
    },
    {
      icon: BarChart3,
      title: t("steps.results.title"),
      description: t("steps.results.description"),
      colorClass: "text-golden",
    },
  ];

  const features = [
    {
      icon: PiggyBankIcon,
      title: t("features.tax.title"),
      description: t("features.tax.description"),
    },
    {
      icon: ChartBarIcon,
      title: t("features.loan.title"),
      description: t("features.loan.description"),
    },
    {
      icon: TargetIcon,
      title: t("features.expense.title"),
      description: t("features.expense.description"),
    },
    {
      icon: LightBulbIcon,
      title: t("features.insights.title"),
      description: t("features.insights.description"),
    },
  ];

  return (
    <Box className="min-h-screen bg-background relative pt-20 lg:pt-24">
      <ScrollIndicator
        isVisible={showScrollIndicator}
        text={t("scrollIndicator")}
        onScroll={handleScrollDown}
      />

      <div className="relative z-10 max-w-7xl mx-auto container-padding">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center py-20">
          <h1 className="heading-1 mb-6 max-w-4xl text-gradient-subtle">
            <span>{t("hero.title.start")} </span>
            <span className="font-serif italic text-gradient-golden">
              {t("hero.title.highlight")}
            </span>
          </h1>

          <p className="body-lg text-muted-foreground mb-12 max-w-2xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              aria-label={t("accessibility.start_budget_button")}
              size="lg"
              variant="default"
              onClick={handleStartAnalysis}
            >
              {t("hero.cta")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24" data-section="how-it-works">
          <SectionHeader title={t("howItWorks.title")} />

          {/* Horizontal Step Flow */}
          <div className="relative">
            {/* Steps container */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start max-w-6xl mx-auto relative space-y-16 md:space-y-0 md:space-x-8 lg:space-x-16 px-4">
              {steps.map((step, index) => (
                <StepCard
                  key={step.title}
                  colorClass={step.colorClass}
                  description={step.description}
                  icon={step.icon}
                  stepNumber={index + 1}
                  title={step.title}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Previews Section */}
        <CalculatorPreviews />

        {/* Features Section */}
        <section className="py-24">
          <SectionHeader title={t("features.title")} />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title}>
                <FeatureCard
                  description={feature.description}
                  icon={feature.icon}
                  title={feature.title}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Other Calculators Section */}
        <section className="py-24">
          <SectionHeader title={t("other_calculators.title")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <NavigableCard
              ariaLabel={t("accessibility.navigate_to_calculator", {
                calculatorTitle: t("other_calculators.compound_interest.title"),
              })}
              description={t("other_calculators.compound_interest.description")}
              icon={TrendingUp}
              title={t("other_calculators.compound_interest.title")}
              onClick={() => router.push("/ranta-pa-ranta")}
            />

            <NavigableCard
              ariaLabel={t("accessibility.navigate_to_calculator", {
                calculatorTitle: t("other_calculators.budget_calculator.title"),
              })}
              description={t("other_calculators.budget_calculator.description")}
              icon={CalculatorIcon}
              title={t("other_calculators.budget_calculator.title")}
              onClick={() => router.push("/hushallsbudget")}
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="heading-2 text-gradient-subtle mb-6">
              {t("finalCta.title")}
            </h2>
            <p className="body-lg text-muted-foreground mb-12 leading-relaxed">
              {t("finalCta.subtitle")}
            </p>
            <Button
              aria-label={t("accessibility.start_budget_button")}
              className="text-lg px-8 py-4 rounded-xl group"
              size="lg"
              variant="default"
              onClick={handleStartAnalysis}
            >
              {t("finalCta.button")}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-6">
                <a
                  aria-label={t("footer.follow_x")}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  href="https://x.com/budgetkollen"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <XIcon className="w-6 h-6" />
                </a>
              </div>
              <p className="text-muted-foreground text-sm">
                {t("footer.copyright")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </Box>
  );
};
