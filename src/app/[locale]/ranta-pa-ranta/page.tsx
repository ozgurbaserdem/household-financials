import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import React from "react";

import { BenefitsSection } from "@/components/compound-interest/BenefitsSection";
import { CalculatorSection } from "@/components/compound-interest/CalculatorSection";
import { CTASection } from "@/components/compound-interest/CTASection";
import { DisclaimerSection } from "@/components/compound-interest/DisclaimerSection";
import { FAQSection } from "@/components/compound-interest/FAQSection";
import { HeroSection } from "@/components/compound-interest/HeroSection";
import { HowToCalculateSection } from "@/components/compound-interest/HowToCalculateSection";
import { TipsSection } from "@/components/compound-interest/TipsSection";
import { WhatIsSection } from "@/components/compound-interest/WhatIsSection";
import { Box } from "@/components/ui/Box";
import { Main } from "@/components/ui/Main";
import { prepareContentData } from "@/lib/compound-interest-utilities";
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

  // Prepare content data using utility function
  const { tips: tipsWithContent, faqs: faqsWithContent } =
    prepareContentData(t);

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
        <Box className="w-full max-w-6xl container-padding py-6 sm:py-10 relative z-10 space-y-8">
          <HeroSection subtitle={t("hero_subtitle")} title={t("hero_title")} />

          <WhatIsSection
            description={t("what_is_section.description")}
            einsteinAttribution={t("what_is_section.einstein_attribution")}
            einsteinImageAlt={t("what_is_section.einstein_image_alt")}
            einsteinQuote={t("what_is_section.einstein_quote")}
            exampleDescription={t("what_is_section.example.description")}
            exampleTitle={t("what_is_section.example.title")}
            explanation={t("what_is_section.explanation")}
            title={t("what_is_section.title")}
          />

          <CalculatorSection
            description={t("calculator_section.description")}
            title={t("calculator_section.title")}
          />

          <HowToCalculateSection
            description={t("how_to_calculate_section.description")}
            formulaExplanation={t(
              "how_to_calculate_section.formula.explanation"
            )}
            formulaText={t("how_to_calculate_section.formula.text")}
            formulaTitle={t("how_to_calculate_section.formula.title")}
            t={t}
            title={t("how_to_calculate_section.title")}
          />

          <BenefitsSection
            description={t("benefits_section.description")}
            growthLabel={t("benefits_section.real_example.result.growth")}
            investedLabel={t("benefits_section.real_example.result.invested")}
            monthlyLabel={t("benefits_section.real_example.scenario.monthly")}
            realExampleTitle={t("benefits_section.real_example.title")}
            resultTitle={t("benefits_section.real_example.result.title")}
            returnLabel={t("benefits_section.real_example.scenario.return")}
            scenarioTitle={t("benefits_section.real_example.scenario.title")}
            t={t}
            title={t("benefits_section.title")}
            totalLabel={t("benefits_section.real_example.result.total")}
            yearsLabel={t("benefits_section.real_example.scenario.years")}
          />

          <TipsSection
            description={t("tips_section.description")}
            tips={tipsWithContent}
            title={t("tips_section.title")}
          />

          <FAQSection
            description={t("faq_section.description")}
            faqs={faqsWithContent}
            title={t("faq_section.title")}
          />

          <DisclaimerSection
            text={t("disclaimer_section.text")}
            title={t("disclaimer_section.title")}
          />

          <CTASection
            buttonText={t("cta_section.button")}
            description={t("cta_section.description")}
            title={t("cta_section.title")}
          />
        </Box>
      </Main>
    </>
  );
};

export { generateMetadata };
export default RantaPaRantaPage;
