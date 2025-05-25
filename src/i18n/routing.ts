import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["sv", "en"],

  // Used when no locale matches
  defaultLocale: "sv",

  // Always show locale in URL
  localePrefix: "always",

  // Enable locale detection
  localeDetection: true,

  pathnames: {
    "/": {
      en: "/",
    },
    "/hushallskalkyl": {
      en: "/householdbudget",
    },
    // Add more localized pathnames here if needed
  },
});
