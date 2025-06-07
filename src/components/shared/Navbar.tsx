"use client";

import React, { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
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
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Logo } from "./Logo";

export const Navbar = () => {
  const t = useTranslations("navbar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-full glass-navbar sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
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
                    onPointerDown={(event) => {
                      if (event.pointerType === "mouse") {
                        event.preventDefault();
                      }
                    }}
                    onClick={(event) => {
                      if (event.detail > 0) {
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
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/hushallsbudget"
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
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
                            href="/ranta-pa-ranta"
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
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
                            href="/hushallskalkyl"
                            className="block p-3 hover:bg-white/10 transition-all duration-200 group"
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
                <Link
                  href="/hushallsbudget"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="font-semibold text-gray-200">
                    {t("household_budget_label")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("household_budget_desc")}
                  </div>
                </Link>
                <Link
                  href="/ranta-pa-ranta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="font-semibold text-gray-200">
                    {t("compound_interest_label")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("compound_interest_desc")}
                  </div>
                </Link>
                <Link
                  href="/hushallskalkyl"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 hover:bg-white/10 transition-all duration-200"
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
