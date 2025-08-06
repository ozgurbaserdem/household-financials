import { AlertTriangle } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";

interface DisclaimerSectionProps {
  title: string;
  text: string;
}

export const DisclaimerSection: React.FC<DisclaimerSectionProps> = ({
  title,
  text,
}) => (
  <section aria-labelledby="disclaimer-section">
    <Card variant="elevated">
      <SectionHeader
        className="mb-2"
        headerId="disclaimer-section"
        icon={AlertTriangle}
        title={title}
        variant="card"
      />
      <CardContent>
        <Text className="text-muted-foreground leading-relaxed">{text}</Text>
      </CardContent>
    </Card>
  </section>
);
