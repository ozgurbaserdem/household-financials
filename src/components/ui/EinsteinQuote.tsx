import Image from "next/image";
import React from "react";

import { Text } from "./Text";

interface EinsteinQuoteProps {
  quote: string;
  attribution: string;
  imageAlt: string;
}

export const EinsteinQuote: React.FC<EinsteinQuoteProps> = ({
  quote,
  attribution,
  imageAlt,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start py-6 px-4 mb-2">
      <div className="flex justify-center md:justify-start order-2 md:order-1">
        <Image
          priority
          alt={imageAlt}
          className="rounded-full object-cover grayscale opacity-70 flex-shrink-0 ring-2 ring-border"
          height={80}
          src="/einstein-optimized.png"
          width={80}
        />
      </div>

      <div className="relative order-1 md:order-2">
        <div
          aria-hidden="true"
          className="text-6xl text-muted-foreground/30 font-serif absolute -top-4 -left-2"
        >
          &ldquo;
        </div>
        <Text className="text-muted-foreground italic text-lg leading-relaxed pl-8 pt-2">
          {quote}
        </Text>
        <div
          aria-hidden="true"
          className="text-6xl text-muted-foreground/30 font-serif absolute -bottom-6 right-0"
        >
          &rdquo;
        </div>
        <Text className="text-muted-foreground text-sm mt-4 pl-8">
          — {attribution}
        </Text>
      </div>
    </div>
  );
};
