"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/general";

const Checkbox = ({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        // Light mode - black/white theme
        "border-[rgb(var(--border))] bg-[rgb(var(--background))] data-[state=checked]:bg-[rgb(var(--foreground))] data-[state=checked]:border-[rgb(var(--foreground))] data-[state=unchecked]:bg-[rgb(var(--background))] data-[state=unchecked]:border-[rgb(var(--border))] hover:border-[rgb(var(--foreground))]",
        // Dark mode - inverted black/white theme
        "dark:border-[rgb(var(--border))] dark:bg-[rgb(var(--background))] dark:data-[state=checked]:bg-[rgb(var(--foreground))] dark:data-[state=checked]:border-[rgb(var(--foreground))] dark:data-[state=unchecked]:bg-[rgb(var(--background))] dark:data-[state=unchecked]:border-[rgb(var(--border))] dark:hover:border-[rgb(var(--foreground))]",
        // Shared
        "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--foreground))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--background))] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex h-full w-full items-center justify-center text-[rgb(var(--background))]"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="h-3.5 w-3.5 stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox };
