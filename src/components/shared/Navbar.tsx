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
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navbar = () => {
  const t = useTranslations("navbar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="w-full navbar-base sticky top-0 z-50 backdrop-blur-sm"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo onLogoClick={() => setMobileMenuOpen(false)} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu className="relative z-10">
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="group inline-flex items-center gap-1 px-4 py-2 rounded-full font-medium border-hover transition-all duration-200"
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
                    <span className="text-foreground group-hover:text-foreground">
                      {t("articles")}
                    </span>
                    <CaretDownIcon className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 transform -translate-x-1/2 mt-3 min-w-[320px] card-base shadow-lg">
                    <ul className="grid gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 rounded-md hover:bg-muted transition-all duration-200 group"
                            href="/hushallsbudget"
                          >
                            <div className="font-semibold text-base text-foreground">
                              {t("household_budget_label")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("household_budget_desc")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 rounded-md hover:bg-muted transition-all duration-200 group"
                            href="/ranta-pa-ranta"
                          >
                            <div className="font-semibold text-base text-foreground">
                              {t("compound_interest_label")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("compound_interest_desc")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block p-3 rounded-md hover:bg-muted transition-all duration-200 group"
                            href="/hushallskalkyl"
                          >
                            <div className="font-semibold text-base text-foreground">
                              {t("main_article_label")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("main_article_desc")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuIndicator />
              <NavigationMenuViewport />
            </NavigationMenu>

            <Box className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
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
          <div className="md:hidden border-t border-border">
            <Box className="container-padding py-4 space-y-4">
              <Box className="space-y-2">
                <Text className="text-sm font-medium text-muted-foreground px-3">
                  {t("articles")}
                </Text>
                <Link
                  className="block p-3 rounded-md hover:bg-muted transition-all duration-200"
                  href="/hushallsbudget"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-foreground">
                    {t("household_budget_label")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("household_budget_desc")}
                  </div>
                </Link>
                <Link
                  className="block p-3 rounded-md hover:bg-muted transition-all duration-200"
                  href="/ranta-pa-ranta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-foreground">
                    {t("compound_interest_label")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("compound_interest_desc")}
                  </div>
                </Link>
                <Link
                  className="block p-3 rounded-md hover:bg-muted transition-all duration-200"
                  href="/hushallskalkyl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-semibold text-foreground">
                    {t("main_article_label")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("main_article_desc")}
                  </div>
                </Link>
              </Box>

              <Box className="flex items-center gap-3 pt-4 border-t border-border">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </Box>
            </Box>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
