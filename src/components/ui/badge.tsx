import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "preparacao"
    | "a_venda"
    | "vendido"
    | "parts"
    | "labor"
    | "fipe";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    secondary:
      "border-transparent bg-zinc-800/80 text-zinc-300",
    outline:
      "border-zinc-700 text-zinc-300 bg-transparent",
    preparacao:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium",
    a_venda:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium",
    vendido:
      "border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium",
    parts:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium",
    labor:
      "border-violet-500/30 bg-violet-500/10 text-violet-400 font-medium",
    fipe:
      "border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
