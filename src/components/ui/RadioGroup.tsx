"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/general";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Base styles
        "aspect-square h-4 w-4 rounded-full border transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked state
        "border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:border-[rgb(var(--foreground))]",
        // Checked state - golden gradient
        "data-[state=checked]:border-[#d4af37] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#d4af37] data-[state=checked]:via-[#f4e07b] data-[state=checked]:to-[#b8941f]",
        // Dark mode checked state
        "dark:data-[state=checked]:border-[#d4af37] dark:data-[state=checked]:from-[#d4af37] dark:data-[state=checked]:via-[#b8941f] dark:data-[state=checked]:to-[#8b6914]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-white drop-shadow-sm" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
