import React, { useEffect, useState, useCallback, useMemo } from "react";

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

  const formattedTarget = useMemo(
    () => (format ? format(value) : String(value)),
    [value, format]
  );

  const width = formattedTarget.length;

  const animate = useCallback(() => {
    const start = Date.now();
    setDone(false);
    setDisplayValue(0);

    const updateValue = () => {
      const elapsedTime = (Date.now() - start) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = value * easedProgress;

      setDisplayValue(newValue);

      if (progress >= 1) {
        setDone(true);
      } else {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration]);

  useEffect(() => {
    animate();
  }, [animate]);

  if (done && format) {
    return <span className={className}>{format(value)}</span>;
  }

  const formattedDisplay = format
    ? format(displayValue)
    : String(Math.floor(displayValue));
  const paddedDisplay = formattedDisplay.padStart(width, " ").slice(-width);

  return (
    <span className={`inline-flex font-bold ${className}`}>
      {paddedDisplay.split("").map((char, idx) => (
        <span key={idx}>{char}</span>
      ))}
    </span>
  );
}
