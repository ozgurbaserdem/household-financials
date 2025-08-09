"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { NavigationButton } from "@/components/ui/NavigationButton";

interface CarouselNavigationProps {
  currentIndex: number;
  totalItems: number;
  isTransitioning: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const CarouselNavigation = ({
  currentIndex,
  totalItems,
  isTransitioning,
  onPrev,
  onNext,
}: CarouselNavigationProps) => {
  const t = useTranslations("landing");

  return (
    <div className="flex justify-center gap-4 mt-8">
      <NavigationButton
        ariaLabel={t("previews.navigation_previous")}
        direction="prev"
        disabled={isTransitioning || currentIndex <= 0}
        onClick={onPrev}
      />
      <NavigationButton
        ariaLabel={t("previews.navigation_next")}
        direction="next"
        disabled={isTransitioning || currentIndex >= totalItems - 1}
        onClick={onNext}
      />
    </div>
  );
};
