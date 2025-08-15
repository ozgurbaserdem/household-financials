import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/shared/utils/general";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "section";
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Section.displayName = "Section";

export { Section };
