"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/utils/general";

import { Box } from "./Box";

const cardVariants = cva("flex flex-col gap-4 transition-all duration-200", {
  variants: {
    variant: {
      default: "card-base",
      elevated: "card-base shadow-sm",
      interactive: "card-base card-interactive",
    },
    padding: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      none: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

const Card = ({ className, variant, padding, ...props }: CardProps) => {
  return (
    <Box
      className={cn(cardVariants({ variant, padding }), className)}
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

const cardTitleVariants = cva("leading-tight font-semibold text-foreground", {
  variants: {
    size: {
      sm: "text-lg",
      default: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface CardTitleProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = ({ className, size, ...props }: CardTitleProps) => {
  return (
    <Box
      className={cn(cardTitleVariants({ size }), className)}
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
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
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
  "flex items-center justify-center rounded-lg border border-border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary text-primary-foreground border-primary",
        success: "bg-success text-success-foreground border-success",
        warning: "bg-warning text-warning-foreground border-warning",
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
