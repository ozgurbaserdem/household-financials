"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChangeLanguage = (newLocale: "sv" | "en") => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Box className="flex gap-2">
      <Button
        type="button"
        onClick={() => handleChangeLanguage("sv")}
        aria-label="Byt till svenska"
        className={`rounded p-2 border ${
          locale === "sv" ? "border-blue-500" : "border-transparent"
        } bg-white dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <Text className="text-2xl">🇸🇪</Text>
      </Button>
      <Button
        type="button"
        onClick={() => handleChangeLanguage("en")}
        aria-label="Switch to English"
        className={`rounded p-2 border ${
          locale === "en" ? "border-blue-500" : "border-transparent"
        } bg-white dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <Text className="text-2xl">🇬🇧</Text>
      </Button>
    </Box>
  );
}
