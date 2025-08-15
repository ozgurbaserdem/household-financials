"use client";

import { useTranslations } from "next-intl";
import React, { useCallback } from "react";

interface Preview {
  id: string;
  title: string;
}

interface ProgressIndicatorsProps {
  previews: Preview[];
  currentIndex: number;
  isTransitioning: boolean;
  onGoToSlide: (index: number) => void;
}

export const ProgressIndicators = ({
  previews,
  currentIndex,
  isTransitioning,
  onGoToSlide,
}: ProgressIndicatorsProps) => {
  const t = useTranslations("landing");

  const handleProgressClick = useCallback(
    (index: number) => {
      if (!isTransitioning) {
        onGoToSlide(index);
      }
    },
    [isTransitioning, onGoToSlide]
  );

  return (
    <div className="flex justify-center gap-2 mt-6">
      {previews.map((preview, index) => (
        <button
          key={preview.id}
          aria-label={t("previews.go_to_slide", {
            number: index + 1,
            title: preview.title,
          })}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            index === currentIndex
              ? "bg-gradient-golden"
              : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
          }`}
          disabled={isTransitioning}
          onClick={() => handleProgressClick(index)}
        />
      ))}
    </div>
  );
};
