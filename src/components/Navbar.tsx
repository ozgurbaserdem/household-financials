import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTranslations, useLocale } from "next-intl";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/navigation";
import { getStepParam, getStepName } from "@/utils/navigation";

export function Navbar() {
  const t = useTranslations("navbar");
  const tApp = useTranslations("app");
  const locale = useLocale();

  // Create the home URL using utility functions
  const stepParam = getStepParam(locale);

  // Create a mock first step to use with getStepName
  const firstStep = {
    label: locale === "sv" ? "Inkomst" : "Income",
    component: null,
  };

  const firstStepName = getStepName(firstStep, locale);
  const homeUrl = `/?${stepParam}=${firstStepName}`;

  return (
    <nav
      className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href={homeUrl}
              className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {tApp("title")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NavigationMenu.Root className="relative z-10">
              <NavigationMenu.List className="flex items-center gap-2">
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger className="group inline-flex items-center gap-1 px-3 py-2 rounded-md font-medium bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {t("articles")}
                    <CaretDownIcon className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="relative left-1/2 transform -translate-x-1/2 mt-2 min-w-[320px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    {/* SVG Triangle Spike */}
                    <svg
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                      width="16"
                      height="8"
                      viewBox="0 0 16 8"
                      fill="none"
                    >
                      <path
                        d="M8 0L16 8H0L8 0Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-white dark:text-gray-900 [stroke:theme(colors.gray.200)] dark:[stroke:theme(colors.gray.700)]"
                      />
                    </svg>
                    <ul className="grid gap-2">
                      {locale === "sv" && (
                        <li>
                          <NavigationMenu.Link asChild>
                            <Link
                              href="/hushallskalkyl"
                              className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-semibold text-base">
                                {t("main_article_label")}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t("main_article_desc")}
                              </div>
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      )}
                      {locale === "en" && (
                        <li>
                          <NavigationMenu.Link asChild>
                            <Link
                              href="/householdbudget"
                              className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-semibold text-base">
                                {t("main_article_label")}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t("main_article_desc")}
                              </div>
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      )}
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.List>
              <NavigationMenu.Indicator className="absolute top-full left-0 w-full h-1 bg-blue-500 rounded-b-lg" />
              <NavigationMenu.Viewport className="absolute left-0 w-full" />
            </NavigationMenu.Root>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
