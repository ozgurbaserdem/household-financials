import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Box } from "@/components/ui/Box";
import { Card, CardContent } from "@/components/ui/Card";
import { Main } from "@/components/ui/Main";
import HushallskalkylContent from "@/features/hushallskalkyl/HushallskalkylContent";

interface Props {
  params: Promise<{ locale: string }>;
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Hushållskalkyl & Hushållsbudget Gratis - Budgetkollen Sverige"
      : "Household Budget & Calculator Free - Budgetkollen Sweden";

  const description =
    locale === "sv"
      ? "Komplett guide till hushållskalkyl och hushållsbudget. Lär dig skapa din egen familjebudget, månadsbudget och få kontroll över din privatekonomi med Budgetkollen."
      : "Complete guide to household budget and calculator. Learn to create your family budget, monthly budget and control your personal finances with Budgetkollen.";

  const keywords =
    locale === "sv"
      ? "hushållskalkyl, hushållsbudget, familjebudget, månadsbudget, budgetplanering, privatekonomi, ekonomisk planering, sparande, budgettips, hushållsekonomi"
      : "household calculator, household budget, family budget, monthly budget, budget planning, personal finance, financial planning, savings, budget tips";

  const pathname = locale === "en" ? "/householdbudget" : "/hushallskalkyl";
  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl =
    locale === "sv"
      ? `https://www.budgetkollen.se${pathname}`
      : `https://www.budgetkollen.se/en${pathname}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        sv: `/hushallskalkyl`, // No prefix for default locale
        en: `/en/householdbudget`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Budgetkollen",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "article",
      publishedTime: "2025-01-01",
      modifiedTime: new Date().toISOString(),
      section: "Personal Finance",
      tags: keywords.split(", "),
    },
    other: {
      "article:author": "Budgetkollen",
      "article:section": "Personal Finance",
    },
  };
};

const HushallskalkylPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hushallskalkyl");

  return (
    <Main className="min-h-screen bg-background flex flex-col items-center relative pt-20 lg:pt-24">
      <Box className="w-full max-w-6xl container-padding py-6 sm:py-10 relative z-10 space-y-6">
        {/* Hero Section */}
        <header className="text-center space-y-6 py-4">
          <h1 className="heading-1 text-foreground">{t("page.hero_title")}</h1>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            {t("page.hero_subtitle")}
          </p>
        </header>

        <HushallskalkylContent />

        {/* FAQ section for better SEO */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            {t("page.faq_title")}
          </h2>
          <div className="grid gap-4">
            {t
              .raw("page.faq")
              .map((faqItem: { question: string; answer: string }) => (
                <Card key={faqItem.question.slice(0, 20)} variant="elevated">
                  <CardContent>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {faqItem.question}
                    </h3>
                    <p className="text-muted-foreground">{faqItem.answer}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </Box>
    </Main>
  );
};

export { generateMetadata };
export default HushallskalkylPage;
