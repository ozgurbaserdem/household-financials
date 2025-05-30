import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/shared/providers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
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

  const canonicalUrl = `https://www.budgetkollen.se/${locale}`;

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
      languages: {
        sv: "/sv",
        en: "/en",
        "x-default": "/sv", // Swedish as default for international
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
          url: "/og-image.png", // You'll need to create this
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
      // Add other verification codes if you have them:
      // bing: "YOUR_BING_CODE",
      // yandex: "YOUR_YANDEX_CODE",
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Enhanced Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "@id": `https://www.budgetkollen.se/${locale}#webapp`,
                  name:
                    locale === "sv"
                      ? "Budgetkollen - Hushållsbudget & Hushållskalkyl"
                      : "Budgetkollen - Budget Calculator",
                  description:
                    locale === "sv"
                      ? "Gratis hushållsbudget och budgetkalkylator för svenska familjer. Planera din ekonomi, beräkna lån och sparmål enkelt."
                      : "Free household budget and calculator for Swedish families. Plan your finances, calculate loans and savings goals easily.",
                  url: `https://www.budgetkollen.se/${locale}`,
                  applicationCategory: "FinanceApplication",
                  operatingSystem: "All",
                  browserRequirements: "HTML5, JavaScript",
                  inLanguage: locale,
                  isAccessibleForFree: true,
                  keywords:
                    locale === "sv"
                      ? "hushållsbudget, hushållskalkyl, budgetkalkylator, privatekonomi, lånekalkylator"
                      : "household budget, budget calculator, personal finance, loan calculator",
                  offers: {
                    "@type": "Offer",
                    price: 0,
                    priceCurrency: "SEK",
                    availability: "https://schema.org/InStock",
                  },
                  featureList: [
                    locale === "sv" ? "Hushållsbudget" : "Household Budget",
                    locale === "sv" ? "Lånekalkylator" : "Loan Calculator",
                    locale === "sv" ? "Sparkalkyler" : "Savings Calculator",
                    locale === "sv" ? "Utgiftsanalys" : "Expense Analysis",
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.budgetkollen.se#organization",
                  name: "Budgetkollen",
                  url: "https://www.budgetkollen.se",
                  logo: "https://www.budgetkollen.se/favicon.svg",
                  sameAs: [
                    // Add your social media profiles here when you create them
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "SE",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.budgetkollen.se#website",
                  url: "https://www.budgetkollen.se",
                  name: "Budgetkollen",
                  description:
                    locale === "sv"
                      ? "Sveriges ledande verktyg för hushållsbudget och ekonomisk planering"
                      : "Sweden's leading tool for household budgeting and financial planning",
                  publisher: {
                    "@id": "https://www.budgetkollen.se#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://www.budgetkollen.se/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                  inLanguage: [locale],
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: locale === "sv" ? "Hem" : "Home",
                      item: `https://www.budgetkollen.se/${locale}`,
                    },
                  ],
                },
              ],
            }),
          }}
        />

        {/* Hreflang tags for better international SEO */}
        <link
          rel="alternate"
          hrefLang="sv"
          href="https://www.budgetkollen.se/sv"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.budgetkollen.se/en"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.budgetkollen.se/sv"
        />
      </head>
      <body className={`${spaceGrotesk.className} scrollbar-gutter-stable`}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Europe/Stockholm"
          now={new Date()}
        >
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
