export const STYLES = {
  RESULT_CARD:
    "p-4 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]",
  ICON_CONTAINER: "p-2 rounded-lg icon-bg-golden",
  ICON: "w-6 h-6 text-golden",
  ICON_SMALL: "w-5 h-5 text-golden",
  PROGRESS_BAR: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1",
  PROGRESS_FILL: "h-full rounded-full",
  CURRENCY_DISPLAY:
    "text-lg lg:text-xl font-bold text-foreground leading-relaxed break-words whitespace-nowrap block",
  CURRENCY_DISPLAY_COLORED:
    "text-lg lg:text-xl font-semibold leading-relaxed break-words whitespace-nowrap block",
  LABEL_TEXT:
    "text-xs text-muted-foreground font-medium break-words hyphens-auto block",
  HIGHLIGHT_RING:
    "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg p-4 bg-primary/10",
} as const;

export const COLORS = {
  BLUE: "blue-500",
  GREEN: "green-500",
  PURPLE: "purple-500",
  RED: "red-500",
} as const;

export const HIGHLIGHT_TIMEOUT = 3000;
