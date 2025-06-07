import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/general";

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return <Comp className={cn(className)} ref={ref} {...props} />;
  }
);
Text.displayName = "Text";

export { Text };
