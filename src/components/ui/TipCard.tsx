import React from "react";

import { Text } from "./Text";

interface TipCardProps {
  index: number;
  content: string;
}

export const TipCard: React.FC<TipCardProps> = ({ index, content }) => {
  return (
    <div className="relative p-6 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div
        aria-label={`Tip number ${index}`}
        className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800 flex items-center justify-center"
      >
        <span className="text-sm font-bold text-gradient-golden">{index}</span>
      </div>
      <Text className="text-muted-foreground text-sm leading-relaxed">
        {content}
      </Text>
    </div>
  );
};
