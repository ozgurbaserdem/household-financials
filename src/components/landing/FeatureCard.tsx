import type { ComponentType, SVGProps } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardIcon,
} from "@/components/ui/Card";

interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export const FeatureCard = ({
  icon: IconComponent,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <Card className="h-full text-center border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <CardHeader className="items-center" layout="vertical">
        <CardIcon
          className="bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          size="lg"
          variant="default"
        >
          <IconComponent className="w-8 h-8 text-golden" />
        </CardIcon>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardDescription className="text-center text-muted-foreground leading-relaxed">
        {description}
      </CardDescription>
    </Card>
  );
};
