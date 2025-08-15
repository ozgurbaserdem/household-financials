import { HelpCircle } from "lucide-react";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Card, CardContent } from "@/components/ui/Card";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";

interface FAQSectionProps {
  title: string;
  description: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  description,
  faqs,
}) => (
  <section aria-labelledby="faq-section">
    <Card variant="elevated">
      <SectionHeader
        className="mb-2"
        headerId="faq-section"
        icon={HelpCircle}
        title={title}
        variant="card"
      />
      <CardContent>
        <Text className="text-lg text-muted-foreground leading-relaxed mb-6 text-center">
          {description}
        </Text>
        <Box className="mb-4" />
        <FAQAccordion items={faqs} />
      </CardContent>
    </Card>
  </section>
);
