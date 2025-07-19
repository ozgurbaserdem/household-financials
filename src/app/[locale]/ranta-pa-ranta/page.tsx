import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Main } from "@/components/ui/Main";
import { Text } from "@/components/ui/Text";
import { CompoundInterestClient } from "@/features/compound-interest/CompoundInterestClient";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;

  const title =
    locale === "sv"
      ? "Ränta på Ränta Kalkylator - Sparkalkylator Gratis | Budgetkollen"
      : "Compound Interest Calculator - Free Savings Calculator | Budgetkollen";

  const description =
    locale === "sv"
      ? "Gratis ränta på ränta kalkylator som visar hur ditt sparande växer över tid. Beräkna framtida förmögenhet med månatligt sparande och visualiserade resultat."
      : "Free compound interest calculator showing how your savings grow over time. Calculate future wealth with monthly savings and visual results.";

  const keywords =
    locale === "sv"
      ? "ränta på ränta, sparkalkylator, investeringskalkylator, sparande, privatekonomi, budgetkollen"
      : "compound interest, savings calculator, investment calculator, personal finance, budgetkollen";

  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl =
    locale === "sv"
      ? `https://www.budgetkollen.se/ranta-pa-ranta`
      : `https://www.budgetkollen.se/en/compound-interest`;

  return {
    title,
    description,
    keywords,
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
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [
        {
          url: "/compound-interest-og.png",
          width: 1200,
          height: 630,
          alt:
            locale === "sv"
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
  };
};

const RantaPaRantaPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Essential structured data for 2025 SEO
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id":
      locale === "sv"
        ? "https://www.budgetkollen.se/ranta-pa-ranta"
        : "https://www.budgetkollen.se/en/compound-interest",
    name:
      locale === "sv"
        ? "Budgetkollen Ränta på Ränta"
        : "Budgetkollen Compound Interest",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
        type="application/ld+json"
      />

      <Main className="min-h-screen bg-background flex flex-col items-center relative pt-20 lg:pt-24">
        <Box className="w-full max-w-6xl container-padding py-6 sm:py-10 relative z-10 space-y-6">
          {/* Hero Section */}
          <header className="text-center space-y-6 py-4">
            <h1 className="heading-1 text-foreground">
              {locale === "sv"
                ? "Ränta på Ränta Kalkylator"
                : "Compound Interest Calculator"}
            </h1>
            <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === "sv"
                ? "Se hur ditt sparande växer exponentiellt med kraften av sammansatt ränta"
                : "See how your savings grow exponentially with the power of compound interest"}
            </p>
          </header>
          {/* Introduction Section */}
          <Card className="card-base" variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(34 197 94 / 0.1)",
                  color: "rgb(34 197 94)",
                  border: "1px solid rgb(34 197 94 / 0.2)",
                }}
              >
                <TrendingUp className="w-6 h-6" />
              </div>
              <Box className="flex-1">
                <CardTitle>
                  {locale === "sv"
                    ? "Världens åttonde underverk"
                    : "The Eighth Wonder of the World"}
                </CardTitle>
              </Box>
            </CardHeader>
            <CardContent className="space-y-4">
              <Text className="text-muted-foreground leading-relaxed">
                {locale === "sv"
                  ? "Ränta på ränta är en av de mest kraftfulla finansiella koncepten som kan hjälpa dig bygga långsiktig förmögenhet. När du sparar regelbundet och låter din avkastning växa över tid, skapar du en snöbollseffekt där dina pengar arbetar för dig."
                  : "Compound interest is one of the most powerful financial concepts that can help you build long-term wealth. When you save regularly and let your returns grow over time, you create a snowball effect where your money works for you."}
              </Text>

              <div className="relative py-6 px-4">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 relative md:order-2">
                    <div className="text-6xl text-muted-foreground/30 font-serif absolute -top-4 -left-2">
                      &ldquo;
                    </div>
                    <Text className="text-muted-foreground italic text-lg leading-relaxed pl-8 pt-2">
                      {locale === "sv"
                        ? "Ränta på ränta är världens åttonde underverk. Den som förstår det, tjänar på det - den som inte gör det, betalar för det."
                        : "Compound interest is the eighth wonder of the world. He who understands it, earns it - he who doesn't, pays it."}
                    </Text>
                    <div className="text-6xl text-muted-foreground/30 font-serif absolute -bottom-6 right-0">
                      &rdquo;
                    </div>
                    <Text className="text-muted-foreground text-sm mt-4 pl-8">
                      —{" "}
                      {locale === "sv" ? "Albert Einstein" : "Albert Einstein"}
                    </Text>
                  </div>
                  <div className="flex justify-center md:justify-start md:order-1">
                    <Image
                      priority
                      alt="Albert Einstein"
                      className="rounded-full object-cover grayscale opacity-70 flex-shrink-0 ring-2 ring-border"
                      height={80}
                      src="/einstein-optimized.png"
                      width={80}
                    />
                  </div>
                </div>
              </div>

              <Text className="text-muted-foreground leading-relaxed">
                {locale === "sv"
                  ? "Genom att förstå och utnyttja ränta på ränta kan du förvandla små månadsbelopp till betydande förmögenhet över tid. Vårt verktyg hjälper dig visualisera denna kraftfulla effekt."
                  : "By understanding and leveraging compound interest, you can transform small monthly amounts into significant wealth over time. Our tool helps you visualize this powerful effect."}
              </Text>

              <Text className="text-muted-foreground leading-relaxed">
                {locale === "sv"
                  ? "Kombinera denna sparkalkylator med vår hushållsbudget för att hitta mer pengar att spara varje månad."
                  : "Combine this savings calculator with our household budget to find more money to save each month."}
              </Text>
            </CardContent>
          </Card>

          {/* Calculator */}
          <CompoundInterestClient />

          {/* Tips Section */}
          <Card variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(234 179 8 / 0.1)",
                  color: "rgb(234 179 8)",
                  border: "1px solid rgb(234 179 8 / 0.2)",
                }}
              >
                <Lightbulb className="w-6 h-6" />
              </div>
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
                ].map((tip, tipIndex) => (
                  <div
                    key={tip.en}
                    className="flex items-center gap-4 p-6 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                      {tipIndex + 1}
                    </div>
                    <Text className="text-muted-foreground text-sm leading-relaxed">
                      {locale === "sv" ? tip.sv : tip.en}
                    </Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section for SEO */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {locale === "sv"
                ? "Vanliga frågor"
                : "Frequently Asked Questions"}
            </h2>
            <div className="grid gap-4">
              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {locale === "sv"
                      ? "Vad är ränta på ränta?"
                      : "What is compound interest?"}
                  </h3>
                  <Text className="text-muted-foreground">
                    {locale === "sv"
                      ? "Ränta på ränta innebär att du får avkastning inte bara på ditt ursprungliga kapital, utan även på tidigare års avkastning. Detta skapar en exponentiell tillväxt över tid."
                      : "Compound interest means you earn returns not only on your original capital, but also on previous years' returns. This creates exponential growth over time."}
                  </Text>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {locale === "sv"
                      ? "Hur mycket kan jag tjäna på ränta på ränta?"
                      : "How much can I earn with compound interest?"}
                  </h3>
                  <Text className="text-muted-foreground">
                    {locale === "sv"
                      ? "Det beror på startkapital, månadssparande, avkastning och tid. Med 7% årlig avkastning kan 1000 kr per månad växa till över 1 miljon kr på 25 år."
                      : "It depends on starting capital, monthly savings, returns, and time. With 7% annual returns, 1000 SEK per month can grow to over 1 million SEK in 25 years."}
                  </Text>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {locale === "sv"
                      ? "Är kalkylatorn gratis att använda?"
                      : "Is the calculator free to use?"}
                  </h3>
                  <Text className="text-muted-foreground">
                    {locale === "sv"
                      ? "Ja, vår ränta på ränta kalkylator är helt gratis att använda. Inga registreringar eller nedladdningar krävs."
                      : "Yes, our compound interest calculator is completely free to use. No registrations or downloads required."}
                  </Text>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Disclaimer */}
          <Card variant="elevated">
            <CardHeader>
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgb(239 68 68 / 0.1)",
                  color: "rgb(239 68 68)",
                  border: "1px solid rgb(239 68 68 / 0.2)",
                }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <Box className="flex-1">
                <CardTitle>
                  {locale === "sv"
                    ? "Viktig information"
                    : "Important Information"}
                </CardTitle>
              </Box>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground leading-relaxed">
                {locale === "sv"
                  ? "Denna kalkylator är endast för illustrativa syften. Faktisk avkastning kan variera beroende på marknadsförhållanden. All investering innebär risk och du kan förlora pengar. Konsultera alltid en finansiell rådgivare för personlig rådgivning."
                  : "This calculator is for illustrative purposes only. Actual returns may vary depending on market conditions. All investments involve risk and you may lose money. Always consult a financial advisor for personal advice."}
              </Text>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card variant="elevated">
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {locale === "sv"
                    ? "Redo att optimera din ekonomi?"
                    : "Ready to optimize your finances?"}
                </h2>
                <Text className="text-muted-foreground max-w-2xl mx-auto">
                  {locale === "sv"
                    ? "Använd vår hushållsbudget för att hitta mer pengar att spara varje månad."
                    : "Use our household budget to find more money to save each month."}
                </Text>
              </div>
              <div className="flex justify-center">
                <Link href="/hushallsbudget">
                  <Button size="lg">
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
};

export { generateMetadata };
export default RantaPaRantaPage;
