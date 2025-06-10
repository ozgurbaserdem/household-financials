"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Plus, Minus, X, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  items?: Array<{
    label: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

export const ModernNavbar = () => {
  const t = useTranslations("navbar");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownReference = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      id: "features",
      label: t("features"),
      items: [
        {
          label: t("household_budget_label"),
          description: t("household_budget_desc"),
          href: "/hushallsbudget",
        },
        {
          label: t("compound_interest_label"),
          description: t("compound_interest_desc"),
          href: "/ranta-pa-ranta",
        },
      ],
    },
    {
      id: "articles",
      label: t("articles"),
      items: [
        {
          label: t("main_article_label"),
          description: t("main_article_desc"),
          href: "/hushallskalkyl",
        },
      ],
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownReference.current &&
        !dropdownReference.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Generate scroll-aware background classes
  const getNavBgClasses = () => {
    const baseClasses = "backdrop-blur-[8px]";
    const scrolledClasses = isScrolled ? "shadow-2xl" : "";
    const bgClasses = isScrolled
      ? "bg-white/90 dark:bg-black/80"
      : "bg-white/80 dark:bg-black/60";

    return `${baseClasses} ${bgClasses} ${scrolledClasses}`;
  };

  return (
    <>
      {/* Desktop Docked Navbar */}
      <nav
        ref={dropdownReference}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 hidden lg:block ${getNavBgClasses()} border border-black/10 dark:border-white/10`}
        style={{
          borderRadius: "16px",
        }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo onLogoClick={() => setActiveDropdown(null)} />
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center mx-8">
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <div key={item.id} className="relative">
                    {item.items ? (
                      <button
                        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                        onClick={() => toggleDropdown(item.id)}
                      >
                        <span>{item.label}</span>
                        <motion.span
                          animate={{
                            rotate: activeDropdown === item.id ? 45 : 0,
                          }}
                          className="text-xs"
                          transition={{ duration: 0.2 }}
                        >
                          {activeDropdown === item.id ? (
                            <Minus className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                        </motion.span>
                      </button>
                    ) : (
                      <Link
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
                        href={
                          item.href as
                            | "/hushallsbudget"
                            | "/ranta-pa-ranta"
                            | "/hushallskalkyl"
                        }
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown */}
                    <AnimatePresence>
                      {item.items && activeDropdown === item.id && (
                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute left-1/2 transform -translate-x-1/2 mt-7 w-80 bg-white/95 dark:bg-black/90 backdrop-blur-[8px] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
                          exit={{ opacity: 0, y: -10 }}
                          initial={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-3">
                            {item.items.map((subItem) => (
                              <Link
                                key={`${item.id}-${subItem.href}`}
                                className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                                href={
                                  subItem.href as
                                    | "/hushallsbudget"
                                    | "/ranta-pa-ranta"
                                    | "/hushallskalkyl"
                                }
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-100">
                                    {subItem.label}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-[8px] lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo onLogoClick={() => setMobileMenuOpen(false)} />
            <button
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-[8px] lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full pt-16">
              <div className="flex-1 overflow-y-auto px-4">
                <AnimatePresence mode="wait">
                  {!mobileSubmenu ? (
                    <motion.div
                      key="main"
                      animate={{ x: 0, opacity: 1 }}
                      className="py-6 space-y-2"
                      exit={{ x: -20, opacity: 0 }}
                      initial={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {navItems.map((item) => (
                        <div key={item.id}>
                          {item.items ? (
                            <button
                              className="w-full flex items-center justify-between px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                              onClick={() => setMobileSubmenu(item.id)}
                            >
                              <span className="text-lg font-medium">
                                {item.label}
                              </span>
                              <Plus className="w-5 h-5" />
                            </button>
                          ) : (
                            <Link
                              className="block px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-lg font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                              href={
                                item.href as
                                  | "/hushallsbudget"
                                  | "/ranta-pa-ranta"
                                  | "/hushallskalkyl"
                              }
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          )}
                        </div>
                      ))}

                      <div className="mt-8 px-4">
                        <div className="flex items-center space-x-4">
                          <LanguageSwitcher />
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={mobileSubmenu}
                      animate={{ x: 0, opacity: 1 }}
                      className="py-6"
                      exit={{ x: 20, opacity: 0 }}
                      initial={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        className="flex items-center space-x-2 px-4 py-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 w-full rounded-lg hover:bg-black/5 dark:hover:bg-white/5 mb-4"
                        onClick={() => setMobileSubmenu(null)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-medium">Back</span>
                      </button>

                      <div className="space-y-2">
                        {navItems
                          .find((item) => item.id === mobileSubmenu)
                          ?.items?.map((subItem) => (
                            <Link
                              key={`mobile-${mobileSubmenu}-${subItem.href}`}
                              className="block px-4 py-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                              href={
                                subItem.href as
                                  | "/hushallsbudget"
                                  | "/ranta-pa-ranta"
                                  | "/hushallskalkyl"
                              }
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileSubmenu(null);
                              }}
                            >
                              <p className="text-lg font-medium text-gray-900 dark:text-white">
                                {subItem.label}
                              </p>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {subItem.description}
                              </p>
                            </Link>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
