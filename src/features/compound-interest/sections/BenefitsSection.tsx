import { Target } from "lucide-react";
import React, { useMemo } from "react";

import { BenefitCard } from "@/components/ui/BenefitCard";
import { Card, CardContent } from "@/components/ui/Card";
import { ResultRow } from "@/components/ui/ResultRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import {
  EXAMPLE_FINANCIAL_DATA,
  formatCurrency,
} from "@/lib/calculations/compound-interest-utilities";

import { BENEFIT_ICONS } from "./constants";

interface BenefitsSectionProps {
  title: string;
  description: string;
  realExampleTitle: string;
  scenarioTitle: string;
  resultTitle: string;
  monthlyLabel: string;
  yearsLabel: string;
  returnLabel: string;
  investedLabel: string;
  growthLabel: string;
  totalLabel: string;
  t: (key: string) => string; // Translation function
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  title,
  description,
  realExampleTitle,
  scenarioTitle,
  resultTitle,
  monthlyLabel,
  yearsLabel,
  returnLabel,
  investedLabel,
  growthLabel,
  totalLabel,
  t,
}) => {
  const benefits = useMemo(
    () =>
      BENEFIT_ICONS.map((icon, index) => ({
        icon,
        title: t(`benefits_section.benefit${index + 1}.title`),
        description: t(`benefits_section.benefit${index + 1}.description`),
      })),
    [t]
  );

  const formattedAmounts = useMemo(
    () => ({
      invested: formatCurrency(EXAMPLE_FINANCIAL_DATA.invested),
      growth: formatCurrency(EXAMPLE_FINANCIAL_DATA.growth),
      total: formatCurrency(EXAMPLE_FINANCIAL_DATA.total),
    }),
    []
  );

  return (
    <section aria-labelledby="benefits-section">
      <Card variant="elevated">
        <SectionHeader
          className="mb-2"
          headerId="benefits-section"
          icon={Target}
          title={title}
          variant="card"
        />
        <CardContent className="space-y-6">
          <Text className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <BenefitCard
                key={`benefit-${benefit.title}`}
                description={benefit.description}
                icon={benefit.icon}
                title={benefit.title}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {realExampleTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {scenarioTitle}
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {monthlyLabel}</li>
                  <li>• {yearsLabel}</li>
                  <li>• {returnLabel}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {resultTitle}
                </h4>
                <div className="space-y-2">
                  <ResultRow
                    label={investedLabel}
                    value={formattedAmounts.invested}
                  />
                  <ResultRow
                    isHighlighted
                    label={growthLabel}
                    value={formattedAmounts.growth}
                  />
                  <ResultRow
                    isTotal
                    label={totalLabel}
                    value={formattedAmounts.total}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
