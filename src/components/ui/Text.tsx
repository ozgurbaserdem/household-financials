import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/shared/utils/general";

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Text.displayName = "Text";

export { Text };
