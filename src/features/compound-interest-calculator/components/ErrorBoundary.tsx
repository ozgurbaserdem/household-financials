import { useTranslations } from "next-intl";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Error fallback component that uses translations
const ErrorFallback = ({ error }: { error?: Error }) => {
  const t = useTranslations("compound_interest.error_boundary");

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-red-600">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text className="text-sm text-muted-foreground">{t("message")}</Text>
        {error && (
          <details className="mt-4">
            <summary className="text-xs cursor-pointer">
              {t("technical_details")}
            </summary>
            <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-500/20 text-gray-900 dark:text-gray-100 rounded">
              {error.message}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(properties: ErrorBoundaryProps) {
    super(properties);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Compound Interest Calculator Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
