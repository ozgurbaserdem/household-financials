import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
  colorClass?: string;
}

export const StepCard = ({
  icon: Icon,
  title,
  description,
  stepNumber,
  colorClass = "text-golden",
}: StepCardProps) => {
  const t = useTranslations("landing");

  return (
    <div
      aria-label={t("accessibility.step_description", {
        stepNumber,
        stepTitle: title,
      })}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex items-center justify-center mb-4 relative">
        <Icon className={`w-8 h-8 ${colorClass}`} />
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 flex items-center justify-center"
        >
          <span className="text-xs font-bold text-gradient-golden">
            {stepNumber}
          </span>
        </div>
      </div>
      <h3 className="heading-3 text-foreground mb-2 text-lg">{title}</h3>
      <p className="body-base text-muted-foreground">{description}</p>
    </div>
  );
};
