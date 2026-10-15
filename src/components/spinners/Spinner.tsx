import cn from "../ui/cn";

interface SpinnerProps {
  text?: string;
  textClass?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

export default function Spinner({ text, textClass, size = "md", className }: SpinnerProps) {
  return (
    <div role="status" className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block shrink-0 animate-spin rounded-full border-gray-500/40 border-t-lime-500",
          sizes[size]
        )}
      />
      {text && <span className={textClass ?? "text-sm text-gray-300"}>{text}</span>}
      <span className="sr-only">{text ?? "Loading"}</span>
    </div>
  );
}
