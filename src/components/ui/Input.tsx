import { InputHTMLAttributes, forwardRef, useId } from "react";
import cn from "./cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  tone?: "light" | "dark";
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, tone = "dark", className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium",
            tone === "dark" ? "text-gray-300" : "text-gray-700"
          )}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl px-3.5 text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-yellow-500/70",
          tone === "dark"
            ? "border border-white/10 bg-gray-900/60 text-gray-100 placeholder:text-gray-500 focus:border-yellow-500/40"
            : "border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-yellow-500/50",
          className
        )}
        {...rest}
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

export default Input;
