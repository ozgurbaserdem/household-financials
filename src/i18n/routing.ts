import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "sv"],

  // Used when no locale matches
  defaultLocale: "sv",

  // Add these options to ensure proper locale detection and navigation
  localePrefix: "always", // Only show locale in URL when not default
  localeDetection: true, // Enable locale detection
});
