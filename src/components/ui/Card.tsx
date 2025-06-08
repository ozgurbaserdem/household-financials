"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/general";

import { Box } from "./Box";

const cardVariants = cva(
  "flex flex-col gap-6 rounded-xl shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800",
        glass: "glass backdrop-blur-xl",
        modern:
          "bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 shadow-xl",
        gradient: "gradient-border bg-gray-900/95",
        elevated:
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl",
      },
      padding: {
        default: "p-4 md:p-4",
        sm: "p-3 md:p-4",
        lg: "p-6 md:p-8",
        none: "p-0",
      },
      hover: {
        none: "",
        lift: "hover-lift",
        scale: "hover:scale-[1.02] transition-transform duration-200",
        glow: "hover:shadow-2xl hover:shadow-blue-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      hover: "none",
    },
  }
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

const Card = ({ className, variant, padding, hover, ...props }: CardProps) => {
  return (
    <Box
      className={cn(cardVariants({ variant, padding, hover }), className)}
      data-slot="card"
      {...props}
    />
  );
};

const cardHeaderVariants = cva("@container/card-header", {
  variants: {
    layout: {
      default: "flex items-center gap-4",
      grid: "grid grid-cols-2 gap-4",
      vertical: "flex flex-col gap-2",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

interface CardHeaderProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = ({ className, layout, ...props }: CardHeaderProps) => {
  return (
    <Box
      className={cn(cardHeaderVariants({ layout }), className)}
      data-slot="card-header"
      {...props}
    />
  );
};

const cardTitleVariants = cva("leading-none font-semibold", {
  variants: {
    size: {
      sm: "text-lg",
      default: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
    gradient: {
      none: "",
      primary:
        "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
      blue: "bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent",
      purple:
        "bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent",
      success:
        "bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "default",
    gradient: "none",
  },
});

interface CardTitleProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = ({ className, size, gradient, ...props }: CardTitleProps) => {
  return (
    <Box
      className={cn(cardTitleVariants({ size, gradient }), className)}
      data-slot="card-title"
      {...props}
    />
  );
};

const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <Box
      className={cn(
        "text-muted-foreground dark:text-gray-400 text-sm leading-relaxed",
        className
      )}
      data-slot="card-description"
      {...props}
    />
  );
};

const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <Box
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <Box className={cn("", className)} data-slot="card-content" {...props} />
  );
};

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <Box
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      data-slot="card-footer"
      {...props}
    />
  );
};

const cardIconVariants = cva(
  "flex items-center justify-center rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-gray-800",
        gradient:
          "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 backdrop-blur-xl",
        success:
          "bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/20",
        warning:
          "bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/20",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20",
      },
      size: {
        sm: "p-2 w-8 h-8",
        default: "p-3 w-12 h-12",
        lg: "p-4 w-16 h-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface CardIconProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardIconVariants> {}

const CardIcon = ({ className, variant, size, ...props }: CardIconProps) => {
  return (
    <Box
      className={cn(cardIconVariants({ variant, size }), className)}
      data-slot="card-icon"
      {...props}
    />
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardIcon,
  cardVariants,
  cardTitleVariants,
  cardHeaderVariants,
  cardIconVariants,
};
