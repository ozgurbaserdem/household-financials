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
        // Light mode
        "border-gray-400 bg-white data-[state=checked]:bg-gray-300 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-400 hover:border-blue-500",
        // Dark mode
        "dark:border-gray-600 dark:bg-white-200 dark:data-[state=checked]:bg-gray-700 dark:data-[state=checked]:border-blue-400 dark:data-[state=unchecked]:bg-gray-900 dark:data-[state=unchecked]:border-gray-600 dark:hover:border-blue-400",
        // Shared
        "peer inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border shadow-sm transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex h-full w-full items-center justify-center text-black dark:text-white"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox };
