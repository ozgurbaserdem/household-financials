import { useEffect, useRef } from "react";

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

export const useFocusManagement = () => {
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
