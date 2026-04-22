import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium font-body ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:relative [&_svg]:z-10",
  {
    variants: {
      variant: {
        default:
          "liquid-glass bg-primary text-primary-foreground shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.1)] hover:shadow-[0_4px_20px_-2px_hsl(var(--primary)/0.55),inset_0_1px_0_hsl(0_0%_100%/0.18)] hover:brightness-110",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "liquid-glass border border-nav-glass-border bg-[hsl(var(--nav-glass))] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_-8px_hsl(220_40%_10%/0.2),inset_0_1px_0_hsl(var(--nav-glass-highlight))] hover:bg-accent/15 hover:border-accent/50 hover:shadow-[0_0_28px_-4px_hsl(var(--accent)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.35)]",
        secondary:
          "liquid-glass bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.15)] hover:bg-secondary/80 hover:shadow-[0_2px_12px_-2px_hsl(var(--electric)/0.25),inset_0_1px_0_hsl(0_0%_100%/0.22)]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent:
          "liquid-glass bg-accent text-accent-foreground font-semibold shadow-[0_2px_16px_-2px_hsl(var(--accent)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.2)] hover:shadow-[0_4px_28px_-2px_hsl(var(--accent)/0.55),inset_0_1px_0_hsl(0_0%_100%/0.3)] hover:brightness-110",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
