import { useEffect, useState } from "react";

/**
 * Hook to detect if the current device supports touch input.
 *
 * Detects touch capability using multiple methods:
 * - Checks for 'ontouchstart' event support
 * - Uses CSS media query for coarse pointer (touch devices)
 *
 * Handles SSR and test environments gracefully by returning false.
 * Re-evaluates on window resize to handle device orientation changes.
 *
 * @returns Boolean indicating if the device supports touch input
 *
 * @example
 * ```typescript
 * const isTouch = useIsTouchDevice();
 *
 * return (
 *   <Tooltip open={isTouch ? touchOpen : undefined}>
 *     // tooltip content
 *   </Tooltip>
 * );
 * ```
 */
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Skip in test environment or SSR
    if (typeof window === "undefined" || process.env.NODE_ENV === "test") {
      return;
    }

    const check = () => {
      setIsTouch(
        "ontouchstart" in window ||
          (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isTouch;
};

export { useIsTouchDevice };
