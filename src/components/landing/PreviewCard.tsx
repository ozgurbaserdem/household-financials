"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { useKeyboardHandler } from "@/hooks/useKeyboardHandler";

interface Preview {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface PreviewCardProps {
  preview: Preview;
  isPeek?: boolean;
  onClick?: () => void;
  onImageClick?: (src: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const PreviewCard = ({
  preview,
  isPeek = false,
  onClick,
  onImageClick,
  className = "",
  ariaLabel,
}: PreviewCardProps) => {
  const t = useTranslations("landing");
  const handleClick = useKeyboardHandler(onClick || (() => {}));
  const handleImageClick = useKeyboardHandler(() =>
    onImageClick?.(preview.src)
  );

  if (isPeek) {
    return (
      <div
        aria-label={ariaLabel}
        className={`transform ${className} cursor-pointer`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleClick}
      >
        <Card
          className="overflow-hidden flex flex-col h-[580px] hover:shadow-lg transition-shadow duration-200"
          variant="elevated"
        >
          <Box className="py-6 px-0 space-y-3 flex-shrink-0 h-[140px]">
            <h3 className="text-xl font-semibold text-foreground line-clamp-2 leading-tight">
              {preview.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {preview.description}
            </p>
          </Box>
          <Box className="relative overflow-hidden bg-background flex-1">
            <Image
              fill
              alt={preview.alt}
              className="object-cover object-center"
              quality={75}
              sizes="400px"
              src={preview.src}
            />
          </Box>
        </Card>
      </div>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer flex flex-col lg:h-[580px]"
      variant="elevated"
    >
      <Box className="py-6 px-0 space-y-3 flex-shrink-0 lg:h-[140px]">
        <h3 className="text-xl font-semibold text-foreground lg:line-clamp-2 leading-tight">
          {preview.title}
        </h3>
        <p className="text-muted-foreground lg:line-clamp-3 text-sm leading-relaxed">
          {preview.description}
        </p>
      </Box>

      <Box
        aria-label={`${t("previews.click_to_enlarge")} - ${preview.title}`}
        className="relative aspect-[16/10] overflow-hidden bg-background mt-auto cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => onImageClick?.(preview.src)}
        onKeyDown={handleImageClick}
      >
        <Image
          fill
          alt={preview.alt}
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          className="object-cover object-center"
          placeholder="blur"
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={preview.src}
        />

        {/* Magnifying glass icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-900/60">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-300">
          {t("previews.click_to_enlarge")}
        </div>
      </Box>
    </Card>
  );
};
