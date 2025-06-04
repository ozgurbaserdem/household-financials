import { useEffect, useState } from "react";

function useIsTouchDevice() {
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
}

export { useIsTouchDevice };
