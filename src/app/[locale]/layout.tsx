import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { ModernNavbar } from "@/shared/components/ModernNavbar";
import { Providers } from "@/shared/components/Providers";

import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
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
          type: "image/png",
          alt:
            locale === "sv"
              ? "Budgetkollen - Hushållsbudget och Kalkylator"
              : "Budgetkollen - Budget Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@budgetkollen",
      creator: "@budgetkollen",
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
};

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  // For "as-needed" routing: Swedish (default) has no locale prefix, English has /en prefix
  const canonicalUrl =
    locale === "sv"
      ? "https://www.budgetkollen.se"
      : `https://www.budgetkollen.se/en`;

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        {/* Primary multi-resolution ICO favicon (contains 16x16 through 256x256) */}
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />

        {/* Google-recommended 48x48 PNG favicon for search results */}
        <link
          href="/favicon-48x48.png"
          rel="icon"
          sizes="48x48"
          type="image/png"
        />

        {/* Additional PNG favicons for various uses */}
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />

        {/* Apple Touch Icon (PNG) for iOS devices */}
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />

        {/* Manifest for PWA */}
        <link href="/manifest.json" rel="manifest" />

        {/* SVG favicon for scalable support */}
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

        {/* Font preconnects */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />

        {/* Enhanced Schema.org markup */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "@id": `${canonicalUrl}#webapp`,
                  name:
                    locale === "sv"
                      ? "Budgetkollen - Hushållsbudget & Hushållskalkyl"
                      : "Budgetkollen - Budget Calculator",
                  description:
                    locale === "sv"
                      ? "Gratis hushållsbudget och budgetkalkylator för svenska familjer. Planera din ekonomi, beräkna lån och sparmål enkelt."
                      : "Free household budget and calculator for Swedish families. Plan your finances, calculate loans and savings goals easily.",
                  url: canonicalUrl,
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
                  sameAs: ["https://x.com/budgetkollen"],
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
                  inLanguage: [locale],
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: locale === "sv" ? "Hem" : "Home",
                      item: canonicalUrl,
                    },
                  ],
                },
              ],
            }),
          }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${spaceGrotesk.className} scrollbar-gutter-stable bg-gray-950`}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          now={new Date()}
          timeZone="Europe/Stockholm"
        >
          <Providers>
            <ModernNavbar />
            {children}
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export { generateMetadata };
export default LocaleLayout;
