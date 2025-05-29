import React from "react";
import { Box } from "@/components/ui/box";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
interface ProgressStepperProps {
  steps: { label: string }[];
  currentStep: number;
  onStepClick?: (idx: number) => void;
}
export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
}: ProgressStepperProps) {
  return (
    <Box className="flex items-center justify-between gap-2 w-full mb-8">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <React.Fragment key={step.label}>
            <Box className="flex-1 flex flex-col items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`
          relative rounded-full w-12 h-12 flex items-center justify-center
          font-bold border-2 transition-all duration-300
          ${
            isActive
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-purple-600 shadow-lg shadow-blue-500/25"
              : isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-600 shadow-lg shadow-green-500/20"
                : "glass text-gray-400 border-gray-700 hover:border-gray-600"
          }
        `}
                onClick={() => onStepClick && onStepClick(idx)}
                aria-current={isActive ? "step" : undefined}
                aria-label={step.label}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}

                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-40" />
                )}
              </motion.button>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`
          mt-2 text-xs text-center transition-colors duration-300
          ${
            isActive
              ? "font-semibold text-white"
              : isCompleted
                ? "text-green-400"
                : "text-gray-500"
          }
        `}
              >
                {step.label}
              </motion.span>
            </Box>

            {idx < steps.length - 1 && (
              <Box className="hidden md:block flex-1 h-0.5 relative">
                <Box className="absolute inset-0 bg-gray-800 rounded-full" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: idx < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{ transformOrigin: "left" }}
                />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
