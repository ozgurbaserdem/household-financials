import { Edit3 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

import { ICON_BG_CLASSES, type ColorScheme } from "./constants";

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  colorScheme: ColorScheme;
  children: React.ReactNode;
  onEdit: () => void;
  expandedSections: string[];
  subtitle?: React.ReactNode;
}

export const AccordionSection = React.memo<AccordionSectionProps>(
  ({
    id,
    title,
    icon,
    colorScheme,
    children,
    onEdit,
    expandedSections,
    subtitle,
  }) => {
    const tSummary = useTranslations("summary");
    const iconBgClass = ICON_BG_CLASSES[colorScheme];
    const isExpanded = expandedSections.includes(id);

    const ariaLabel = tSummary(`aria.${id}_section`, {
      state: isExpanded
        ? tSummary("aria.expanded")
        : tSummary("aria.collapsed"),
      action: isExpanded ? tSummary("aria.collapse") : tSummary("aria.expand"),
    });

    return (
      <AccordionItem
        className="bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm"
        value={id}
      >
        <AccordionTrigger
          aria-label={ariaLabel}
          className="px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <Box className="flex items-center justify-between w-full">
            <Box className="flex items-center gap-3">
              <Box className={`p-2 rounded-lg ${iconBgClass}`}>{icon}</Box>
              <Box>
                <Text className="font-semibold text-foreground">{title}</Text>
                {subtitle && (
                  <Box className="text-xs text-muted-foreground">
                    {subtitle}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <Box
            className="space-y-3 pt-2"
            data-testid={`${id}-content`}
            role="list"
          >
            {children}
            <Button
              aria-label={tSummary(`aria.edit_${id}`)}
              className="mt-6 w-full font-medium group transition-colors"
              size="sm"
              variant="secondary"
              onClick={onEdit}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {tSummary("edit")}
            </Button>
          </Box>
        </AccordionContent>
      </AccordionItem>
    );
  }
);

AccordionSection.displayName = "AccordionSection";
