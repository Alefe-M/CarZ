import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "emerald"
    | "amber"
    | "purple";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md",
      secondary:
        "bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/50",
      outline:
        "border border-zinc-700 bg-transparent hover:bg-zinc-800/80 text-zinc-200",
      ghost: "hover:bg-zinc-800/60 text-zinc-300 hover:text-zinc-100",
      destructive:
        "bg-rose-600/90 text-white hover:bg-rose-600 shadow-sm",
      emerald:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950",
      amber:
        "bg-amber-600 text-white hover:bg-amber-500 shadow-sm shadow-amber-950",
      purple:
        "bg-purple-600 text-white hover:bg-purple-500 shadow-sm shadow-purple-950",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
