import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CompoundInterestCalculator } from "@/features/compound-interest/CompoundInterestCalculator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Main } from "@/components/ui/main";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const isSwedish = locale === "sv";

  const title = isSwedish
    ? "Ränta på Ränta Kalkylator - Beräkna Din Framtida Förmögenhet | Budgetkollen"
    : "Compound Interest Calculator - Calculate Your Future Wealth | Budgetkollen";

  const description = isSwedish
    ? "Beräkna hur dina investeringar växer med ränta på ränta! ✓ Gratis kalkylator ✓ Visualiserade resultat ✓ Se hur små belopp blir miljoner över tid."
    : "Calculate how your investments grow with compound interest! ✓ Free calculator ✓ Visual results ✓ See how small amounts become millions over time.";

  const keywords = isSwedish
    ? "ränta på ränta, ränta-på-ränta, compund interest, sparkalkylator, investeringskalkylator, sparande, investering, budgetkollen, privatekonomi, finansiell planering, sparmål, kapitalförmögenhet, pensionssparande, fonder, avkastning, ekonomi kalkylator"
    : "compound interest, savings calculator, investment calculator, saving, investing, budgetkollen, personal finance, financial planning, savings goals, wealth building, retirement savings, funds, returns, finance calculator";

  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl = isSwedish
    ? `https://www.budgetkollen.se/ranta-pa-ranta`
    : `https://www.budgetkollen.se/en/compound-interest`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Budgetkollen", url: "https://www.budgetkollen.se" }],
    creator: "Budgetkollen",
    publisher: "Budgetkollen",
    category: "Finance",
    classification: "Investment Calculator Tool",
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
      locale: isSwedish ? "sv_SE" : "en_US",
      alternateLocale: isSwedish ? "en_US" : "sv_SE",
      type: "website",
      images: [
        {
          url: "/compound-interest-og.png?v=2",
          width: 1200,
          height: 630,
          alt: isSwedish
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
      images: ["/compound-interest-og.png?v=2"],
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
      language: isSwedish ? "Swedish" : "English",
      "geo.region": "SE",
      "geo.country": "Sweden",
      "og:locale:alternate": isSwedish ? "en_US" : "sv_SE",
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

export function generateStaticParams() {
  return [{ locale: "sv" }, { locale: "en" }];
}

async function CompoundInterestContent(locale: string) {
  await setRequestLocale(locale);
  const t = await getTranslations("compound_interest");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("schema.app_name"),
    description: t("schema.app_description"),
    url:
      locale === "sv"
        ? "https://www.budgetkollen.se/ranta-pa-ranta"
        : "https://www.budgetkollen.se/en/compound-interest",
    image: "https://www.budgetkollen.se/einstein-optimized.png",
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "InvestmentCalculator",
    operatingSystem: "All",
    browserRequirements: "HTML5, JavaScript",
    inLanguage: locale,
    isAccessibleForFree: true,
    keywords: t("meta.keywords").split(", "),
    category: "Finance",
    datePublished: "2024-01-01",
    dateModified: "2025-01-06",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "Budgetkollen",
      url: "https://www.budgetkollen.se",
      logo: "https://www.budgetkollen.se/favicon.svg",
    },
    potentialAction: {
      "@type": "UseAction",
      target:
        locale === "sv"
          ? "https://www.budgetkollen.se/ranta-pa-ranta"
          : "https://www.budgetkollen.se/en/compound-interest",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Vad är ränta på ränta?"
            : "What is compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Ränta på ränta är när du får avkastning inte bara på ditt ursprungliga kapital, utan även på den ränta du redan tjänat. Detta skapar en exponentiell tillväxt över tid."
              : "Compound interest is when you earn returns not only on your original capital, but also on the interest you have already earned. This creates exponential growth over time.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Hur fungerar månadssparande med ränta på ränta?"
            : "How does monthly saving work with compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "När du sparar månadsvis får varje insättning ränta från den tidpunkt den sätts in. Över tid växer ditt sparande exponentiellt tack vare ränta-på-ränta-effekten."
              : "When you save monthly, each deposit earns interest from the time it is made. Over time, your savings grow exponentially thanks to the compound interest effect.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Hur mycket kan jag tjäna på ränta på ränta?"
            : "How much can I earn with compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Det beror på startkapital, månadssparande, ränta och tid. Med vår kalkylator kan du se exakt hur mycket ditt sparande kan växa."
              : "It depends on starting capital, monthly savings, interest rate, and time. With our calculator, you can see exactly how much your savings can grow.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Hur använder jag ränta på ränta kalkylatorn?"
            : "How do I use the compound interest calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "1) Ange ditt startkapital 2) Välj månatligt sparande 3) Sätt förväntad årlig avkastning 4) Välj tidsperiod 5) Klicka 'Beräkna' för att se resultatet."
              : "1) Enter your starting capital 2) Choose monthly savings 3) Set expected annual return 4) Select time period 5) Click 'Calculate' to see the result.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "sv"
            ? "Är kalkylatorn gratis att använda?"
            : "Is the calculator free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Ja, vår ränta på ränta kalkylator är helt gratis att använda. Inga registreringar eller nedladdningar krävs."
              : "Yes, our compound interest calculator is completely free to use. No registrations or downloads required.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "sv" ? "Hem" : "Home",
        item:
          locale === "sv"
            ? "https://www.budgetkollen.se"
            : "https://www.budgetkollen.se/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          locale === "sv"
            ? "Ränta på Ränta Kalkylator"
            : "Compound Interest Calculator",
        item:
          locale === "sv"
            ? "https://www.budgetkollen.se/ranta-pa-ranta"
            : "https://www.budgetkollen.se/en/compound-interest",
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name:
      locale === "sv"
        ? "Hur man använder ränta på ränta kalkylatorn"
        : "How to use the compound interest calculator",
    image: {
      "@type": "ImageObject",
      url: "https://www.budgetkollen.se/einstein-optimized.png",
    },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        text:
          locale === "sv"
            ? "Ange ditt nuvarande startkapital i kalkylatorn."
            : "Enter your current starting capital in the calculator.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        text:
          locale === "sv"
            ? "Välj hur mycket du planerar att spara varje månad."
            : "Choose how much you plan to save each month.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        text:
          locale === "sv"
            ? "Sätt din förväntade årliga avkastning (t.ex. 7% för indexfonder)."
            : "Set your expected annual return (e.g., 7% for index funds).",
      },
      {
        "@type": "HowToStep",
        position: 4,
        text:
          locale === "sv"
            ? "Välj tidsperioden du vill spara över."
            : "Choose the time period you want to save over.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        text:
          locale === "sv"
            ? "Se resultatet och hur ränta på ränta gör dina pengar till miljoner!"
            : "See the result and how compound interest makes your money grow to millions!",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="gradient-mesh" />

        {/* Static gradient orbs for depth - no animation for better performance */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10 space-y-6">
          {/* Hero Section */}
          <header className="text-center space-y-6 py-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
              {t("page_title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("page_subtitle")}
            </p>
          </header>

          {/* Introduction Section */}
          <Card gradient glass>
            <CardHeader>
              <CardIcon>
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </CardIcon>
              <Box className="flex-1">
                <CardTitle>{t("intro.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent className="space-y-4">
              <Text className="text-gray-300 leading-relaxed">
                {t("intro.description")}
              </Text>

              <div className="relative py-6 px-4">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 relative md:order-2">
                    <div className="text-6xl text-purple-400/30 font-serif absolute -top-4 -left-2">
                      &ldquo;
                    </div>
                    <Text className="text-gray-300 italic text-lg leading-relaxed pl-8 pt-2">
                      {t("intro.einstein_quote")}
                    </Text>
                    <div className="text-6xl text-purple-400/30 font-serif absolute -bottom-6 right-0">
                      &rdquo;
                    </div>
                    <Text className="text-gray-400 text-sm mt-4 pl-8">
                      — {t("intro.einstein_attribution")}
                    </Text>
                  </div>
                  <div className="flex justify-center md:justify-start md:order-1">
                    <Image
                      src="/einstein-optimized.png"
                      alt="Albert Einstein"
                      width={80}
                      height={80}
                      className="rounded-full object-cover grayscale opacity-70 flex-shrink-0 ring-2 ring-purple-500/20"
                      priority
                    />
                  </div>
                </div>
              </div>

              <Text className="text-gray-300 leading-relaxed">
                {t("intro.why_important")}
              </Text>

              <Text className="text-gray-300 leading-relaxed">
                {t("intro.connection_to_budget")}
              </Text>
            </CardContent>
          </Card>

          {/* Calculator */}
          <CompoundInterestCalculator />

          {/* Tips Section */}
          <Card gradient glass>
            <CardHeader>
              <CardIcon>
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </CardIcon>
              <Box className="flex-1">
                <CardTitle>{t("tips.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="flex items-center gap-4 p-6 glass rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {num}
                    </div>
                    <Text className="text-gray-300 text-sm leading-relaxed">
                      {t(`tips.tip${num}`)}
                    </Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section for SEO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              {t("faq.title")}
            </h2>
            <div className="grid gap-4">
              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("faq.q1.question")}
                  </h3>
                  <Text className="text-gray-300">{t("faq.q1.answer")}</Text>
                </CardContent>
              </Card>

              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("faq.q2.question")}
                  </h3>
                  <Text className="text-gray-300">{t("faq.q2.answer")}</Text>
                </CardContent>
              </Card>

              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("faq.q3.question")}
                  </h3>
                  <Text className="text-gray-300">{t("faq.q3.answer")}</Text>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <Card gradient glass>
            <CardHeader>
              <CardIcon>
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </CardIcon>
              <Box className="flex-1">
                <CardTitle>{t("disclaimer.title")}</CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <Text className="text-gray-300 leading-relaxed">
                {t("disclaimer.text")}
              </Text>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card gradient glass>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {t("cta.title")}
                </h2>
                <Text className="text-gray-300 max-w-2xl mx-auto">
                  {t("cta.subtitle")}
                </Text>
              </div>
              <div className="flex justify-center">
                <Link href="/hushallsbudget">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    {t("cta.button")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Main>
    </>
  );
}

export default async function RantaPaRantaPage({ params }: PageProps) {
  const { locale } = await params;
  await setRequestLocale(locale);
  return await CompoundInterestContent(locale);
}
