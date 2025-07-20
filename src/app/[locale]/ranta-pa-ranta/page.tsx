import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Main } from "@/components/ui/Main";
import { Text } from "@/components/ui/Text";
import { CompoundInterestClient } from "@/features/compound-interest/CompoundInterestClient";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Ränta på Ränta Kalkylator - Sparkalkylator Gratis | Budgetkollen"
      : "Compound Interest Calculator - Free Savings Calculator | Budgetkollen";

  const description =
    locale === "sv"
      ? "Gratis ränta på ränta kalkylator som visar hur ditt sparande växer över tid. Beräkna framtida förmögenhet med månatligt sparande och visualiserade resultat."
      : "Free compound interest calculator showing how your savings grow over time. Calculate future wealth with monthly savings and visual results.";

  const keywords =
    locale === "sv"
      ? "ränta på ränta, sparkalkylator, investeringskalkylator, sparande, privatekonomi, budgetkollen"
      : "compound interest, savings calculator, investment calculator, personal finance, budgetkollen";

  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl =
    locale === "sv"
      ? `https://www.budgetkollen.se/ranta-pa-ranta`
      : `https://www.budgetkollen.se/en/compound-interest`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        sv: "/ranta-pa-ranta", // No prefix for default locale
        en: "/en/compound-interest",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Budgetkollen",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [
        {
          url: "/compound-interest-og.png",
          width: 1200,
          height: 630,
          alt:
            locale === "sv"
              ? "Ränta på Ränta Kalkylator - Budgetkollen"
              : "Compound Interest Calculator - Budgetkollen",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/compound-interest-og.png"],
      creator: "@budgetkollen",
      site: "@budgetkollen",
    },
  };
};

const RantaPaRantaPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compound_interest");

  // Essential structured data for 2025 SEO
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id":
      locale === "sv"
        ? "https://www.budgetkollen.se/ranta-pa-ranta"
        : "https://www.budgetkollen.se/en/compound-interest",
    name:
      locale === "sv"
        ? "Budgetkollen Ränta på Ränta"
        : "Budgetkollen Compound Interest",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
    provider: {
      "@type": "Organization",
      name: "Budgetkollen",
      url: "https://www.budgetkollen.se",
    },
  };

  return (
    <>
      {/* Essential structured data for SEO */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
        type="application/ld+json"
      />

      <Main className="min-h-screen bg-background flex flex-col items-center relative pt-20 lg:pt-24">
        <Box className="w-full max-w-6xl container-padding py-6 sm:py-10 relative z-10 space-y-6">
          {/* Hero Section */}
          <header className="text-center space-y-6 py-4">
            <h1 className="heading-1 text-foreground">{t("hero_title")}</h1>
            <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
              {t("hero_subtitle")}
            </p>
          </header>
          {/* Introduction Section */}
          <Card className="card-base" variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(34 197 94 / 0.1)",
                  color: "rgb(34 197 94)",
                  border: "1px solid rgb(34 197 94 / 0.2)",
                }}
              >
                <TrendingUp className="w-6 h-6" />
              </div>
              <Box className="flex-1">
                <CardTitle>{t("wonder_section.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent className="space-y-4">
              <Text className="text-muted-foreground leading-relaxed">
                {t("wonder_section.description")}
              </Text>

              <div className="relative py-6 px-4">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 relative md:order-2">
                    <div className="text-6xl text-muted-foreground/30 font-serif absolute -top-4 -left-2">
                      &ldquo;
                    </div>
                    <Text className="text-muted-foreground italic text-lg leading-relaxed pl-8 pt-2">
                      {t("wonder_section.einstein_quote")}
                    </Text>
                    <div className="text-6xl text-muted-foreground/30 font-serif absolute -bottom-6 right-0">
                      &rdquo;
                    </div>
                    <Text className="text-muted-foreground text-sm mt-4 pl-8">
                      — {t("wonder_section.einstein_attribution")}
                    </Text>
                  </div>
                  <div className="flex justify-center md:justify-start md:order-1">
                    <Image
                      priority
                      alt="Albert Einstein"
                      className="rounded-full object-cover grayscale opacity-70 flex-shrink-0 ring-2 ring-border"
                      height={80}
                      src="/einstein-optimized.png"
                      width={80}
                    />
                  </div>
                </div>
              </div>

              <Text className="text-muted-foreground leading-relaxed">
                {t("wonder_section.understanding_text")}
              </Text>

              <Text className="text-muted-foreground leading-relaxed">
                {t("wonder_section.budget_connection")}
              </Text>
            </CardContent>
          </Card>

          {/* Calculator */}
          <CompoundInterestClient />

          {/* Tips Section */}
          <Card variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(234 179 8 / 0.1)",
                  color: "rgb(234 179 8)",
                  border: "1px solid rgb(234 179 8 / 0.2)",
                }}
              >
                <Lightbulb className="w-6 h-6" />
              </div>
              <Box className="flex-1">
                <CardTitle>{t("tips_section.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "tip1", content: t("tips_section.tip1") },
                  { key: "tip2", content: t("tips_section.tip2") },
                  { key: "tip3", content: t("tips_section.tip3") },
                  { key: "tip4", content: t("tips_section.tip4") },
                  { key: "tip5", content: t("tips_section.tip5") },
                  { key: "tip6", content: t("tips_section.tip6") },
                ].map((tip, tipIndex) => (
                  <div
                    key={tip.key}
                    className="flex items-center gap-4 p-6 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                      {tipIndex + 1}
                    </div>
                    <Text className="text-muted-foreground text-sm leading-relaxed">
                      {tip.content}
                    </Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section for SEO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {t("faq_section.title")}
            </h2>
            <div className="grid gap-4">
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("faq_section.q1.question")}
                  </h3>
                  <Text className="text-muted-foreground">
                    {t("faq_section.q1.answer")}
                  </Text>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("faq_section.q2.question")}
                  </h3>
                  <Text className="text-muted-foreground">
                    {t("faq_section.q2.answer")}
                  </Text>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("faq_section.q3.question")}
                  </h3>
                  <Text className="text-muted-foreground">
                    {t("faq_section.q3.answer")}
                  </Text>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <Card variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(239 68 68 / 0.1)",
                  color: "rgb(239 68 68)",
                  border: "1px solid rgb(239 68 68 / 0.2)",
                }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <Box className="flex-1">
                <CardTitle>{t("disclaimer_section.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground leading-relaxed">
                {t("disclaimer_section.text")}
              </Text>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card variant="elevated">
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("cta_section.title")}
                </h2>
                <Text className="text-muted-foreground max-w-2xl mx-auto">
                  {t("cta_section.description")}
                </Text>
              </div>
              <div className="flex justify-center">
                <Link href="/hushallsbudget">
                  <Button size="lg">{t("cta_section.button")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Main>
    </>
  );
};

export { generateMetadata };
export default RantaPaRantaPage;
