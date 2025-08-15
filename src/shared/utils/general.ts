import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining and merging CSS class names intelligently.
 *
 * Combines clsx for conditional class names with tailwind-merge for
 * intelligent Tailwind CSS class deduplication and conflict resolution.
 * This prevents style conflicts when multiple utility classes target
 * the same CSS properties.
 *
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged and deduplicated class name string
 *
 * @example
 * ```typescript
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })
 * // Returns: "px-4 py-2 bg-blue-500 text-white"
 *
 * cn('p-4', 'px-6')
 * // Returns: "p-4 px-6" (tailwind-merge resolves padding conflicts)
 *
 * cn('bg-red-500', condition && 'bg-blue-500')
 * // Conditionally applies classes while resolving conflicts
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
