import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { Navbar } from "@/components/shared/Navbar";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "en") {
    notFound();
  }

  const title =
    "Compound Interest Calculator & Monthly Savings - Free Tool | Budgetkollen";
  const description =
    "Calculate compound interest and monthly savings growth. Free compound interest calculator with charts showing how your investments grow exponentially over time. Perfect for retirement planning and long-term investing.";
  const keywords =
    "compound interest, compound interest calculator, monthly savings, monthly savings calculator, investment calculator, savings calculator, long-term investing, retirement planning, index funds, mutual funds, investment returns, wealth building, budgetkollen";

  const canonicalUrl = `https://www.budgetkollen.se/en/compound-interest`;

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
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-compound-interest.png",
          width: 1200,
          height: 630,
          alt: "Compound Interest Calculator - Investment Growth Visualization",
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
      language: "English",
      "geo.region": "SE",
      "geo.country": "Sweden",
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }];
}

async function CompoundInterestContent() {
  const t = await getTranslations("compound_interest");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Compound Interest Calculator",
    description:
      "Calculate compound interest and monthly savings for your investments",
    url: "https://www.budgetkollen.se/en/compound-interest",
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
        name: "What is compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compound interest is when you earn returns not only on your initial capital but also on the interest you've already earned. This creates exponential growth over time.",
        },
      },
      {
        "@type": "Question",
        name: "How does monthly savings work with compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When you save monthly, each deposit earns interest from the time it's invested. Over time, your savings grow exponentially thanks to the compound interest effect.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I earn with compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your initial capital, monthly savings, interest rate, and time. Use our calculator to see exactly how much your savings can grow.",
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

              <div className="relative py-6 px-4">
                <div className="flex items-start gap-6">
                  <Image
                    src="/einstein-optimized.png"
                    alt="Albert Einstein"
                    width={80}
                    height={80}
                    className="rounded-full object-cover grayscale flex-shrink-0 ring-2 ring-purple-500/20"
                    priority
                  />
                  <div className="flex-1 relative">
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

export default async function CompoundInterestPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "en") {
    notFound();
  }

  setRequestLocale(locale);

  return await CompoundInterestContent();
}
