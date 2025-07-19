import { cn } from "@/lib/utils/general";

interface CurrencyDisplayProps {
  amount: number;
  variant?:
    | "default"
    | "positive"
    | "negative"
    | "neutral"
    | "success"
    | "warning"
    | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  showDecimals?: boolean;
  locale?: string;
  currency?: string;
  className?: string;
  "data-testid"?: string;
}

const formatCurrencyDisplay = (
  amount: number,
  showDecimals: boolean = true,
  locale: string = "sv-SE",
  currency: string = "SEK"
): string => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  // Replace regular space with non-breaking space before currency symbol for Swedish
  if (locale === "sv-SE") {
    return formatted.replace(/\s+kr$/, "\u00A0kr");
  }

  return formatted;
};

const CurrencyDisplay = ({
  amount,
  variant = "default",
  size = "md",
  showDecimals = false,
  locale = "sv-SE",
  currency = "SEK",
  className,
  ...props
}: CurrencyDisplayProps) => {
  const variantClasses = {
    default: "text-gray-900 dark:text-gray-100",
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "", // Empty string so className can override
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const getInlineStyle = () => {
    switch (variant) {
      case "success":
        return { color: "rgb(34 197 94)" };
      case "warning":
        return { color: "rgb(234 179 8)" };
      case "destructive":
        return { color: "rgb(239 68 68)" };
      default:
        return undefined;
    }
  };

  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        variant === "success" ||
          variant === "warning" ||
          variant === "destructive"
          ? ""
          : variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={getInlineStyle()}
      {...props}
    >
      {formatCurrencyDisplay(amount, showDecimals, locale, currency)}
    </span>
  );
};

export { CurrencyDisplay, formatCurrencyDisplay };
