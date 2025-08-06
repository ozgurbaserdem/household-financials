import React from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Link } from "@/i18n/navigation";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  href?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  href = "/hushallsbudget",
}) => (
  <section aria-labelledby="cta-section">
    <Card
      className="bg-gradient-to-r from-primary/5 to-secondary/5"
      variant="elevated"
    >
      <CardContent className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground" id="cta-section">
            {title}
          </h2>
          <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </Text>
        </div>
        <div className="flex justify-center">
          <Link href={href as "/hushallsbudget"}>
            <Button className="text-lg px-8 py-4" size="lg">
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </section>
);
