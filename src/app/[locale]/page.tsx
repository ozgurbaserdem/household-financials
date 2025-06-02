import React from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Budgetkollen - Få koll på din ekonomi | Gratis verktyg för hushållsbudget"
      : "Budgetkollen - Control your financial future | Free household budget tool";

  const description =
    locale === "sv"
      ? "Få koll på din budget, jämför lån och ta smartare ekonomiska beslut"
      : "Calculate your budget, compare loan scenarios, and make informed financial decisions with our simple analysis tool";

  const keywords =
    locale === "sv"
      ? "ränta på ränta, ränta-på-ränta,hushållsbudget, hushållskalkyl, budgetkollen, budgetkalkylator, privatekonomi, ekonomi kalkylator, lånekalkylator, sparande, hushållsekonomi, budgetplanering, finansiell planering, månadsbudget, familjebudget, ekonomisk rådgivning"
      : "compound interest, household budget, budget calculator, personal finance, loan calculator, savings calculator, financial planning, monthly budget, family budget, budgetkollen, sweden budget tool";

  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se"
      : `https://www.budgetkollen.se/en`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Budgetkollen", url: "https://www.budgetkollen.se" }],
    creator: "Budgetkollen",
    publisher: "Budgetkollen",
    category: "Finance",
    classification: "Personal Finance Tool",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: canonicalUrl,
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
          url: "/Budgetkollen.png",
          width: 1200,
          height: 630,
          alt:
            locale === "sv"
              ? "Budgetkollen - Hushållsbudget och Kalkylator"
              : "Budgetkollen - Budget Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Budgetkollen.png"],
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
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage />;
}
