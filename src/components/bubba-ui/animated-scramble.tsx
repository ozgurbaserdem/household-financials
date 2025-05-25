import React, { useEffect, useState } from "react";

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

  // Use formatted string for width (number of characters)
  const formattedTarget = format ? format(value) : String(value);
  const width = formattedTarget.length;

  useEffect(() => {
    const start = Date.now();
    setDone(false);
    setDisplayValue(0);

    const timer = setInterval(() => {
      const elapsedTime = (Date.now() - start) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = value * easedProgress;
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

  // Format the intermediate value and pad/truncate to match the target width
  const formattedDisplay = format ? format(displayValue) : String(displayValue);
  // Pad with spaces or zeros to match the width of the final formatted value
  const paddedDisplay = formattedDisplay.padStart(width, " ").slice(-width);

  return (
    <span className={`inline-flex font-bold ${className}`}>
      {paddedDisplay.split("").map((char, idx) => (
        <span key={idx}>{char}</span>
      ))}
    </span>
  );
}
