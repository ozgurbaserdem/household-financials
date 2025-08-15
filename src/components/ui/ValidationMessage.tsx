"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import React from "react";

import { cn } from "@/shared/utils/general";

import { Text } from "./Text";

interface ValidationMessageProps {
  message?: string;
  show?: boolean;
  className?: string;
  variant?: "inline" | "floating";
}

export const ValidationMessage = ({
  message,
  show = false,
  className,
  variant = "inline",
}: ValidationMessageProps) => {
  if (!message || !show) return null;

  const baseClasses = "flex items-center gap-2 text-sm font-medium";

  const variantClasses = {
    inline:
      "text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2",
    floating:
      "text-red-400 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-lg px-4 py-3 shadow-lg",
  };

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-live="polite"
          className={cn(baseClasses, variantClasses[variant], className)}
          exit={{
            opacity: 0,
            y: variant === "floating" ? -10 : 5,
            scale: 0.95,
          }}
          initial={{
            opacity: 0,
            y: variant === "floating" ? -10 : 5,
            scale: 0.95,
          }}
          role="alert"
          transition={{
            duration: 0.2,
            ease: "easeOut",
            layout: { duration: 0.15 },
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <Text className="text-inherit">{message}</Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
