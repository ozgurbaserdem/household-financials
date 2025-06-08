import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils/general";

export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

const Main = React.forwardRef<HTMLElement, MainProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "main";
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Main.displayName = "Main";

export { Main };
