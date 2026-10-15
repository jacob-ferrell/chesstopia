import { ButtonHTMLAttributes, forwardRef } from "react";
import cn from "./cn";

export type ButtonVariant = "primary" | "accent" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-lime-700 to-lime-800 text-white shadow-md shadow-lime-900/30 hover:from-lime-600 hover:to-lime-700 active:from-lime-800 active:to-lime-900",
  accent:
    "bg-gradient-to-b from-yellow-500 to-yellow-600 text-yellow-950 shadow-md shadow-yellow-900/30 hover:from-yellow-400 hover:to-yellow-500 active:from-yellow-600 active:to-yellow-700",
  secondary:
    "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-100 shadow-md shadow-black/30 hover:from-gray-500 hover:to-gray-600 active:from-gray-700 active:to-gray-800",
  danger:
    "bg-gradient-to-b from-red-700 to-red-800 text-white shadow-md shadow-red-900/30 hover:from-red-600 hover:to-red-700 active:from-red-800 active:to-red-900",
  ghost: "text-gray-300 hover:bg-white/10 hover:text-white",
  outline:
    "border border-white/15 bg-white/5 text-gray-100 hover:bg-white/10 hover:border-white/25",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", block = false, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "focus-ring inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        block && "w-full",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
