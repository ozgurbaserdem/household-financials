"use client";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      aria-label="Toggle theme"
      className="relative overflow-hidden border border-gray-400/50 dark:border-gray-600/50 rounded-full shadow-xs hover:bg-white/10 "
      size="icon"
      variant="ghost"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon className="w-4 h-4 text-foreground" />
      ) : (
        <SunIcon className="w-4 h-4 text-foreground" />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
