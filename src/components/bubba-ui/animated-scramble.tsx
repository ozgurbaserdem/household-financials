import React, { useEffect, useState } from "react";
import { AnimatedNumber } from "./animated-number";

interface AnimatedScrambleProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

export function AnimatedScramble({
  value,
  duration = 0.8,
  className = "",
  format,
}: AnimatedScrambleProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [done, setDone] = useState(false);
  const width = Math.abs(value).toString().split(".")[0].length;

  useEffect(() => {
    const start = Date.now();
    setDone(false);
    setDisplayValue(0);

    const timer = setInterval(() => {
      const elapsedTime = (Date.now() - start) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(Math.abs(value) * easedProgress);

      setDisplayValue(newValue);

      if (progress >= 1) {
        clearInterval(timer);
        setDone(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  if (done && format) {
    return <span className={className}>{format(value)}</span>;
  }

  const paddedValue = String(displayValue).padStart(width, "0").split("");
  const sign = value < 0 ? "-" : "";

  return (
    <div className={`flex flex-row font-bold ${className}`}>
      {sign}
      {paddedValue.map((_, index) => (
        <AnimatedNumber
          key={index}
          place={Math.pow(10, width - index - 1)}
          value={displayValue}
        />
      ))}
    </div>
  );
}
