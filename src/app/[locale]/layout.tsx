import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";
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
      ? "Budgetkollen - Hushållskalkyl & Hushållsbudget | Din personliga budgetkalkylator"
      : "Budgetkollen - Your Personal Budget Calculator";

  const description =
    locale === "sv"
      ? "Budgetkollen hjälper dig att hantera din ekonomi smartare. Skapa din hushållsbudget och hushållskalkyl enkelt med vår budgetkalkylator. Beräkna lån, utgifter och sparmål. Perfekt för svenska hushåll."
      : "Budgetkollen helps you manage your finances smarter. Calculate your loans, expenses, and savings goals with our easy budget calculator. Perfect for Swedish households.";

  return {
    title,
    description,
    keywords:
      locale === "sv"
        ? "budgetkalkylator, hushållsekonomi, lånekalkylator, amorteringskalkylator, räntekalkylator, sparmål, utgiftskalkylator, svensk ekonomi, hushållskalkyl, hushållsbudget"
        : "budget calculator, household economy, loan calculator, amortization calculator, interest calculator, savings goals, expense calculator, Swedish economy",
    authors: [{ name: "Budgetkollen" }],
    creator: "Budgetkollen",
    publisher: "Budgetkollen",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://www.budgetkollen.se"),
    alternates: {
      canonical: "/",
      languages: {
        sv: "/sv",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: "https://www.budgetkollen.se",
      siteName: "Budgetkollen",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "G2E34AZZPQ97qu8fxJbgKwM0dUveivxfv84F97tMqV8",
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

  // Validate that the locale is supported
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name:
                locale === "sv"
                  ? "Budgetkollen - Hushållskalkyl & Hushållsbudget"
                  : "Budgetkollen - Household Budget Calculator",
              description:
                locale === "sv"
                  ? "Budgetkollen hjälper dig att skapa hushållskalkyl och hushållsbudget. Enkelt verktyg för att planera din ekonomi, utgifter och sparmål."
                  : "Budgetkollen helps you create a household budget and calculator. Easy tool to plan your finances, expenses, and savings goals.",
              url: `https://www.budgetkollen.se/${locale === "sv" ? "sv" : "en"}`,
              applicationCategory: "FinanceApplication",
              inLanguage: locale,
              keywords:
                locale === "sv"
                  ? "budgetkalkylator, hushållskalkyl, hushållsbudget, ekonomi, sparmål, utgifter"
                  : "budget calculator, household budget, finance, savings, expenses",
              offers: {
                "@type": "Offer",
                price: 0,
                priceCurrency: "SEK",
                availability: "https://schema.org/InStock",
              },
              operatingSystem: "All",
            }),
          }}
        />
      </head>
      <body className={spaceGrotesk.className}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          // Disable client-side caching to ensure fresh messages on locale change
          timeZone="Europe/Stockholm"
          now={new Date()}
        >
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
