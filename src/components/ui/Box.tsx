import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils/general";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Box.displayName = "Box";

export { Box };
