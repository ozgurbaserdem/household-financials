"use client";

import {
  FlagIcon as TargetIcon,
  BanknotesIcon as PiggyBankIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ChevronDownIcon,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardIcon,
} from "@/components/ui/Card";
import { XIcon } from "@/components/ui/XIcon";
import { useRouter } from "@/i18n/navigation";
import { getStepParameter } from "@/lib/utils/navigation";

import { CalculatorPreviews } from "./CalculatorPreviews";

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
      colorClass: "text-green-500 dark:text-green-400",
    },
    {
      icon: HandCoins,
      title: t("steps.loans.title"),
      description: t("steps.loans.description"),
      colorClass: "text-yellow-500 dark:text-yellow-400",
    },
    {
      icon: List,
      title: t("steps.expenses.title"),
      description: t("steps.expenses.description"),
      colorClass: "text-red-500 dark:text-red-400",
    },
    {
      icon: ListChecks,
      title: t("steps.summary.title"),
      description: t("steps.summary.description"),
      colorClass: "text-purple-500 dark:text-purple-400",
    },
    {
      icon: BarChart3,
      title: t("steps.results.title"),
      description: t("steps.results.description"),
      colorClass: "text-blue-500 dark:text-blue-400",
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
      {/* Scroll Indicator - Clean and minimal */}
      {showScrollIndicator && (
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
          onClick={handleScrollDown}
        >
          <div className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group">
            <span className="text-sm mb-2 font-medium">
              {t("scrollIndicator")}
            </span>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto container-padding">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center py-20">
          <h1 className="heading-1 mb-6 max-w-4xl text-gradient-subtle">
            <span>{t("hero.title.start")} </span>
            <span className="font-serif italic">
              {t("hero.title.highlight")}
            </span>
          </h1>

          <p className="body-lg text-muted-foreground mb-12 max-w-2xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="default" onClick={handleStartAnalysis}>
              {t("hero.cta")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24" data-section="how-it-works">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gradient-subtle mb-6">
              {t("howItWorks.title")}
            </h2>
          </div>

          {/* Horizontal Step Flow */}
          <div className="relative">
            {/* Steps container */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start max-w-6xl mx-auto relative space-y-16 md:space-y-0 md:space-x-8 lg:space-x-16 px-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex items-center justify-center mb-4">
                    <step.icon className={`w-8 h-8 ${step.colorClass}`} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-foreground text-background text-sm font-semibold flex items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <h3 className="heading-3 text-foreground mb-2 text-lg">
                    {step.title}
                  </h3>
                  <p className="body-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Previews Section */}
        <CalculatorPreviews />

        {/* Features Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gradient-subtle mb-6">
              {t("features.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title}>
                <Card className="h-full text-center border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                  <CardHeader className="items-center" layout="vertical">
                    <CardIcon
                      className="bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                      size="lg"
                      variant="default"
                    >
                      <feature.icon className="w-8 h-8 text-foreground" />
                    </CardIcon>
                    <CardTitle className="text-center">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Other Calculators Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-gradient-subtle mb-6">
              {t("other_calculators.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <Card
                className="h-full cursor-pointer border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                onClick={() => router.push("/ranta-pa-ranta")}
              >
                <CardHeader>
                  <CardIcon
                    className="bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                    size="lg"
                    variant="default"
                  >
                    <TrendingUp className="w-8 h-8 text-foreground" />
                  </CardIcon>
                  <Box className="flex-1">
                    <CardTitle>
                      {t("other_calculators.compound_interest.title")}
                    </CardTitle>
                  </Box>
                </CardHeader>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t("other_calculators.compound_interest.description")}
                </CardDescription>
              </Card>
            </div>

            <div>
              <Card
                className="h-full cursor-pointer border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                onClick={() => router.push("/hushallsbudget")}
              >
                <CardHeader>
                  <CardIcon
                    className="bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                    size="lg"
                    variant="default"
                  >
                    <CalculatorIcon className="w-8 h-8 text-foreground" />
                  </CardIcon>
                  <Box className="flex-1">
                    <CardTitle>
                      {t("other_calculators.budget_calculator.title")}
                    </CardTitle>
                  </Box>
                </CardHeader>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t("other_calculators.budget_calculator.description")}
                </CardDescription>
              </Card>
            </div>
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
