import React, { useEffect, useState, useCallback, useMemo } from "react";

interface AnimatedScrambleProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
  threshold?: number; // Minimum change required to trigger animation
  smoothMode?: boolean; // For real-time updates with smooth transitions
  maxDuration?: number; // Maximum animation duration to prevent long animations
}

export function AnimatedScramble({
  value,
  duration = 0.8,
  className = "",
  format,
  threshold = 100, // Default threshold: animate if change is > 100 (works well for currency values)
  smoothMode = false, // Enable for real-time smooth updates
  maxDuration = 0.3, // Maximum animation duration for smooth mode
}: AnimatedScrambleProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [done, setDone] = useState(true);
  const [lastAnimatedValue, setLastAnimatedValue] = useState(value);

  const formattedTarget = useMemo(
    () => (format ? format(value) : String(value)),
    [value, format]
  );

  const width = formattedTarget.length;

  const animate = useCallback(() => {
    const change = Math.abs(value - lastAnimatedValue);

    // In smooth mode, use adaptive duration based on change magnitude
    if (smoothMode) {
      const changePercent = Math.abs(
        (value - displayValue) /
          Math.max(Math.abs(value), Math.abs(displayValue), 1)
      );

      // Adaptive duration: smaller for small changes, capped at maxDuration
      let adaptiveDuration;
      if (changePercent < 0.1) {
        adaptiveDuration = 0.1; // Very small changes: 100ms
      } else if (changePercent < 0.5) {
        adaptiveDuration = 0.2; // Medium changes: 200ms
      } else {
        adaptiveDuration = Math.min(maxDuration, 0.4); // Large changes: max 400ms
      }

      const start = Date.now();
      const startValue = displayValue;
      setDone(false);
      setLastAnimatedValue(value);

      const updateValue = () => {
        const elapsedTime = (Date.now() - start) / 1000;
        const progress = Math.min(elapsedTime / adaptiveDuration, 1);
        // Fast ease-out for snappy feel
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const newValue = startValue + (value - startValue) * easedProgress;

        setDisplayValue(newValue);

        if (progress >= 1) {
          setDisplayValue(value);
          setDone(true);
        } else {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
      return;
    }

    // Original behavior for non-smooth mode
    // Only animate if the change exceeds the threshold
    if (change < threshold) {
      setDisplayValue(value);
      setDone(true);
      return;
    }

    const start = Date.now();
    const startValue = displayValue;
    setDone(false);
    setLastAnimatedValue(value);

    const updateValue = () => {
      const elapsedTime = (Date.now() - start) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + (value - startValue) * easedProgress;

      setDisplayValue(newValue);

      if (progress >= 1) {
        setDisplayValue(value);
        setDone(true);
      } else {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [
    value,
    duration,
    threshold,
    lastAnimatedValue,
    displayValue,
    smoothMode,
    maxDuration,
  ]);

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
