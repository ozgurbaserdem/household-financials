"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  imageTitle?: string;
  onClose: () => void;
}

export const ImageModal = ({
  isOpen,
  imageSrc,
  imageTitle,
  onClose,
}: ImageModalProps) => {
  const t = useTranslations("landing");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-gray-900 border-gray-800">
        <DialogTitle className="sr-only">
          {imageTitle
            ? t("previews.fullsize_alt", { title: imageTitle })
            : t("previews.fullsize_view")}
        </DialogTitle>
        <div className="relative w-full h-full">
          {imageSrc && (
            <Image
              priority
              alt={
                imageTitle
                  ? t("previews.fullsize_alt", { title: imageTitle })
                  : "Full size preview"
              }
              className="w-full h-full object-contain"
              height={2000}
              quality={100}
              src={imageSrc}
              width={2800}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
