"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/general";

import { Box } from "./Box";

const stepIndicatorVariants = cva(
  "relative rounded-full flex items-center justify-center font-medium border-2 transition-all duration-300",
  {
    variants: {
      size: {
        sm: "w-8 h-8 text-xs",
        default: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base",
      },
      variant: {
        default: "",
        minimal: "border-0 shadow-none",
        glass: "backdrop-blur-xl",
      },
      state: {
        pending:
          "bg-background border-gray-200/50 dark:border-gray-700/50 text-muted-foreground hover:border-foreground/50",
        active:
          "bg-primary text-primary-foreground border-primary scale-105 relative z-10",
        completed: "bg-gradient-golden text-white border-none",
        disabled:
          "bg-muted text-muted-foreground border-gray-200/50 dark:border-gray-700/50 cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      state: "pending",
    },
  }
);

const stepLabelVariants = cva("text-center transition-colors duration-300", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-xs",
      lg: "text-sm",
    },
    state: {
      pending: "text-muted-foreground",
      active: "font-bold text-foreground",
      completed: "text-golden font-medium",
      disabled: "text-muted-foreground opacity-50",
    },
  },
  defaultVariants: {
    size: "default",
    state: "pending",
  },
});

export interface StepIndicatorProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onAnimationStart"
      | "onAnimationEnd"
    >,
    VariantProps<typeof stepIndicatorVariants> {
  stepNumber: number;
  label?: string;
  animate?: boolean;
  delay?: number;
  showGlow?: boolean;
}

const StepIndicator = React.forwardRef<HTMLButtonElement, StepIndicatorProps>(
  (
    {
      className,
      size,
      variant,
      state,
      stepNumber,
      label,
      animate = false,
      delay = 0,
      showGlow = true,
      ...props
    },
    ref
  ) => {
    let IconSize: string;
    if (size === "sm") {
      IconSize = "w-3 h-3";
    } else if (size === "lg") {
      IconSize = "w-6 h-6";
    } else {
      IconSize = "w-5 h-5";
    }

    return animate ? (
      <motion.button
        ref={ref}
        animate={{ opacity: 1 }}
        aria-current={state === "active" ? "step" : undefined}
        aria-label={label}
        className={cn(
          stepIndicatorVariants({ size, variant, state }),
          className
        )}
        disabled={state === "disabled"}
        initial={{ opacity: 0 }}
        transition={{ delay }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {state === "completed" ? (
          <Check className={IconSize} />
        ) : (
          <span>{stepNumber}</span>
        )}

        {state === "active" && showGlow && (
          <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-30" />
        )}
      </motion.button>
    ) : (
      <button
        ref={ref}
        aria-current={state === "active" ? "step" : undefined}
        aria-label={label}
        className={cn(
          stepIndicatorVariants({ size, variant, state }),
          className
        )}
        disabled={state === "disabled"}
        {...props}
      >
        {state === "completed" ? (
          <Check className={IconSize} />
        ) : (
          <span>{stepNumber}</span>
        )}

        {state === "active" && showGlow && (
          <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-30" />
        )}
      </button>
    );
  }
);

StepIndicator.displayName = "StepIndicator";

const stepConnectorVariants = cva("h-0.5 relative", {
  variants: {
    size: {
      sm: "h-0.5",
      default: "h-0.5",
      lg: "h-1",
    },
    variant: {
      default: "",
      minimal: "",
      dashed: "bg-[length:8px_2px] bg-repeat-x",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface StepConnectorProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stepConnectorVariants> {
  completed?: boolean;
  animate?: boolean;
  delay?: number;
}

const StepConnector = React.forwardRef<HTMLDivElement, StepConnectorProps>(
  (
    {
      className,
      size,
      variant,
      completed = false,
      animate = false,
      delay = 0,
      ...props
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={cn(
          stepConnectorVariants({ size, variant }),
          "w-full min-w-12",
          className
        )}
        {...props}
      >
        <Box className="absolute inset-0 bg-gray-400 rounded-full" />
        {animate ? (
          <motion.div
            animate={{ scaleX: completed ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-golden rounded-full"
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.5, delay }}
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-golden rounded-full transition-transform duration-500",
              completed ? "scale-x-100" : "scale-x-0"
            )}
            style={{ transformOrigin: "left" }}
          />
        )}
      </Box>
    );
  }
);

StepConnector.displayName = "StepConnector";

export interface StepperProps {
  steps: Array<{ label: string; labelShort?: string; disabled?: boolean }>;
  currentStep: number;
  onStepClick?: (index: number) => void;
  size?: VariantProps<typeof stepIndicatorVariants>["size"];
  variant?: VariantProps<typeof stepIndicatorVariants>["variant"];
  animate?: boolean;
  showGlow?: boolean;
  className?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepClick,
      size = "default",
      variant = "default",
      animate = false,
      showGlow = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={cn("flex flex-col w-full", className)}
        {...props}
      >
        {/* Step indicators and connectors row */}
        <Box className="flex items-center justify-between w-full mb-2 gap-1 sm:gap-0">
          {steps.map((step, index) => {
            let state: "disabled" | "active" | "completed" | "pending";
            if (step.disabled) {
              state = "disabled";
            } else if (index === currentStep) {
              state = "active";
            } else if (index < currentStep) {
              state = "completed";
            } else {
              state = "pending";
            }

            return (
              <React.Fragment key={step.label}>
                <StepIndicator
                  animate={animate}
                  delay={animate ? index * 0.1 : 0}
                  showGlow={showGlow}
                  size={size}
                  state={state}
                  stepNumber={index + 1}
                  variant={variant}
                  onClick={() => onStepClick?.(index)}
                />

                {index < steps.length - 1 && (
                  <Box className="hidden sm:flex flex-1 mx-6">
                    <StepConnector
                      animate={animate}
                      completed={index < currentStep}
                      delay={animate ? index * 0.1 : 0}
                      size={size}
                      variant={variant === "glass" ? "default" : variant}
                    />
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Step labels row */}
        <Box className="flex items-center justify-between w-full gap-1 sm:gap-0">
          {steps.map((step, index) => {
            let state: "disabled" | "active" | "completed" | "pending";
            if (step.disabled) {
              state = "disabled";
            } else if (index === currentStep) {
              state = "active";
            } else if (index < currentStep) {
              state = "completed";
            } else {
              state = "pending";
            }

            return (
              <React.Fragment key={`${step.label}-label`}>
                <Box
                  className="flex justify-center"
                  style={{
                    width: (() => {
                      if (size === "sm") return "32px";
                      if (size === "lg") return "64px";
                      return "48px";
                    })(),
                  }}
                >
                  <motion.span
                    animate={animate ? { opacity: 1 } : undefined}
                    className={cn(
                      stepLabelVariants({ size, state }),
                      "text-center text-xs sm:text-sm"
                    )}
                    initial={animate ? { opacity: 0 } : undefined}
                    transition={
                      animate ? { delay: 0.2 + index * 0.1 } : undefined
                    }
                  >
                    <span className="sm:hidden">
                      {step.labelShort || step.label}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </motion.span>
                </Box>

                {index < steps.length - 1 && (
                  <Box className="hidden sm:flex flex-1" />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    );
  }
);

Stepper.displayName = "Stepper";

export {
  StepIndicator,
  StepConnector,
  Stepper,
  stepIndicatorVariants,
  stepLabelVariants,
  stepConnectorVariants,
};
