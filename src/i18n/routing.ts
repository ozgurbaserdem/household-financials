import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["sv", "en"],

  // Used when no locale matches
  defaultLocale: "sv",

  // Always show locale in URL
  localePrefix: "as-needed",

  // Disable automatic locale detection to always show Swedish by default
  localeDetection: false,

  // Now that we're using Vercel (not static export), we can use localized pathnames
  pathnames: {
    "/": "/",
    "/hushallsbudget": {
      sv: "/hushallsbudget",
      en: "/household-budget",
    },
    "/hushallskalkyl": {
      sv: "/hushallskalkyl",
      en: "/householdbudget",
    },
    "/ranta-pa-ranta": {
      sv: "/ranta-pa-ranta",
      en: "/compound-interest",
    },
    // Add more localized pathnames here as needed
  },
});
