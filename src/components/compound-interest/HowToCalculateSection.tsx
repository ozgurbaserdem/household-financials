import { Calculator } from "lucide-react";
import React, { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepCard } from "@/components/ui/StepCard";
import { Text } from "@/components/ui/Text";
import { generateStepData } from "@/lib/compound-interest-utilities";

interface HowToCalculateSectionProps {
  title: string;
  description: string;
  formulaTitle: string;
  formulaText: string;
  formulaExplanation: string;
  t: (key: string) => string; // Translation function
}

export const HowToCalculateSection: React.FC<HowToCalculateSectionProps> = ({
  title,
  description,
  formulaTitle,
  formulaText,
  formulaExplanation,
  t,
}) => {
  const stepData = useMemo(() => generateStepData(t), [t]);

  return (
    <section aria-labelledby="how-to-calculate">
      <Card variant="elevated">
        <SectionHeader
          className="mb-2"
          headerId="how-to-calculate"
          icon={Calculator}
          title={title}
          variant="card"
        />
        <CardContent className="space-y-6">
          <Text className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {stepData.map((step) => (
              <StepCard
                key={step.stepNumber}
                description={step.description}
                stepNumber={step.stepNumber}
                title={step.title}
              />
            ))}
          </div>

          <div className="bg-primary/10 rounded-lg px-6 mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {formulaTitle}
            </h3>
            <div className="font-mono bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-[rgb(var(--border))] mt-4">
              {formulaText}
            </div>
            <Text className="text-sm text-muted-foreground mt-2">
              {formulaExplanation}
            </Text>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
