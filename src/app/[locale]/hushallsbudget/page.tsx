import React from "react";
import { Main } from "@/components/ui/main";
import { WizardClient } from "@/components/WizardClient";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Get the current step from search params
  const stepParam = locale === "sv" ? "steg" : "step";
  const currentStep = resolvedSearchParams?.[stepParam];

  // Dynamic title based on current step
  let title =
    locale === "sv"
      ? "Hushållsbudget - Gratis budgetverktyg | Budgetkollen"
      : "Household Budget - Free Budget Tool | Budgetkollen";

  // Add step-specific context to title if available
  if (currentStep && typeof currentStep === "string") {
    const stepTitles: Record<string, Record<string, string>> = {
      sv: {
        inkomst: "Steg 1: Inkomster - Hushållsbudget | Budgetkollen",
        lan: "Steg 2: Lån - Hushållsbudget | Budgetkollen",
        utgifter: "Steg 3: Utgifter - Hushållsbudget | Budgetkollen",
        sammanfattning:
          "Steg 4: Sammanfattning - Hushållsbudget | Budgetkollen",
        resultat: "Resultat - Hushållsbudget | Budgetkollen",
      },
      en: {
        income: "Step 1: Income - Household Budget | Budgetkollen",
        loans: "Step 2: Loans - Household Budget | Budgetkollen",
        expenses: "Step 3: Expenses - Household Budget | Budgetkollen",
        summary: "Step 4: Summary - Household Budget | Budgetkollen",
        results: "Results - Household Budget | Budgetkollen",
      },
    };

    if (stepTitles[locale]?.[currentStep]) {
      title = stepTitles[locale][currentStep];
    }
  }

  // Compelling meta descriptions with call-to-action (150-160 chars)
  const description =
    locale === "sv"
      ? "Beräkna din hushållsbudget på 3 minuter! ✓ Skatteuträkning ✓ Lånekalkylator ✓ 13 utgiftskategorier."
      : "Calculate your household budget in 3 minutes! ✓ Tax calculation ✓ Loan calculator ✓ 13 expense categories.";

  // Comprehensive keyword list including long-tail keywords
  const keywords =
    locale === "sv"
      ? "ränta på ränta, ränta-på-ränta, hushållsbudget, hushållskalkyl, budgetkalkylator, budgetkollen, privatekonomi, ekonomi kalkylator, lånekalkylator, sparande, hushållsekonomi, budgetplanering, finansiell planering, månadsbudget, familjebudget, ekonomisk rådgivning, skatteuträkning, disponibel inkomst, levnadskostnader sverige, budgetmall, ekonomiplanering, sparkalkylatorer"
      : "compound interest,household budget, budget calculator, personal finance, loan calculator, savings calculator, financial planning, monthly budget, family budget, budgetkollen, sweden budget tool, disposable income calculator, living costs sweden, budget template, expense tracker, financial advisor sweden";

  // Canonical URLs with proper localization
  let canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se/hushallsbudget"
      : "https://www.budgetkollen.se/en/household-budget";

  // Add step parameter to canonical URL if present
  if (currentStep && typeof currentStep === "string") {
    canonicalUrl += `?${stepParam}=${currentStep}`;
  }

  // Alternate language URLs for hreflang
  const alternateUrls = {
    sv: "https://www.budgetkollen.se/hushallsbudget",
    en: "https://www.budgetkollen.se/en/household-budget",
  };

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Budgetkollen", url: "https://www.budgetkollen.se" }],
    creator: "Budgetkollen",
    publisher: "Budgetkollen",
    category: "Finance",
    classification: "Personal Finance Tool",
    applicationName: "Budgetkollen",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    manifest: "/manifest.json",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Budgetkollen",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      alternateLocale: locale === "sv" ? "en_US" : "sv_SE",
      type: "website",
      images: [
        {
          url: "/Budgetkollen.png",
          width: 1200,
          height: 630,
          alt:
            locale === "sv"
              ? "Budgetkollen - Sveriges bästa budgetkalkylator för hushåll"
              : "Budgetkollen - Sweden's best household budget calculator",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Budgetkollen.png"],
      creator: "@budgetkollen",
      site: "@budgetkollen",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "G2E34AZZPQ97qu8fxJbgKwM0dUveivxfv84F97tMqV8",
    },
    other: {
      "revisit-after": "7 days",
      distribution: "global",
      rating: "general",
      language: locale === "sv" ? "Swedish" : "English",
      "geo.region": "SE",
      "geo.country": "Sweden",
      "og:locale:alternate": locale === "sv" ? "en_US" : "sv_SE",
      "article:author": "Budgetkollen",
      "article:section": "Finance",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "msapplication-TileColor": "#1a1a1a",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "dns-prefetch": "https://www.googletagmanager.com",
      preconnect: "https://www.google-analytics.com",
    },
  };
}

