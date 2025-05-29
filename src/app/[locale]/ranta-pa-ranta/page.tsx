import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CompoundInterestCalculator } from "@/components/compound-interest/CompoundInterestCalculator";
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
import { Navbar } from "@/components/Navbar";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "sv") {
    notFound();
  }

  const title =
    "Ränta på Ränta Kalkylator & Månadssparande - Gratis Verktyg | Budgetkollen";
  const description =
    "Beräkna ränta-på-ränta och månadssparande. Se hur dina investeringar växer över tid med vår gratis kalkylator. Visualisera effekten av ränta på ränta för långsiktigt sparande och pensionsplanering.";
  const keywords =
    "ränta på ränta, ränta på ränta kalkylator, månadssparande, månadssparande kalkylator, investeringskalkylator, sparkalkylator, långsiktigt sparande, pensionssparande, aktiefonder, indexfonder, avkastning, kapitalökning, budgetkollen";

  const canonicalUrl = `https://www.budgetkollen.se/sv/ranta-pa-ranta`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Budgetkollen", url: "https://www.budgetkollen.se" }],
    creator: "Budgetkollen",
    publisher: "Budgetkollen",
    category: "Finance",
    classification: "Investment Calculator Tool",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        sv: "/sv/ranta-pa-ranta",
        en: "/en/compound-interest",
        "x-default": "/sv/ranta-pa-ranta",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Budgetkollen",
      locale: "sv_SE",
      type: "website",
      images: [
        {
          url: "/og-compound-interest.png",
          width: 1200,
          height: 630,
          alt: "Ränta-på-Ränta Kalkylator - Investeringstillväxt Visualisering",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-compound-interest.png"],
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
    other: {
      "revisit-after": "7 days",
      distribution: "global",
      rating: "general",
      language: "Swedish",
      "geo.region": "SE",
      "geo.country": "Sweden",
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "sv" }];
}

async function CompoundInterestContent() {
  const t = await getTranslations("compound_interest");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ränta på Ränta Kalkylator",
    description:
      "Beräkna ränta på ränta och månadssparande för dina investeringar",
    url: "https://www.budgetkollen.se/sv/ranta-pa-ranta",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
    publisher: {
      "@type": "Organization",
      name: "Budgetkollen",
      url: "https://www.budgetkollen.se",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vad är ränta på ränta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ränta på ränta är när du får avkastning inte bara på ditt ursprungliga kapital, utan även på den ränta du redan tjänat. Detta skapar en exponentiell tillväxt över tid.",
        },
      },
      {
        "@type": "Question",
        name: "Hur fungerar månadssparande med ränta på ränta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "När du sparar månadsvis får varje insättning ränta från den tidpunkt den sätts in. Över tid växer ditt sparande exponentiellt tack vare ränta-på-ränta-effekten.",
        },
      },
      {
        "@type": "Question",
        name: "Hur mycket kan jag tjäna på ränta på ränta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Det beror på startkapital, månadssparande, ränta och tid. Med vår kalkylator kan du se exakt hur mycket ditt sparande kan växa.",
        },
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
      <Main className="min-h-screen bg-gray-950 flex flex-col items-center relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="gradient-mesh" />

        {/* Static gradient orbs for depth - no animation for better performance */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <Navbar />

        <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-6 py-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
              {t("title")}
            </h1>
            <Text className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </Text>
          </section>

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

              <Box className="p-4 glass rounded-lg border-l-4 border-purple-500">
                <Text className="text-gray-300 italic">
                  {t("intro.einstein_quote")}
                </Text>
              </Box>

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
                    className="flex items-start gap-4 p-4 glass rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
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
            <CardContent className="text-center space-y-6 py-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {t("cta.title")}
                </h2>
                <Text className="text-gray-300 max-w-2xl mx-auto">
                  {t("cta.subtitle")}
                </Text>
              </div>
              <div className="flex justify-center">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-3"
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

  if (locale !== "sv") {
    notFound();
  }

  setRequestLocale(locale);

  return await CompoundInterestContent();
}
