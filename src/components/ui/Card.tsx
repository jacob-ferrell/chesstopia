import { HTMLAttributes } from "react";
import cn from "./cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "light" | "dark";
  padded?: boolean;
}

/**
 * Surface container. "light" is the white panel used for dashboard content;
 * "dark" is a translucent slate panel used on top of the page gradient.
 */
export default function Card({ tone = "dark", padded = true, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-card",
        tone === "light"
          ? "bg-white text-gray-900 ring-1 ring-black/5 [color-scheme:light]"
          : "bg-gray-800/70 text-gray-100 ring-1 ring-white/10 backdrop-blur",
        padded && "p-5 sm:p-6",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
