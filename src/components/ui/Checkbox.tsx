"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/utils/general";

const Checkbox = ({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        // Base styles
        "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--background))] disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked state
        "border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:border-[rgb(var(--foreground))]",
        // Checked state - golden gradient with explicit styles
        "data-[state=checked]:border-[#d4af37] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#d4af37] data-[state=checked]:via-[#f4e07b] data-[state=checked]:to-[#b8941f]",
        // Dark mode checked state
        "dark:data-[state=checked]:border-[#d4af37] dark:data-[state=checked]:from-[#d4af37] dark:data-[state=checked]:via-[#b8941f] dark:data-[state=checked]:to-[#8b6914]",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex h-full w-full items-center justify-center text-white drop-shadow-sm"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="h-3.5 w-3.5 stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox };
