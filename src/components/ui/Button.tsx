"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/utils/general";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-gray-500/80 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 rounded-full focus-visible:ring-primary transition-all duration-200 dark:hover:bg-white/10",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 hover:-translate-y-0.5 rounded-full focus-visible:ring-destructive",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted hover:border-foreground rounded-full focus-visible:ring-foreground",
        secondary:
          "bg-transparent border rounded-full focus-visible:ring-offset-1 transition-all duration-200 text-foreground border-gray-300/70 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-foreground dark:text-white dark:border-white/20 dark:hover:bg-white/10 dark:hover:border-white/30 dark:focus-visible:ring-white/20",
        ghost:
          "text-foreground hover:bg-muted rounded-md focus-visible:ring-foreground",
        link: "text-foreground underline-offset-4 hover:underline focus-visible:ring-foreground",
        success:
          "bg-success text-success-foreground hover:opacity-90 hover:-translate-y-0.5 rounded-full focus-visible:ring-success",
        warning:
          "bg-warning text-warning-foreground hover:opacity-90 hover:-translate-y-0.5 rounded-full focus-visible:ring-warning",
        gradient:
          "bg-gradient-to-r from-gray-200 to-white text-gray-900 hover:from-gray-300 hover:to-gray-100 hover:-translate-y-0.5 rounded-full shadow-sm hover:shadow-md focus-visible:ring-white/20 transition-all duration-200 border border-gray-300/60 dark:from-gray-700 dark:to-gray-500 dark:text-white dark:hover:from-gray-800 dark:hover:to-gray-600 dark:border-gray-600/60 dark:focus-visible:ring-gray-400/30",
        "budgetkollen-selection":
          "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-full transition-all duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/30",
        "budgetkollen-selection-active":
          "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500 rounded-full transition-all duration-200 font-semibold dark:bg-yellow-400/10 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400/20",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        "budgetkollen-selection": "h-14 px-8 py-4 text-base min-w-[160px]",
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
