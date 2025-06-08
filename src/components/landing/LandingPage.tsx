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
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface StepIconProps {
  step: number;
  Icon: React.ComponentType<{ className?: string }>;
}

const StepIcon = ({ step, Icon }: StepIconProps) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Step number and icon container */}
      <div className="relative">
        <motion.div
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 backdrop-blur-xl flex items-center justify-center relative"
          transition={{ type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

          <Icon className="w-10 h-10 text-blue-400 relative z-10" />

          {/* Step number badge - positioned outside the overflow area */}
        </motion.div>

        {/* Step number badge - moved outside the motion.div */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white shadow-lg z-30">
          {step}
        </div>
      </div>
    </div>
  );
};

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
    },
    {
      icon: HandCoins,
      title: t("steps.loans.title"),
      description: t("steps.loans.description"),
    },
    {
      icon: List,
      title: t("steps.expenses.title"),
      description: t("steps.expenses.description"),
    },
    {
      icon: ListChecks,
      title: t("steps.summary.title"),
      description: t("steps.summary.description"),
    },
    {
      icon: BarChart3,
      title: t("steps.results.title"),
      description: t("steps.results.description"),
    },
  ];

  const features = [
    {
      icon: PiggyBankIcon,
      title: t("features.tax.title"),
      description: t("features.tax.description"),
      gradient: "from-green-600/20 to-emerald-600/20",
      iconColor: "text-green-400",
    },
    {
      icon: ChartBarIcon,
      title: t("features.loan.title"),
      description: t("features.loan.description"),
      gradient: "from-blue-600/20 to-purple-600/20",
      iconColor: "text-blue-400",
    },
    {
      icon: TargetIcon,
      title: t("features.expense.title"),
      description: t("features.expense.description"),
      gradient: "from-purple-600/20 to-pink-600/20",
      iconColor: "text-purple-400",
    },
    {
      icon: LightBulbIcon,
      title: t("features.insights.title"),
      description: t("features.insights.description"),
      gradient: "from-amber-600/20 to-orange-600/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <Box className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="gradient-mesh" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Scroll Indicator - Fixed Position */}
      <motion.div
        animate={{
          opacity: showScrollIndicator ? 1 : 0,
          y: showScrollIndicator ? [0, 8, 0] : 20,
          pointerEvents: showScrollIndicator ? "auto" : "none",
        }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        transition={{
          opacity: { duration: 0.3 },
          y: showScrollIndicator
            ? { duration: 2, repeat: Infinity, repeatType: "reverse" }
            : { duration: 0.3 },
        }}
      >
        <div
          className="flex flex-col items-center text-gray-300 hover:text-white transition-colors cursor-pointer group"
          onClick={handleScrollDown}
        >
          <span className="text-sm mb-3 font-medium opacity-80 group-hover:opacity-100">
            {t("scrollIndicator")}
          </span>
          <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-200 bg-gray-900/50 backdrop-blur-sm">
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center text-center py-20"
          variants={itemVariants}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="text-white">{t("hero.title.start")} </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("hero.title.highlight")}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
            variants={itemVariants}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              className="text-lg px-8 py-4 rounded-xl group"
              size="lg"
              variant="gradient"
              onClick={handleStartAnalysis}
            >
              {t("hero.cta")}
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          className="py-24"
          data-section="how-it-works"
          variants={itemVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t("howItWorks.title")}
            </h2>
          </motion.div>

          {/* Horizontal Step Flow */}
          <div className="relative">
            {/* Steps container */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start max-w-6xl mx-auto relative space-y-16 md:space-y-0 md:space-x-8 lg:space-x-16 px-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center max-w-xs text-center relative"
                  transition={{ type: "spring", stiffness: 300 }}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <StepIcon Icon={step.icon} step={index + 1} />

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Calculator Previews Section */}
        <CalculatorPreviews />

        {/* Features Section */}
        <motion.section className="py-24" variants={itemVariants}>
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t("features.title")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                transition={{ type: "spring", stiffness: 300 }}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="h-full text-center group"
                  hover="glow"
                  variant="modern"
                >
                  <CardHeader className="items-center" layout="vertical">
                    <CardIcon
                      className={`bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}
                      size="lg"
                      variant="gradient"
                    >
                      <feature.icon
                        className={`w-8 h-8 ${feature.iconColor}`}
                      />
                    </CardIcon>
                    <CardTitle className="text-center group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-center text-gray-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Other Calculators Section */}
        <motion.section className="py-24" variants={itemVariants}>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center text-white mb-12"
            variants={itemVariants}
          >
            {t("other_calculators.title")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card
                className="h-full group cursor-pointer"
                hover="glow"
                variant="modern"
                onClick={() => router.push("/ranta-pa-ranta")}
              >
                <CardHeader>
                  <CardIcon
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:scale-110 transition-transform duration-300"
                    size="lg"
                    variant="gradient"
                  >
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </CardIcon>
                  <Box className="flex-1">
                    <CardTitle className="group-hover:text-purple-300 transition-colors">
                      {t("other_calculators.compound_interest.title")}
                    </CardTitle>
                  </Box>
                </CardHeader>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {t("other_calculators.compound_interest.description")}
                </CardDescription>
              </Card>
            </motion.div>

            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card
                className="h-full group cursor-pointer"
                hover="glow"
                variant="modern"
                onClick={() => router.push("/hushallsbudget")}
              >
                <CardHeader>
                  <CardIcon
                    className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 group-hover:scale-110 transition-transform duration-300"
                    size="lg"
                    variant="gradient"
                  >
                    <CalculatorIcon className="w-8 h-8 text-blue-400" />
                  </CardIcon>
                  <Box className="flex-1">
                    <CardTitle className="group-hover:text-blue-300 transition-colors">
                      {t("other_calculators.budget_calculator.title")}
                    </CardTitle>
                  </Box>
                </CardHeader>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {t("other_calculators.budget_calculator.description")}
                </CardDescription>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section className="py-24 text-center" variants={itemVariants}>
          <motion.div className="max-w-4xl mx-auto" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t("finalCta.title")}
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              {t("finalCta.subtitle")}
            </p>
            <Button
              className="text-lg px-8 py-4 rounded-xl group"
              size="lg"
              variant="gradient"
              onClick={handleStartAnalysis}
            >
              {t("finalCta.button")}
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-20 pt-12 border-t border-gray-800/50"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-6">
                <a
                  aria-label={t("footer.follow_x")}
                  className="text-gray-400 hover:text-white transition-colors duration-200 group"
                  href="https://x.com/budgetkollen"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <XIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </a>
              </div>
              <p className="text-gray-500 text-sm">{t("footer.copyright")}</p>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </Box>
  );
};
