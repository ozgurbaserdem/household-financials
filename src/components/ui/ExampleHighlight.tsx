import { Check, type LucideIcon } from "lucide-react";
import React from "react";

import { Text } from "./Text";

interface ExampleHighlightProps {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export const ExampleHighlight: React.FC<ExampleHighlightProps> = ({
  icon: Icon = Check,
  title,
  description,
}) => (
  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-[rgb(var(--border))] mt-4">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <Text className="text-muted-foreground leading-relaxed">{description}</Text>
  </div>
);
