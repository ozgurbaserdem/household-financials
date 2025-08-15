import { BookOpen } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { EinsteinQuote } from "@/components/ui/EinsteinQuote";
import { ExampleHighlight } from "@/components/ui/ExampleHighlight";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";

interface WhatIsSectionProps {
  title: string;
  description: string;
  explanation: string;
  einsteinQuote: string;
  einsteinAttribution: string;
  einsteinImageAlt: string;
  exampleTitle: string;
  exampleDescription: string;
}

export const WhatIsSection: React.FC<WhatIsSectionProps> = ({
  title,
  description,
  explanation,
  einsteinQuote,
  einsteinAttribution,
  einsteinImageAlt,
  exampleTitle,
  exampleDescription,
}) => (
  <section aria-labelledby="what-is-compound-interest">
    <Card className="card-base" variant="elevated">
      <SectionHeader
        className="mb-2"
        headerId="what-is-compound-interest"
        icon={BookOpen}
        title={title}
        variant="card"
      />
      <CardContent className="space-y-6">
        <Text className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </Text>

        <EinsteinQuote
          attribution={einsteinAttribution}
          imageAlt={einsteinImageAlt}
          quote={einsteinQuote}
        />

        <Text className="text-muted-foreground leading-relaxed text-lg">
          {explanation}
        </Text>

        <ExampleHighlight
          description={exampleDescription}
          title={exampleTitle}
        />
      </CardContent>
    </Card>
  </section>
);
