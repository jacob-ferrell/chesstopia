import getFirstChar from "../../util/getFirstChar";
import cn from "./cn";

interface AvatarProps {
  name?: string | null;
  size?: "sm" | "md" | "lg";
  tone?: "amber" | "slate";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-xl",
};

export default function Avatar({ name, size = "md", tone = "amber", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold shadow-inner",
        tone === "amber"
          ? "bg-gradient-to-b from-yellow-500 to-yellow-700 text-yellow-950"
          : "bg-gradient-to-b from-gray-500 to-gray-700 text-gray-100",
        sizes[size],
        className
      )}
    >
      {getFirstChar(name ?? "") ?? "?"}
    </span>
  );
}
