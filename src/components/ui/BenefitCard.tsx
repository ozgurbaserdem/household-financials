import type { LucideIcon } from "lucide-react";
import React from "react";

import { Text } from "./Text";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <Text className="text-muted-foreground">{description}</Text>
  </div>
);
