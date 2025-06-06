import React from "react";
import { Main } from "@/components/ui/main";
import { CompoundInterestClient } from "@/features/compound-interest/CompoundInterestClient";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
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

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
          url: "/compound-interest-og.png",
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
      images: ["/compound-interest-og.png"],
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


export default async function RantaPaRantaPage({ params }: Props) {
  const { locale } = await params;
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
        ? "Gratis ränta på ränta kalkylator för sparande och investering"
        : "Free compound interest calculator for savings and investments",
    featureList: [
      locale === "sv"
        ? "Ränta på ränta beräkning"
        : "Compound interest calculation",
      locale === "sv" ? "Månadssparande" : "Monthly savings",
      locale === "sv" ? "Visualiserade resultat" : "Visual results",
      locale === "sv" ? "Avancerade inställningar" : "Advanced settings",
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
            ? "Ränta på Ränta Kalkylator"
            : "Compound Interest Calculator",
        item:
          locale === "sv"
            ? "https://www.budgetkollen.se/ranta-pa-ranta"
            : "https://www.budgetkollen.se/en/compound-interest",
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
            ? "Vad är ränta på ränta?"
            : "What is compound interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "sv"
              ? "Ränta på ränta är när du får avkastning på både ditt kapital och tidigare avkastning."
              : "Compound interest is when you earn returns on both your capital and previous returns.",
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
              ? "Ja, vår ränta på ränta kalkylator är helt gratis att använda."
              : "Yes, our compound interest calculator is completely free to use.",
        },
      },
    ],
  };

  // Canonical URL for structured data
  const canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se/ranta-pa-ranta"
      : "https://www.budgetkollen.se/en/compound-interest";

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name:
      locale === "sv"
        ? "Budgetkollen Ränta på Ränta Kalkylator"
        : "Budgetkollen Compound Interest Calculator",
    description:
      locale === "sv"
        ? "Komplett sparkalkylator med ränta på ränta beräkning och visualiserade resultat"
        : "Complete savings calculator with compound interest calculation and visual results",
    provider: {
      "@type": "Organization",
      name: "Budgetkollen",
      url: "https://www.budgetkollen.se",
      logo: "https://www.budgetkollen.se/og-image.png",
    },
    areaServed: {
      "@type": "Country",
      name: "Sweden",
    },
    audience: {
      "@type": "Audience",
      audienceType: locale === "sv" ? "Svenska sparare" : "Swedish savers",
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
            ? "Budgetkollen - Ränta på Ränta Kalkylator för Sverige"
            : "Budgetkollen - Compound Interest Calculator for Sweden"}
        </h1>

        {/* Animated gradient mesh background */}
        <div className="gradient-mesh" />

        {/* Static gradient orbs for depth - no animation for better performance */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10 relative z-10 space-y-6">
          {/* Hero Section */}
          <header className="text-center space-y-6 py-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight">
              {locale === "sv"
                ? "Ränta på Ränta Kalkylator"
                : "Compound Interest Calculator"}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {locale === "sv"
                ? "Se hur ditt sparande växer exponentiellt med kraften av sammansatt ränta"
                : "See how your savings grow exponentially with the power of compound interest"}
            </p>
          </header>

          {/* Introduction Section */}
          <Card gradient glass>
            <CardHeader>
              <CardIcon>
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </CardIcon>
              <Box className="flex-1">
                <CardTitle>
                  {locale === "sv"
                    ? "Världens åttonde underverk"
                    : "The Eighth Wonder of the World"}
                </CardTitle>
              </Box>
            </CardHeader>
            <CardContent className="space-y-4">
              <Text className="text-gray-300 leading-relaxed">
                {locale === "sv"
                  ? "Ränta på ränta är en av de mest kraftfulla finansiella koncepten som kan hjälpa dig bygga långsiktig förmögenhet. När du sparar regelbundet och låter din avkastning växa över tid, skapar du en snöbollseffekt där dina pengar arbetar för dig."
                  : "Compound interest is one of the most powerful financial concepts that can help you build long-term wealth. When you save regularly and let your returns grow over time, you create a snowball effect where your money works for you."}
              </Text>

              <div className="relative py-6 px-4">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 relative md:order-2">
                    <div className="text-6xl text-purple-400/30 font-serif absolute -top-4 -left-2">
                      &ldquo;
                    </div>
                    <Text className="text-gray-300 italic text-lg leading-relaxed pl-8 pt-2">
                      {locale === "sv"
                        ? "Ränta på ränta är världens åttonde underverk. Den som förstår det, tjänar på det - den som inte gör det, betalar för det."
                        : "Compound interest is the eighth wonder of the world. He who understands it, earns it - he who doesn't, pays it."}
                    </Text>
                    <div className="text-6xl text-purple-400/30 font-serif absolute -bottom-6 right-0">
                      &rdquo;
                    </div>
                    <Text className="text-gray-400 text-sm mt-4 pl-8">
                      —{" "}
                      {locale === "sv"
                        ? "Albert Einstein (påstås)"
                        : "Albert Einstein (attributed)"}
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
                {locale === "sv"
                  ? "Genom att förstå och utnyttja ränta på ränta kan du förvandla små månadsbelopp till betydande förmögenhet över tid. Vårt verktyg hjälper dig visualisera denna kraftfulla effekt."
                  : "By understanding and leveraging compound interest, you can transform small monthly amounts into significant wealth over time. Our tool helps you visualize this powerful effect."}
              </Text>

              <Text className="text-gray-300 leading-relaxed">
                {locale === "sv"
                  ? "Kombinera denna sparkalkylator med vår hushållsbudget för att hitta mer pengar att spara varje månad."
                  : "Combine this savings calculator with our household budget to find more money to save each month."}
              </Text>
            </CardContent>
          </Card>

          {/* Calculator */}
          <CompoundInterestClient />

          {/* Tips Section */}
          <Card gradient glass>
            <CardHeader>
              <CardIcon>
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </CardIcon>
              <Box className="flex-1">
                <CardTitle>
                  {locale === "sv"
                    ? "Tips för bättre sparande"
                    : "Tips for Better Saving"}
                </CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    sv: "Börja tidigt - tid är din bästa vän när det gäller ränta på ränta",
                    en: "Start early - time is your best friend when it comes to compound interest",
                  },
                  {
                    sv: "Spara regelbundet - även små belopp månadsvis gör stor skillnad",
                    en: "Save regularly - even small monthly amounts make a big difference",
                  },
                  {
                    sv: "Höj sparandet årligen - öka med löneökningen för att accelerera tillväxten",
                    en: "Increase savings annually - grow with salary increases to accelerate growth",
                  },
                  {
                    sv: "Välj rätt placering - 7% årlig avkastning är realistiskt för breda indexfonder",
                    en: "Choose the right investment - 7% annual return is realistic for broad index funds",
                  },
                  {
                    sv: "Undvik att röra sparandet - låt det växa ostört för maximal effekt",
                    en: "Avoid touching savings - let it grow undisturbed for maximum effect",
                  },
                  {
                    sv: "Automatisera sparandet - gör det enkelt genom automatiska överföringar",
                    en: "Automate savings - make it easy with automatic transfers",
                  },
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-6 glass rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <Text className="text-gray-300 text-sm leading-relaxed">
                      {locale === "sv" ? tip.sv : tip.en}
                    </Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section for SEO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              {locale === "sv"
                ? "Vanliga frågor"
                : "Frequently Asked Questions"}
            </h2>
            <div className="grid gap-4">
              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {locale === "sv"
                      ? "Vad är ränta på ränta?"
                      : "What is compound interest?"}
                  </h3>
                  <Text className="text-gray-300">
                    {locale === "sv"
                      ? "Ränta på ränta innebär att du får avkastning inte bara på ditt ursprungliga kapital, utan även på tidigare års avkastning. Detta skapar en exponentiell tillväxt över tid."
                      : "Compound interest means you earn returns not only on your original capital, but also on previous years' returns. This creates exponential growth over time."}
                  </Text>
                </CardContent>
              </Card>

              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {locale === "sv"
                      ? "Hur mycket kan jag tjäna på ränta på ränta?"
                      : "How much can I earn with compound interest?"}
                  </h3>
                  <Text className="text-gray-300">
                    {locale === "sv"
                      ? "Det beror på startkapital, månadssparande, avkastning och tid. Med 7% årlig avkastning kan 1000 kr per månad växa till över 1 miljon kr på 25 år."
                      : "It depends on starting capital, monthly savings, returns, and time. With 7% annual returns, 1000 SEK per month can grow to over 1 million SEK in 25 years."}
                  </Text>
                </CardContent>
              </Card>

              <Card gradient glass>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {locale === "sv"
                      ? "Är kalkylatorn gratis att använda?"
                      : "Is the calculator free to use?"}
                  </h3>
                  <Text className="text-gray-300">
                    {locale === "sv"
                      ? "Ja, vår ränta på ränta kalkylator är helt gratis att använda. Inga registreringar eller nedladdningar krävs."
                      : "Yes, our compound interest calculator is completely free to use. No registrations or downloads required."}
                  </Text>
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
                <CardTitle>
                  {locale === "sv"
                    ? "Viktig information"
                    : "Important Information"}
                </CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <Text className="text-gray-300 leading-relaxed">
                {locale === "sv"
                  ? "Denna kalkylator är endast för illustrativa syften. Faktisk avkastning kan variera beroende på marknadsförhållanden. All investering innebär risk och du kan förlora pengar. Konsultera alltid en finansiell rådgivare för personlig rådgivning."
                  : "This calculator is for illustrative purposes only. Actual returns may vary depending on market conditions. All investments involve risk and you may lose money. Always consult a financial advisor for personal advice."}
              </Text>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card gradient glass>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {locale === "sv"
                    ? "Redo att optimera din ekonomi?"
                    : "Ready to optimize your finances?"}
                </h2>
                <Text className="text-gray-300 max-w-2xl mx-auto">
                  {locale === "sv"
                    ? "Använd vår hushållsbudget för att hitta mer pengar att spara varje månad."
                    : "Use our household budget to find more money to save each month."}
                </Text>
              </div>
              <div className="flex justify-center">
                <Link href="/hushallsbudget">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    {locale === "sv"
                      ? "Skapa hushållsbudget"
                      : "Create household budget"}
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
