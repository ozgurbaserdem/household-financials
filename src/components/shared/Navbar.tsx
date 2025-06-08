"use client";

import { CaretDownIcon } from "@radix-ui/react-icons";
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
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export const Navbar = () => {
  const t = useTranslations("navbar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      animate={{ y: 0 }}
      aria-label="Main navigation"
      className="w-full glass-navbar sticky top-0 z-50"
      initial={{ y: -100 }}
      role="navigation"
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo onLogoClick={() => setMobileMenuOpen(false)} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu className="relative z-10">
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="group inline-flex items-center gap-1 px-4 py-2 rounded-lg font-medium glass hover:bg-white/10 transition-all duration-200"
                    onClick={(event) => {
                      if (event.detail > 0) {
                        event.preventDefault();
                      }
                    }}
                    onPointerDown={(event) => {
                      if (event.pointerType === "mouse") {
                        event.preventDefault();
                      }
                    }}
                  >
                    <span className="text-gray-300 group-hover:text-white">
                      {t("articles")}
                    </span>
                    <CaretDownIcon className="w-5 h-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[320px] bg-gray-800/90 rounded-lg border border-gray-800 shadow-lg rounded-md">
                    {/* Arrow */}
                    <svg
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                      fill="none"
                      height="8"
                      viewBox="0 0 16 8"
                      width="16"
                    >
                      <path
                        className="text-gray-900/90"
                        d="M8 0L16 8H0L8 0Z"
                        fill="currentColor"
                      />
                    </svg>
                    <motion.ul
                      animate={{ opacity: 1, y: 0 }}
                      className="grid gap-2"
                      initial={{ opacity: 0, y: -10 }}
                    >
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
                            href="/hushallsbudget"
                          >
                            <div className="font-semibold text-base text-gray-200 group-hover:text-white">
                              {t("household_budget_label")}
                            </div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300">
                              {t("household_budget_desc")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
                            href="/ranta-pa-ranta"
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
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
                            href="/hushallskalkyl"
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
            aria-label="Toggle menu"
            className="md:hidden"
            size="icon"
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  initial={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  initial={{ rotate: 90, opacity: 0 }}
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
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box className="px-4 py-4 space-y-4 glass border-t border-gray-800">
              <Box className="space-y-2">
                <Text className="text-sm font-medium text-gray-400 px-3">
                  {t("articles")}
                </Text>
                <Link
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
                  href="/hushallsbudget"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-gray-200">
                    {t("household_budget_label")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("household_budget_desc")}
                  </div>
                </Link>
                <Link
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
                  href="/ranta-pa-ranta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-gray-200">
                    {t("compound_interest_label")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("compound_interest_desc")}
                  </div>
                </Link>
                <Link
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
                  href="/hushallskalkyl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-gray-200">
                    {t("main_article_label")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("main_article_desc")}
                  </div>
                </Link>
              </Box>

              <Box className="flex items-center gap-3 pt-4 border-t border-gray-700">
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
};
