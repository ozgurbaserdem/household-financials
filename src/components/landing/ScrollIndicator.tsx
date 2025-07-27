import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface ScrollIndicatorProps {
  isVisible: boolean;
  text: string;
  onScroll: () => void;
}

export const ScrollIndicator = ({
  isVisible,
  text,
  onScroll,
}: ScrollIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
      onClick={onScroll}
    >
      <div className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors group">
        <span className="text-sm mb-2 font-medium">{text}</span>
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
