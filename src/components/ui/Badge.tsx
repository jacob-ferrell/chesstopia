import { HTMLAttributes } from "react";
import cn from "./cn";

export type BadgeTone = "amber" | "green" | "red" | "gray" | "sky";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

const tones: Record<BadgeTone, string> = {
  amber: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
  green: "bg-green-100 text-green-800 ring-green-600/20",
  red: "bg-red-100 text-red-800 ring-red-600/20",
  gray: "bg-gray-100 text-gray-600 ring-gray-500/20",
  sky: "bg-sky-100 text-sky-800 ring-sky-600/20",
};

const dots: Record<BadgeTone, string> = {
  amber: "bg-yellow-500",
  green: "bg-green-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
  sky: "bg-sky-500",
};

export default function Badge({ tone = "gray", dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
      {...rest}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}
