"use client";

import * as React from "react";
import { Box } from "./box";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  glass?: boolean;
  hover?: boolean;
  delay?: number;
  children?: React.ReactNode;
  animate?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  (
    {
      className,
      gradient,
      glass,
      hover = true,
      delay = 0,
      children,
      animate = true,
      ...props
    },
    ref
  ) => {
    if (animate) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
          className={cn(
            "relative overflow-hidden rounded-2xl",
            gradient && "gradient-border",
            glass && "glass",
            hover && "card-hover",
            className
          )}
        >
          <Box
            className={cn(
              "relative z-10 flex flex-col gap-6 rounded-2xl p-6",
              !glass &&
                "bg-gray-900/80 backdrop-blur-xl border border-gray-800/50",
              "shadow-xl"
            )}
          >
            {children}
          </Box>
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          gradient && "gradient-border",
          glass && "glass",
          hover && "card-hover",
          className
        )}
        {...props}
      >
        <Box
          className={cn(
            "relative z-10 flex flex-col gap-6 rounded-2xl p-6",
            !glass &&
              "bg-gray-900/80 backdrop-blur-xl border border-gray-800/50",
            "shadow-xl"
          )}
        >
          {children}
        </Box>
      </div>
    );
  }
);

ModernCard.displayName = "ModernCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      {children}
    </Box>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h3">
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardIcon = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        className={cn(
          "p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20",
          "border border-blue-500/20 backdrop-blur-xl",
          className
        )}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

CardIcon.displayName = "CardIcon";

export { ModernCard as Card, CardHeader, CardTitle, CardIcon };
