import { useState, useCallback, useRef, useEffect } from "react";

interface UseCarouselNavigationProps {
  itemsCount: number;
}

export const useCarouselNavigation = ({
  itemsCount,
}: UseCarouselNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchPosition = useRef({ start: 0, end: 0 });

  const handleSlideTransition = useCallback(
    (newIndex: number) => {
      if (isTransitioning || newIndex < 0 || newIndex >= itemsCount) return;
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, itemsCount]
  );

  const nextSlide = useCallback(() => {
    if (currentIndex >= itemsCount - 1) return;
    handleSlideTransition(currentIndex + 1);
  }, [currentIndex, itemsCount, handleSlideTransition]);

  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) return;
    handleSlideTransition(currentIndex - 1);
  }, [currentIndex, handleSlideTransition]);

  const goToSlide = useCallback(
    (index: number) => {
      handleSlideTransition(index);
    },
    [handleSlideTransition]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  const handleWheel = useCallback(
    (
      event: WheelEvent,
      containerReference: React.RefObject<HTMLElement | HTMLDivElement | null>
    ) => {
      if (!containerReference.current?.contains(event.target as Node)) return;

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        if (event.deltaX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    },
    [nextSlide, prevSlide]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches.length === 0) return;
    touchPosition.current.start = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches.length === 0) return;
    touchPosition.current.end = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchPosition.current.start || !touchPosition.current.end) return;

    const distance = touchPosition.current.start - touchPosition.current.end;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchPosition.current.start = 0;
    touchPosition.current.end = 0;
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    currentIndex,
    isTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
