import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EinsteinQuote } from "@/components/ui/EinsteinQuote";
import { FAQCard } from "@/components/ui/FAQCard";
import { Main } from "@/components/ui/Main";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { TipCard } from "@/components/ui/TipCard";
import { TIPS_DATA, FAQ_DATA } from "@/data/compoundInterestData";
import { CompoundInterestClient } from "@/features/compound-interest/CompoundInterestClient";
import { Link } from "@/i18n/navigation";
import {
  getLocaleConfig,
  generateWebApplicationSchema,
} from "@/lib/localeConfig";

interface Props {
  params: Promise<{ locale: string }>;
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const config = getLocaleConfig(locale);

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: config.canonicalUrl,
      languages: {
        sv: "/ranta-pa-ranta", // No prefix for default locale
        en: "/en/compound-interest",
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonicalUrl,
      siteName: "Budgetkollen",
      locale: config.locale,
      type: "website",
      images: [
        {
          url: "/compound-interest-og.png",
          width: 1200,
          height: 630,
          alt: config.openGraphImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
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
  const webApplicationSchema = generateWebApplicationSchema(locale);

  // Static data with translations
  const tipsWithContent = TIPS_DATA.map((tip) => ({
    ...tip,
    content: t(tip.translationKey),
  }));

  const faqsWithContent = FAQ_DATA.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

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
            <SectionHeader
              icon={TrendingUp}
              title={t("wonder_section.title")}
              variant="card"
            />
            <CardContent className="space-y-4">
              <Text className="text-muted-foreground leading-relaxed">
                {t("wonder_section.description")}
              </Text>

              <EinsteinQuote
                attribution={t("wonder_section.einstein_attribution")}
                imageAlt={t("wonder_section.einstein_image_alt")}
                quote={t("wonder_section.einstein_quote")}
              />

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
            <SectionHeader
              className="mb-2"
              icon={Lightbulb}
              title={t("tips_section.title")}
              variant="card"
            />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tipsWithContent.map((tip, tipIndex) => (
                  <TipCard
                    key={tip.key}
                    content={tip.content}
                    index={tipIndex + 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section for SEO */}
          <section
            aria-labelledby="faq-heading"
            className="space-y-4"
            role="region"
          >
            <h2
              className="text-2xl font-bold text-foreground text-center mb-8"
              id="faq-heading"
            >
              {t("faq_section.title")}
            </h2>
            <div className="grid gap-4">
              {faqsWithContent.map((faq) => (
                <FAQCard
                  key={faq.question}
                  answer={faq.answer}
                  question={faq.question}
                />
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <Card variant="elevated">
            <SectionHeader
              icon={AlertTriangle}
              title={t("disclaimer_section.title")}
              variant="card"
            />
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
