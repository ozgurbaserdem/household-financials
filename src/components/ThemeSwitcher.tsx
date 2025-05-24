"use client";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the theme switcher
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative h-9 w-9 rounded-full"
      aria-label="Toggle theme"
    >
      <SunIcon
        className={cn(
          "absolute size-5 rotate-0 scale-100 transition-all duration-300",
          resolvedTheme === "dark" ? "rotate-90 scale-0" : ""
        )}
      />
      <MoonIcon
        className={cn(
          "absolute size-5 rotate-90 scale-0 transition-all duration-300",
          resolvedTheme === "dark" ? "rotate-0 scale-100" : ""
        )}
      />
    </Button>
  );
}
