"use client";

import { Menu, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Box } from "@/components/ui/Box";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";

interface ViewModeToggleProps {
  isSimple: boolean;
  onToggle: (isSimple: boolean) => void;
}

export const ViewModeToggle = ({ isSimple, onToggle }: ViewModeToggleProps) => {
  const t = useTranslations("expense_categories");

  return (
    <>
      <Box className="flex items-center gap-2">
        <Text className="text-sm text-muted-foreground">
          {t("view_toggle.detailed")}
        </Text>
        <Switch checked={isSimple} size="sm" onCheckedChange={onToggle} />
        <Text className="text-sm text-muted-foreground">
          {t("view_toggle.simple")}
        </Text>
      </Box>
      <div className="relative w-8 h-8">
        <Minus
          className={`absolute inset-0 w-8 h-8 text-foreground transition-all duration-300 ease-in-out transform ${
            isSimple
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-90"
          }`}
        />
        <Menu
          className={`absolute inset-0 w-8 h-8 text-foreground transition-all duration-300 ease-in-out transform ${
            !isSimple
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-90"
          }`}
        />
      </div>
    </>
  );
};
