import { useEffect, useRef } from "react";

/**
 * Hook that returns a ref and automatically focuses the element on mount.
 *
 * Useful for improving accessibility by automatically focusing important
 * elements when they appear (e.g., step headings, error messages).
 *
 * Includes a small delay to ensure DOM is ready and animations don't interfere.
 *
 * @returns Ref object to attach to the element that should receive focus
 *
 * @example
 * ```typescript
 * const headingRef = useFocusOnMount();
 *
 * return <h1 ref={headingRef} tabIndex={-1}>Step Title</h1>;
 * ```
 */
export const useFocusOnMount = () => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Small delay to ensure DOM is ready and animation doesn't interfere
      const timer = setTimeout(() => {
        ref.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return ref;
};

/**
 * Hook providing utilities for programmatic focus management.
 *
 * Returns helper functions for focusing elements with proper timing
 * and scroll behavior for optimal accessibility and user experience.
 *
 * @returns Object with focus utility functions
 *
 * @example
 * ```typescript
 * const { focusElement } = useFocusManagement();
 *
 * const handleNext = () => {
 *   // Move to next step and focus the heading
 *   const nextHeading = document.querySelector('h1');
 *   focusElement(nextHeading);
 * };
 * ```
 */
export const useFocusManagement = () => {
  /**
   * Focuses an element with smooth scrolling and proper timing.
   *
   * @param element - The HTML element to focus (null-safe)
   */
  const focusElement = (element: HTMLElement | null) => {
    if (element) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        element.focus();
        // Ensure the element is scrolled into view
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return { focusElement };
};
