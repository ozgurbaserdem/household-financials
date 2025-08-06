import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";

import { Text } from "./Text";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  className = "",
}) => {
  return (
    <Accordion.Root className={`w-full ${className}`} type="multiple">
      {items.map((item, index) => (
        <Accordion.Item
          key={item.question}
          className="border-b border-t border-gray-200 dark:border-gray-200/10"
          value={`item-${index}`}
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between py-4 px-1 text-left text-lg font-semibold text-foreground hover:text-primary transition-colors group">
              {item.question}
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="pb-4 px-1">
              <Text className="text-muted-foreground">{item.answer}</Text>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
