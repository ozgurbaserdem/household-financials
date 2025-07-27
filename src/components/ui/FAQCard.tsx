import React from "react";

import { Card, CardContent } from "./Card";
import { Text } from "./Text";

interface FAQCardProps {
  question: string;
  answer: string;
}

export const FAQCard: React.FC<FAQCardProps> = ({ question, answer }) => {
  return (
    <Card variant="elevated">
      <CardContent>
        <h3
          aria-level={3}
          className="text-lg font-semibold text-foreground mb-2"
          role="heading"
        >
          {question}
        </h3>
        <Text className="text-muted-foreground">{answer}</Text>
      </CardContent>
    </Card>
  );
};
