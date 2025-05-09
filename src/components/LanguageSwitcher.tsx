"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the language switcher
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
      variant="outline"
      onClick={toggleLanguage}
      className="relative h-9 w-16 flex items-center justify-center"
      aria-label={locale === "sv" ? "Switch to English" : "Byt till svenska"}
    >
      <Box className="flex items-center justify-center">
        <Text className="mr-1 text-sm font-medium">
          {locale === "sv" ? "SV" : "EN"}
        </Text>
        <Text className="text-xl">{locale === "sv" ? "🇸🇪" : "🇬🇧"}</Text>
      </Box>
    </Button>
  );
}
