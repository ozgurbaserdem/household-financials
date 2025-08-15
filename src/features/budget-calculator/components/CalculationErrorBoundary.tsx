import React from "react";

import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";

interface CalculationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface CalculationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CalculationErrorBoundary extends React.Component<
  CalculationErrorBoundaryProps,
  CalculationErrorBoundaryState
> {
  constructor(props: CalculationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CalculationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Calculation error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Box className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Text className="text-destructive font-medium">
              Calculation Error
            </Text>
            <Text className="text-sm text-muted-foreground mt-1">
              Unable to calculate financial data. Please check your input
              values.
            </Text>
          </Box>
        )
      );
    }

    return this.props.children;
  }
}

export const withCalculationErrorBoundary = <T extends object>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => (
    <CalculationErrorBoundary>
      <Component {...props} />
    </CalculationErrorBoundary>
  );

  WrappedComponent.displayName = `withCalculationErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export const safeCalculation = <T,>(calculation: () => T, fallback: T): T => {
  try {
    return calculation();
  } catch (error) {
    console.error("Safe calculation error:", error);
    return fallback;
  }
};
