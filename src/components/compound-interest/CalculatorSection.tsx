import React, { lazy, Suspense } from "react";

const CompoundInterestClient = lazy(() =>
  import("@/features/compound-interest-calculator/CompoundInterestClient").then(
    (module) => ({ default: module.CompoundInterestClient })
  )
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
      <Suspense
        fallback={<div className="h-96 bg-muted rounded-lg animate-pulse" />}
      >
        <CompoundInterestClient />
      </Suspense>
    </div>
  </section>
);
