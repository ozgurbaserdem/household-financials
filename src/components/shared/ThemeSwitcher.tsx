"use client";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="relative h-9 w-9 glass border-gray-700/50 hover:bg-white/10 overflow-hidden group"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {resolvedTheme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <MoonIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <SunIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20"
          initial={{ scale: 0, borderRadius: "50%" }}
          whileHover={{ scale: 1.5, borderRadius: "0%" }}
          transition={{ type: "tween", duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
}
