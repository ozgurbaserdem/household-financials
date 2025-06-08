"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/general";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-400 dark:border-gray-600 dark:hover:bg-gray-800",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-600 dark:text-blue-400",
        // Primary gradient - main CTA buttons
        gradient:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus-visible:ring-purple-600",
        // Secondary gradient - less prominent actions
        gradientSecondary:
          "bg-gradient-to-r from-slate-600/90 to-slate-700/90 text-white hover:from-slate-700/95 hover:to-slate-800/95 border border-slate-500/30 shadow-sm hover:shadow-md focus-visible:ring-slate-600",
        // Success gradient - positive actions
        gradientSuccess:
          "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 focus-visible:ring-green-600",
        // Warning gradient - caution actions
        gradientWarning:
          "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 focus-visible:ring-amber-600",
        // Glass effect - modern transparent look
        glass:
          "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl focus-visible:ring-white/50",
        // Chip style - small tag-like buttons
        chip: "bg-gray-800/50 text-gray-200 border border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 rounded-full text-sm focus-visible:ring-gray-500",
        chipActive:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent rounded-full text-sm focus-visible:ring-purple-600",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
