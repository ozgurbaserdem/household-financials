"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils/general";

import { Box } from "./Box";

const stepIndicatorVariants = cva(
  "relative rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300",
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
          "bg-white/10 backdrop-blur-xl border border-white/20 text-gray-400 border-gray-700 hover:border-gray-600",
        active:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-purple-600 shadow-lg shadow-blue-500/25",
        completed:
          "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-600 shadow-lg shadow-green-500/20",
        disabled:
          "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      state: "pending",
    },
  }
);

const stepLabelVariants = cva(
  "mt-2 text-center transition-colors duration-300",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-xs",
        lg: "text-sm",
      },
      state: {
        pending: "text-gray-500",
        active: "font-semibold text-white",
        completed: "text-green-400",
        disabled: "text-gray-600",
      },
    },
    defaultVariants: {
      size: "default",
      state: "pending",
    },
  }
);

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

    return (
      <Box className="flex flex-col items-center">
        {animate ? (
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-40" />
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-40" />
            )}
          </button>
        )}

        {label && (
          <motion.span
            animate={animate ? { opacity: 1 } : undefined}
            className={cn(stepLabelVariants({ size, state }))}
            initial={animate ? { opacity: 0 } : undefined}
            transition={animate ? { delay: 0.2 + delay } : undefined}
          >
            {label}
          </motion.span>
        )}
      </Box>
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
          "hidden md:block flex-1 max-w-24",
          className
        )}
        {...props}
      >
        <Box className="absolute inset-0 bg-gray-800 rounded-full" />
        {animate ? (
          <motion.div
            animate={{ scaleX: completed ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"
            initial={{ scaleX: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.5, delay }}
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full transition-transform duration-500",
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
  steps: Array<{ label: string; disabled?: boolean }>;
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
        className={cn(
          "flex items-center justify-between gap-2 w-full",
          className
        )}
        {...props}
      >
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
                label={step.label}
                showGlow={showGlow}
                size={size}
                state={state}
                stepNumber={index + 1}
                variant={variant}
                onClick={() => onStepClick?.(index)}
              />

              {index < steps.length - 1 && (
                <StepConnector
                  animate={animate}
                  completed={index < currentStep}
                  delay={animate ? index * 0.1 : 0}
                  size={size}
                  variant={variant === "glass" ? "default" : variant}
                />
              )}
            </React.Fragment>
          );
        })}
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
