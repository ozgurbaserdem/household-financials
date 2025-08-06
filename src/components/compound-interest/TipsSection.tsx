import { Lightbulb } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { TipCard } from "@/components/ui/TipCard";

interface TipsSectionProps {
  title: string;
  description: string;
  tips: Array<{
    key: string;
    content: string;
    translationKey: string;
  }>;
}

export const TipsSection: React.FC<TipsSectionProps> = ({
  title,
  description,
  tips,
}) => (
  <section aria-labelledby="tips-section">
    <Card padding="none" variant="elevated">
      <div className="p-6">
        <SectionHeader
          headerId="tips-section"
          icon={Lightbulb}
          title={title}
          variant="card"
        />
      </div>
      <CardContent className="space-y-6 px-6 pb-6">
        <Text className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {tips.map((tip, tipIndex) => (
            <TipCard key={tip.key} content={tip.content} index={tipIndex + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  </section>
);
