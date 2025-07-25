import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Box } from "@/components/ui/Box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

interface FinancialCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const FinancialCard = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  ariaLabel,
}: FinancialCardProps) => {
  return (
    <Card className={className} variant="elevated">
      <CardHeader>
        <div className="p-2 rounded-lg icon-bg-golden">
          <Icon className="w-6 h-6 text-golden" />
        </div>
        <Box className="flex-1">
          <CardTitle aria-label={ariaLabel || title} tabIndex={0}>
            {title}
          </CardTitle>
          {description && (
            <Text className="text-sm text-muted-foreground mt-1">
              {description}
            </Text>
          )}
        </Box>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export { FinancialCard };
