import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/general";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "section";
    return <Comp className={cn(className)} ref={ref} {...props} />;
  }
);
Section.displayName = "Section";

export { Section };
