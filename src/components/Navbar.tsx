"use client";

import React, { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@radix-ui/react-navigation-menu";
import { Calculator, Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getStepParam, getStepName } from "@/utils/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CaretDownIcon } from "@radix-ui/react-icons";

export function Navbar() {
  const t = useTranslations("navbar");
  const tApp = useTranslations("app");
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create the home URL using utility functions
  const stepParam = getStepParam(locale);
  const firstStep = {
    label: locale === "sv" ? "Inkomst" : "Income",
    component: null,
  };
  const firstStepName = getStepName(firstStep, locale);
  const homeUrl = `/?${stepParam}=${firstStepName}`;

  const Logo = () => (
    <Link
      href={homeUrl}
      className="flex items-center gap-3 group"
      onClick={() => setMobileMenuOpen(false)}
    >
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Box className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25">
          <Calculator className="w-6 h-6 text-white" />
        </Box>
        <Box className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 blur-md opacity-50" />
      </motion.div>
      <motion.span
        className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {tApp("title")}
      </motion.span>
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-full glass border-b border-gray-800/50 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu className="relative z-10">
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group inline-flex items-center gap-1 px-4 py-2 rounded-lg font-medium glass hover:bg-white/10 transition-all duration-200">
                    <span className="text-gray-300 group-hover:text-white">
                      {t("articles")}
                    </span>
                    <CaretDownIcon className="text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[320px] bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-gray-600 shadow-lg space-y-2 rounded-xl border border-gray-800 p-4">
                    {/* Arrow */}
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
                        className="text-gray-900/90"
                      />
                    </svg>
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid gap-2"
                    >
                      {locale === "sv" && (
                        <>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/hushallskalkyl"
                                className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200 group"
                              >
                                <div className="font-semibold text-base text-gray-200 group-hover:text-white">
                                  {t("main_article_label")}
                                </div>
                                <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                  {t("main_article_desc")}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/ranta-pa-ranta"
                                className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200 group"
                              >
                                <div className="font-semibold text-base text-gray-200 group-hover:text-white">
                                  {t("compound_interest_label")}
                                </div>
                                <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                  {t("compound_interest_desc")}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </>
                      )}
                      {locale === "en" && (
                        <>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/householdbudget"
                                className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200 group"
                              >
                                <div className="font-semibold text-base text-gray-200 group-hover:text-white">
                                  {t("main_article_label")}
                                </div>
                                <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                  {t("main_article_desc")}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/compound-interest"
                                className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200 group"
                              >
                                <div className="font-semibold text-base text-gray-200 group-hover:text-white">
                                  {t("compound_interest_label")}
                                </div>
                                <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                  {t("compound_interest_desc")}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </>
                      )}
                    </motion.ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuIndicator />
              <NavigationMenuViewport />
            </NavigationMenu>

            <Box className="flex items-center gap-3">
              <LanguageSwitcher />
              {/* Disable until we have solved the issue with Light Theme */}
              {/* <ThemeSwitcher /> */}
            </Box>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <Box className="px-4 py-4 space-y-4 glass border-t border-gray-800">
              <Box className="space-y-2">
                <Text className="text-sm font-medium text-gray-400 px-3">
                  {t("articles")}
                </Text>
                {locale === "sv" && (
                  <>
                    <Link
                      href="/hushallskalkyl"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="font-semibold text-gray-200">
                        {t("main_article_label")}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t("main_article_desc")}
                      </div>
                    </Link>
                    <Link
                      href="/ranta-pa-ranta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="font-semibold text-gray-200">
                        {t("compound_interest_label")}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t("compound_interest_desc")}
                      </div>
                    </Link>
                  </>
                )}
                {locale === "en" && (
                  <>
                    <Link
                      href="/householdbudget"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="font-semibold text-gray-200">
                        {t("main_article_label")}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t("main_article_desc")}
                      </div>
                    </Link>
                    <Link
                      href="/compound-interest"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-lg glass hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="font-semibold text-gray-200">
                        {t("compound_interest_label")}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t("compound_interest_desc")}
                      </div>
                    </Link>
                  </>
                )}
              </Box>

              <Box className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <LanguageSwitcher />
                {/* Disable until we have solved the issue with Light Theme */}
                {/* <ThemeSwitcher /> */}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
