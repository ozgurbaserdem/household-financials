"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { useState, useEffect, useMemo, useRef } from "react";

import { CarouselNavigation } from "@/components/landing/CarouselNavigation";
import { ImageModal } from "@/components/landing/ImageModal";
import { PreviewCard } from "@/components/landing/PreviewCard";
import { ProgressIndicators } from "@/components/landing/ProgressIndicators";
import { useCarouselNavigation } from "@/hooks/useCarouselNavigation";

interface Preview {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export const CalculatorPreviews = () => {
  const t = useTranslations("landing");
  const { resolvedTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string | null>(
    null
  );
  const [mounted, setMounted] = useState(false);
  const carouselReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const previews: Preview[] = useMemo(() => {
    const getImageSource = (baseId: string) => {
      if (!mounted) return `/screenshots/${baseId}-light.png`;
      const theme = resolvedTheme === "dark" ? "dark" : "light";
      return `/screenshots/${baseId}-${theme}.png`;
    };

    return [
      {
        id: "budget-wizard",
        src: getImageSource("budget-wizard"),
        alt: t("previews.budget_wizard_alt"),
        title: t("previews.budget_wizard_title"),
        description: t("previews.budget_wizard_description"),
      },
      {
        id: "budget-results",
        src: getImageSource("budget-results"),
        alt: t("previews.budget_results_alt"),
        title: t("previews.budget_results_title"),
        description: t("previews.budget_results_description"),
      },
      {
        id: "compound-interest",
        src: getImageSource("compound-interest"),
        alt: t("previews.compound_interest_alt"),
        title: t("previews.compound_interest_title"),
        description: t("previews.compound_interest_description"),
      },
    ];
  }, [mounted, resolvedTheme, t]);

  const {
    currentIndex,
    isTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCarouselNavigation({ itemsCount: previews.length });

  const handleImageClick = (src: string, title: string) => {
    setSelectedImage(src);
    setSelectedImageTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedImageTitle(null);
  };

  useEffect(() => {
    const wheelHandler = (event: Event) => {
      const wheelEvent = event as WheelEvent;
      handleWheel(wheelEvent, carouselReference);
    };

    document.addEventListener("wheel", wheelHandler);

    return () => {
      document.removeEventListener("wheel", wheelHandler);
    };
  }, [handleWheel]);

  return (
    <motion.section
      className="py-24"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="heading-2 text-gradient-subtle mb-6">
          {t("previews.title")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("previews.subtitle")}
        </p>
      </motion.div>

      {/* Calculator Preview Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={carouselReference}
          className="relative overflow-hidden"
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center justify-center">
            {/* Previous card peek */}
            {currentIndex > 0 && previews[currentIndex - 1] && (
              <div className="hidden lg:block w-48 flex-shrink-0 opacity-25 hover:opacity-60 transition-opacity duration-200 overflow-hidden">
                <PreviewCard
                  isPeek
                  ariaLabel={t("previews.go_to_slide", {
                    number: currentIndex,
                    title: previews[currentIndex - 1].title,
                  })}
                  className="translate-x-24"
                  preview={previews[currentIndex - 1]}
                  onClick={prevSlide}
                />
              </div>
            )}

            {/* Current card */}
            <div className="flex-1 lg:w-[896px] lg:min-w-[896px] lg:max-w-[896px] lg:flex-shrink-0 max-w-5xl z-10 relative">
              {previews[currentIndex] && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full"
                    exit={{ opacity: 0, x: -100 }}
                    initial={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <PreviewCard
                      preview={previews[currentIndex]}
                      onImageClick={(src) =>
                        handleImageClick(src, previews[currentIndex].title)
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Next card peek */}
            {currentIndex < previews.length - 1 &&
              previews[currentIndex + 1] && (
                <div className="hidden lg:block w-48 flex-shrink-0 opacity-25 hover:opacity-60 transition-opacity duration-200 overflow-hidden">
                  <PreviewCard
                    isPeek
                    ariaLabel={t("previews.go_to_slide", {
                      number: currentIndex + 2,
                      title: previews[currentIndex + 1].title,
                    })}
                    className="-translate-x-24"
                    preview={previews[currentIndex + 1]}
                    onClick={nextSlide}
                  />
                </div>
              )}
          </div>
        </div>

        <CarouselNavigation
          currentIndex={currentIndex}
          isTransitioning={isTransitioning}
          totalItems={previews.length}
          onNext={nextSlide}
          onPrev={prevSlide}
        />

        <ProgressIndicators
          currentIndex={currentIndex}
          isTransitioning={isTransitioning}
          previews={previews}
          onGoToSlide={goToSlide}
        />
      </div>

      <ImageModal
        imageSrc={selectedImage}
        imageTitle={selectedImageTitle || undefined}
        isOpen={!!selectedImage}
        onClose={handleCloseModal}
      />
    </motion.section>
  );
};
