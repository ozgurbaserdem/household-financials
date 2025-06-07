"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        onClick={toggleLanguage}
        className="relative h-9 px-3 glass border-gray-700/50 hover:bg-white/10 overflow-hidden group"
        aria-label={locale === "sv" ? "Switch to English" : "Byt till svenska"}
      >
        <Box className="flex items-center justify-center gap-2">
          <Text className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            {locale === "sv" ? "SV" : "EN"}
          </Text>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: locale === "sv" ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-lg"
          >
            {locale === "sv" ? "🇸🇪" : "🇬🇧"}
          </motion.div>
        </Box>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
};

export { LanguageSwitcher };
