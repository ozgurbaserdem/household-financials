"use client";

import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/shared/Navbar";
import HushallskalkylContent from "@/features/hushallskalkyl/HushallskalkylContent";
import { useLocale } from "next-intl";
import Head from "next/head";

export default function HushallskalkylPage() {
  const locale = useLocale();

  return (
    <>
      <Head>
        <title>
          {locale === "sv"
            ? "Hushållskalkyl & Hushållsbudget Gratis - Budgetkollen Sverige"
            : "Household Budget & Calculator Free - Budgetkollen Sweden"}
        </title>
        <meta
          name="description"
          content={
            locale === "sv"
              ? "Komplett guide till hushållskalkyl och hushållsbudget. Lär dig skapa din egen familjebudget, månadsbudget och få kontroll över din privatekonomi med Budgetkollen."
              : "Complete guide to household budget and calculator. Learn to create your family budget, monthly budget and control your personal finances with Budgetkollen."
          }
        />
        <meta
          name="keywords"
          content={
            locale === "sv"
              ? "hushållskalkyl, hushållsbudget, familjebudget, månadsbudget, budgetplanering, privatekonomi, ekonomisk planering, sparande, budgettips, hushållsekonomi"
              : "household calculator, household budget, family budget, monthly budget, budget planning, personal finance, financial planning, savings, budget tips"
          }
        />
        <link
          rel="canonical"
          href={`https://www.budgetkollen.se/${locale}/hushallskalkyl`}
        />

        {/* Article Schema for better content recognition */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline:
                locale === "sv"
                  ? "Hushållskalkyl & Hushållsbudget - Komplett Guide"
                  : "Household Budget & Calculator - Complete Guide",
              description:
                locale === "sv"
                  ? "Lär dig allt om hushållskalkyl och hushållsbudget. Få praktiska tips för att skapa din egen familjebudget och ta kontroll över din ekonomi."
                  : "Learn everything about household budgets and calculators. Get practical tips to create your family budget and take control of your finances.",
              author: {
                "@type": "Organization",
                name: "Budgetkollen",
              },
              publisher: {
                "@type": "Organization",
                name: "Budgetkollen",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.budgetkollen.se/favicon.svg",
                },
              },
              datePublished: "2025-01-01",
              dateModified: new Date().toISOString(),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.budgetkollen.se/${locale}/hushallskalkyl`,
              },
              keywords:
                locale === "sv"
                  ? "hushållskalkyl, hushållsbudget, familjebudget, månadsbudget, budgetplanering"
                  : "household calculator, household budget, family budget, monthly budget, budget planning",
              articleSection: "Personal Finance",
              inLanguage: locale,
            }),
          }}
        />
      </Head>

      <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
        <Navbar />
        <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
          {/* Add SEO-friendly heading structure */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-center">
              {locale === "sv"
                ? "Hushållskalkyl & Hushållsbudget - Få Kontroll över Din Ekonomi"
                : "Household Budget & Calculator - Take Control of Your Finances"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              {locale === "sv"
                ? "Skapa din personliga hushållsbudget med Sveriges mest användbara budgetkalkylator. Gratis verktyg för att planera din familjs ekonomi och sparmål."
                : "Create your personal household budget with Sweden's most useful budget calculator. Free tool to plan your family's finances and savings goals."}
            </p>
          </header>

          <HushallskalkylContent />

          {/* Add FAQ section for better SEO */}
          <section className="mt-12 bg-white dark:bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
              {locale === "sv"
                ? "Vanliga Frågor om Hushållsbudget"
                : "Frequently Asked Questions about Household Budget"}
            </h2>
            <div className="space-y-6">
              {locale === "sv" ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Vad är skillnaden mellan hushållskalkyl och
                      hushållsbudget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      En hushållskalkyl hjälper dig att beräkna specifika
                      ekonomiska scenarion, medan en hushållsbudget är en
                      övergripande plan för dina inkomster och utgifter över
                      tid.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Hur ofta bör jag uppdatera min hushållsbudget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Vi rekommenderar att du ser över din hushållsbudget
                      månadsvis och gör större justeringar kvartalsvis eller när
                      din ekonomiska situation förändras.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Vad ska jag inkludera i min familjebudget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Din familjebudget bör inkludera alla inkomster, fasta
                      utgifter som hyra och lån, rörliga utgifter som mat och
                      transport, samt sparande och buffert för oförutsedda
                      utgifter.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Whats the difference between a household calculator and
                      household budget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      A household calculator helps you calculate specific
                      financial scenarios, while a household budget is an
                      overall plan for your income and expenses over time.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      How often should I update my household budget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We recommend reviewing your household budget monthly and
                      making major adjustments quarterly or when your financial
                      situation changes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      What should I include in my family budget?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your family budget should include all income, fixed
                      expenses like rent and loans, variable expenses like food
                      and transport, plus savings and emergency fund.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </Box>
      </Main>
    </>
  );
}
