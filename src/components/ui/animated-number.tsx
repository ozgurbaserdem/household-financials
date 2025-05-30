import React from "react";

interface AnimatedNumberProps {
  place: number;
  value: number;
}

export function AnimatedNumber({ place, value }: AnimatedNumberProps) {
  const digit = Math.floor((value / place) % 10);

  return <span className="inline-block w-[1ch] text-center">{digit}</span>;
}
