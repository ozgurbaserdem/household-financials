import React from "react";
import { Main } from "@/components/ui/main";
import { WizardClient } from "@/components/WizardClient";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Budgetkollen - Hushållsbudget & Hushållskalkyl | Gratis Budgetkalkylator Sverige"
      : "Budgetkollen - Household Budget Calculator | Free Budget Tool Sweden";

  const description =
    locale === "sv"
      ? "Skapa din hushållsbudget och hushållskalkyl gratis med Budgetkollen. Sveriges bästa budgetkalkylator för att planera din ekonomi, beräkna lån och sparmål. Få kontroll över din privatekonomi."
      : "Create your household budget and calculator free with Budgetkollen. Sweden's best budget calculator to plan your finances, calculate loans and savings goals. Take control of your personal finance.";

  const keywords =
    locale === "sv"
      ? "hushållsbudget, hushållskalkyl, budgetkollen, budgetkalkylator, privatekonomi, ekonomi kalkylator, lånekalkylator, sparande, hushållsekonomi, budgetplanering, finansiell planering, månadsbudget, familjebudget, ekonomisk rådgivning"
      : "household budget, budget calculator, personal finance, loan calculator, savings calculator, financial planning, monthly budget, family budget, budgetkollen, sweden budget tool";

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
          url: "/og-image.png",
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
      images: ["/og-image.png"],
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh" />

      {/* Static gradient orbs for depth - no animation for better performance */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <WizardClient />
    </Main>
  );
}
