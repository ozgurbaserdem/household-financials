import dynamic from "next/dynamic";
import React from "react";

const CompoundInterestCalculator = dynamic(
  () =>
    import(
      "@/features/compound-interest/calculator/CompoundInterestCalculator"
    ).then((module) => ({ default: module.CompoundInterestCalculator })),
  {
    ssr: true, // Enable SSR for better SEO
  }
);

interface CalculatorSectionProps {
  title: string;
  description: string;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  title,
  description,
}) => (
  <section aria-labelledby="calculator-section">
    <div className="space-y-4">
      <div className="text-center">
        <h2
          className="text-3xl font-bold text-foreground mb-2"
          id="calculator-section"
        >
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <CompoundInterestCalculator />
    </div>
  </section>
);
