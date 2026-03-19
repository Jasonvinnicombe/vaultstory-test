import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background active:scale-[0.99]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_18px_36px_rgba(30,42,68,0.16)] hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(30,42,68,0.2)]",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_14px_30px_rgba(230,184,106,0.22)] hover:bg-secondary/90",
        outline: "border border-white/75 bg-card/82 text-foreground shadow-[0_12px_28px_rgba(30,42,68,0.07)] hover:bg-card hover:border-white/95",
        ghost: "text-foreground hover:bg-secondary/25",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_12px_24px_rgba(186,56,56,0.18)] hover:opacity-92",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
