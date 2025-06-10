"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";

export const CalculatorPreviews = () => {
  const t = useTranslations("landing");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const previews = [
    {
      id: "budget-wizard",
      src: "/screenshots/budget-wizard.png",
      alt: t("previews.budget_wizard_alt"),
      title: t("previews.budget_wizard_title"),
      description: t("previews.budget_wizard_description"),
    },
    {
      id: "budget-results",
      src: "/screenshots/budget-results.png",
      alt: t("previews.budget_results_alt"),
      title: t("previews.budget_results_title"),
      description: t("previews.budget_results_description"),
    },
    {
      id: "compound-interest",
      src: "/screenshots/compound-interest.png",
      alt: t("previews.compound_interest_alt"),
      title: t("previews.compound_interest_title"),
      description: t("previews.compound_interest_description"),
    },
  ];

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {previews.map((preview, index) => (
          <motion.div
            key={preview.id}
            initial={{ opacity: 0, y: 30 }}
            transition={{ delay: index * 0.2 + 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card
              className="overflow-hidden h-full cursor-pointer flex flex-col"
              variant="elevated"
            >
              <Box className="p-6 space-y-4 flex-shrink-0">
                <h3 className="text-xl font-semibold text-foreground">
                  {preview.title}
                </h3>
                <p className="text-muted-foreground">{preview.description}</p>
              </Box>

              <Box
                className="relative aspect-[16/10] overflow-hidden bg-gray-900 mt-auto cursor-pointer"
                onClick={() => setSelectedImage(preview.src)}
              >
                <Image
                  fill
                  alt={preview.alt}
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  className="object-contain object-center bg-gray-950"
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
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-gray-900 border-gray-800">
          <DialogTitle className="sr-only">
            {t("previews.fullsize_view")}
          </DialogTitle>
          <div className="relative w-full h-full">
            {selectedImage && (
              <Image
                priority
                alt="Full size preview"
                className="w-full h-full object-contain"
                height={1600}
                quality={100}
                src={selectedImage}
                width={2400}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};
