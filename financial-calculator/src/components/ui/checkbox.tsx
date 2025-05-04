"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-gray-400 bg-white shadow-sm transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-400 hover:border-primary/50 dark:border-gray-600 dark:bg-gray-800 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary dark:data-[state=unchecked]:bg-gray-800 dark:data-[state=unchecked]:border-gray-600",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex h-full w-full items-center justify-center text-white dark:text-primary-foreground"
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }