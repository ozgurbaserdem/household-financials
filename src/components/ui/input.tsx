import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Light mode
        "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
        // Dark mode
        "dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500",
        // Shared
        "file:text-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Focus
        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-900/40",
        // Invalid
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // No spinner for number inputs
        type === 'number' ? 'no-spinner' : '',
        className
      )}
      {...props}
    />
  )
}

export { Input }
