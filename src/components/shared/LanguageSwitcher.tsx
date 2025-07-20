"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useRouter, usePathname } from "@/i18n/navigation";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleLanguage = () => {
    const newLocale = locale === "sv" ? "en" : "sv";
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Button
      aria-label={locale === "sv" ? "Switch to English" : "Byt till svenska"}
      className="relative h-9 px-3 border-gray-400/50 dark:border-gray-600/50 shadow-xs hover:bg-white/10 overflow-hidden group"
      variant="outline"
      onClick={toggleLanguage}
    >
      <Box className="flex items-center justify-center gap-2">
        <Text className="text-sm font-medium text-foreground transition-colors">
          {locale === "sv" ? "SV" : "EN"}
        </Text>
        <motion.div
          animate={{ rotate: locale === "sv" ? 0 : 180 }}
          className="text-lg"
          initial={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {locale === "sv" ? "🇸🇪" : "🇬🇧"}
        </motion.div>
      </Box>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        initial={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        whileHover={{ x: 0 }}
      />
    </Button>
  );
};

export { LanguageSwitcher };