export default async function HushallsbudgetPage({
  params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams,
}: Props) {
  const { locale } = await params;
  // searchParams is included in Props to satisfy Next.js page component requirements
  // but is not used in the server component itself (used by the client component)
  setRequestLocale(locale);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Budgetkollen",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
    description:
      locale === "sv"
        ? "Gratis budgetkalkylator för svenska hushåll med skatteuträkning och lånekalkylator"
        : "Free budget calculator for Swedish households with tax calculation and loan calculator",
    featureList: [
      locale === "sv" ? "Skatteuträkning" : "Tax calculation",
      locale === "sv" ? "Lånekalkylator" : "Loan calculator",
      locale === "sv" ? "13 utgiftskategorier" : "13 expense categories",
      locale === "sv" ? "Finansiell hälsopoäng" : "Financial health score",
    ],
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Budgetkollen",
        item: "https://www.budgetkollen.se",
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          locale === "sv"
            ? "Hushållsbudget Kalkylator"
            : "Household Budget Calculator",
        item:
          locale === "sv"
            ? "https://www.budgetkollen.se/hushallsbudget"
            : "https://www.budgetkollen.se/en/household-budget",
      },
    ],
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Hur lång tid tar det att fylla i budgetkalkylatorn?"
            : "How long does it take to complete the budget calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Det tar ungefär 3 minuter att fylla i alla steg i budgetkalkylatorn."
              : "It takes approximately 3 minutes to complete all steps in the budget calculator.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Är Budgetkollen gratis att använda?"
            : "Is Budgetkollen free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Ja, Budgetkollen är helt gratis att använda utan några dolda avgifter."
              : "Yes, Budgetkollen is completely free to use with no hidden fees.",
        },
      },
    ],
  };

  // Canonical URL for structured data
  const canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se/hushallsbudget"
      : "https://www.budgetkollen.se/en/household-budget";

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name:
      locale === "sv"
        ? "Budgetkollen Hushållsbudgetkalkylator"
        : "Budgetkollen Household Budget Calculator",
    description:
      locale === "sv"
        ? "Komplett budgetkalkylator med skatteuträkning, lånekalkylator och finansiell hälsoanalys"
        : "Complete budget calculator with tax calculation, loan calculator and financial health analysis",
    provider: {
      "@type": "Organization",
      name: "Budgetkollen",
      url: "https://www.budgetkollen.se",
      logo: "https://www.budgetkollen.se/Budgetkollen.png",
    },
    areaServed: {
      "@type": "Country",
      name: "Sweden",
    },
    audience: {
      "@type": "Audience",
      audienceType: locale === "sv" ? "Svenska hushåll" : "Swedish households",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: canonicalUrl,
      serviceType: "Online",
    },
  };

  return (
    <>
      {/* SEO: Structured Data Scripts with proper typing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        key="structured-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
        key="breadcrumb-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
        key="faq-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(financialProductSchema),
        }}
        key="financial-product"
      />

      <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
        <noscript>
          <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
            <div className="max-w-md text-center bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">
                {locale === "sv" ? "JavaScript krävs" : "JavaScript Required"}
              </h2>
              <p className="text-gray-400 mb-6">
                {locale === "sv"
                  ? "För att använda Budgetkollens kalkylator behöver du aktivera JavaScript i din webbläsare."
                  : "To use Budgetkollen's calculator, you need to enable JavaScript in your browser."}
              </p>
              <a
                href="https://www.enable-javascript.com/"
                className="text-blue-400 hover:text-blue-300 underline"
                rel="noopener noreferrer"
              >
                {locale === "sv"
                  ? "Läs hur du aktiverar JavaScript"
                  : "Learn how to enable JavaScript"}
              </a>
            </div>
          </div>
        </noscript>
        {/* SEO: Hidden H1 for screen readers and search engines */}
        <h1 className="sr-only">
          {locale === "sv"
            ? "Budgetkollen - Hushållsbudget Kalkylator för Sverige"
            : "Budgetkollen - Household Budget Calculator for Sweden"}
        </h1>

        {/* Animated gradient mesh background */}
        <div className="gradient-mesh" />

        {/* Static gradient orbs for depth - no animation for better performance */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <WizardClient />
      </Main>
    </>
  );
}
