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
      ? "Hushållsbudget Kalkylator - Gratis Budgetverktyg | Budgetkollen"
      : "Household Budget Calculator - Free Budget Tool | Budgetkollen";

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

  const description =
    locale === "sv"
      ? "Skapa din hushållsbudget på 3 minuter med vårt gratis verktyg. Beräkna inkomster, utgifter och lån för bättre kontroll över din privatekonomi."
      : "Create your household budget in 3 minutes with our free tool. Calculate income, expenses and loans for better control of your personal finances.";

  const keywords =
    locale === "sv"
      ? "hushållsbudget, budgetkalkylator, privatekonomi, månadsbudget, budgetplanering, budgetkollen"
      : "household budget, budget calculator, personal finance, monthly budget, budget planning, budgetkollen";

  // Canonical URLs with proper localization
  let canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se/hushallsbudget"
      : "https://www.budgetkollen.se/en/household-budget";

  // Add step parameter to canonical URL if present
  if (currentStep && typeof currentStep === "string") {
    canonicalUrl += `?${stepParam}=${currentStep}`;
  }

  return {
    title,
    description,
    keywords,
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        sv: "/hushallsbudget",
        en: "/en/household-budget",
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
          url: "/household-budget-og.png",
          width: 1200,
          height: 630,
          alt:
            locale === "sv"
              ? "Hushållsbudget Kalkylator - Budgetkollen"
              : "Household Budget Calculator - Budgetkollen",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/household-budget-og.png"],
      creator: "@budgetkollen",
      site: "@budgetkollen",
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

  // Essential structured data for 2025 SEO
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://www.budgetkollen.se/hushallsbudget",
    name:
      locale === "sv"
        ? "Budgetkollen Hushållsbudget"
        : "Budgetkollen Household Budget",
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
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />

      <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
        {/* SEO-friendly H1 - visually hidden but accessible to screen readers and search engines */}
        <h1 className="sr-only">
          {locale === "sv"
            ? "Hushållsbudget Kalkylator - Skapa Din Budget"
            : "Household Budget Calculator - Create Your Budget"}
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
