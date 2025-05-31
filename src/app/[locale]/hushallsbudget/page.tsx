import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Calculator, TrendingUp, PieChart, Target } from "lucide-react";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Hushållsbudget - Gratis Budgetplaneringsverktyg | Budgetkollen"
      : "Household Budget - Free Budget Planning Tool | Budgetkollen";

  const description =
    locale === "sv"
      ? "Planera din hushållsbudget enkelt med vårt gratis verktyg. Få kontroll över din ekonomi, analysera utgifter och sätt sparsmål."
      : "Plan your household budget easily with our free tool. Take control of your finances, analyze expenses and set savings goals.";

  const keywords =
    locale === "sv"
      ? "hushållsbudget, budgetplanering, familjebudget, ekonomisk planering, privatekonomi, budgetverktyg"
      : "household budget, budget planning, family budget, financial planning, personal finance, budget tool";

  const pathname = locale === "en" ? "/householdbudget" : "/hushallsbudget";
  const canonicalUrl = `https://www.budgetkollen.se/${locale}${pathname}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        sv: `/sv/hushallsbudget`,
        en: `/en/householdbudget`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Budgetkollen",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HushallsbudgetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hushallsbudget");

  return (
    <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh" />

      {/* Static gradient orbs for depth - no animation for better performance */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link href="/">{t("cta_button")}</Link>
          </Button>
        </header>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("features.calculator.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.calculator.description")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <PieChart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("features.analysis.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.analysis.description")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("features.planning.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.planning.description")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <Target className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("features.goals.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.goals.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Guide Section */}
        <section className="mb-12 bg-white dark:bg-gray-900 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">{t("guide.title")}</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("guide.step1.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("guide.step1.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("guide.step2.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("guide.step2.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("guide.step3.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("guide.step3.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("guide.step4.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("guide.step4.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">{t("tips.title")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
                {t("tips.working_tips.title")}
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• {t("tips.working_tips.tip1")}</li>
                <li>• {t("tips.working_tips.tip2")}</li>
                <li>• {t("tips.working_tips.tip3")}</li>
                <li>• {t("tips.working_tips.tip4")}</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
                {t("tips.mistakes.title")}
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• {t("tips.mistakes.mistake1")}</li>
                <li>• {t("tips.mistakes.mistake2")}</li>
                <li>• {t("tips.mistakes.mistake3")}</li>
                <li>• {t("tips.mistakes.mistake4")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">{t("faq.title")}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("faq.q1.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("faq.q1.answer")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("faq.q2.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("faq.q2.answer")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("faq.q3.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("faq.q3.answer")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                {t("faq.q4.question")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("faq.q4.answer")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-xl mb-6 opacity-90">{t("cta.subtitle")}</p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-4"
          >
            <Link href="/">{t("cta.button")}</Link>
          </Button>
        </section>
      </Box>
    </Main>
  );
}
