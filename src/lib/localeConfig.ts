interface LocaleConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  openGraphImageAlt: string;
  webApplicationName: string;
  locale: string;
}

interface LocaleConfigs {
  sv: LocaleConfig;
  en: LocaleConfig;
}

const localeConfigs: LocaleConfigs = {
  sv: {
    title:
      "Ränta på Ränta Kalkylator - Räkna ut Ränta på Ränta Gratis | Budgetkollen",
    description:
      "Gratis ränta på ränta kalkylator - se hur ditt sparande växer över tid. Beräkna framtida förmögenhet med månatligt sparande och visualiserade resultat.",
    keywords:
      "ränta på ränta kalkylator, räkna ut ränta på ränta, sammansatt ränta, sparkalkylator, investeringskalkylator, månadssparande, privatekonomi, budgetkollen",
    canonicalUrl: "https://www.budgetkollen.se/ranta-pa-ranta",
    openGraphImageAlt: "Ränta på Ränta Kalkylator - Budgetkollen",
    webApplicationName: "Budgetkollen Ränta på Ränta",
    locale: "sv_SE",
  },
  en: {
    title:
      "Compound Interest Calculator - Free Savings Calculator | Budgetkollen",
    description:
      "Free compound interest calculator showing how your savings grow over time. Calculate future wealth with monthly savings and visual results.",
    keywords:
      "compound interest, savings calculator, investment calculator, personal finance, budgetkollen",
    canonicalUrl: "https://www.budgetkollen.se/en/compound-interest",
    openGraphImageAlt: "Compound Interest Calculator - Budgetkollen",
    webApplicationName: "Budgetkollen Compound Interest",
    locale: "en_US",
  },
};

export const getLocaleConfig = (locale: string): LocaleConfig => {
  return localeConfigs[locale as keyof LocaleConfigs] || localeConfigs.sv;
};

export const generateWebApplicationSchema = (locale: string) => {
  const config = getLocaleConfig(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": config.canonicalUrl + "#webapp",
        name: config.webApplicationName,
        description: config.description,
        url: config.canonicalUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires HTML5 support",
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
        featureList: [
          locale === "sv" ? "Ränteberäkning" : "Compound interest calculation",
          locale === "sv" ? "Månatligt sparande" : "Monthly savings input",
          locale === "sv"
            ? "Tidsvisualisering"
            : "Investment timeline visualization",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": config.canonicalUrl + "#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "sv" ? "Hem" : "Home",
            item:
              "https://www.budgetkollen.se" + (locale === "en" ? "/en" : ""),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "sv" ? "Ränta på ränta" : "Compound Interest",
            item: config.canonicalUrl,
          },
        ],
      },
    ],
  };
};
