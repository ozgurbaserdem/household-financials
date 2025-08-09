import { useCallback } from "react";

export const useKeyboardHandler = (callback: () => void) => {
  return useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    },
    [callback]
  );
};
