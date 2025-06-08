import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface StepDescriptionProps {
  stepKey: "income" | "loans" | "expenses" | "summary" | "results";
  className?: string;
}

export const StepDescription = ({
  stepKey,
  className,
}: StepDescriptionProps) => {
  const t = useTranslations("wizard.step_descriptions");

  return (
    <div
      className={`mb-4 p-3 glass rounded-lg border border-blue-500/20 ${className || ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex-shrink-0">
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <p className="text-sm text-gray-300 leading-relaxed flex-1">
          {t(`${stepKey}.description`)}
        </p>
      </div>
    </div>
  );
};
