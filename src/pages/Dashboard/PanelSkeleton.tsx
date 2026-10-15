interface PanelSkeletonProps {
  rows?: number;
}

export default function PanelSkeleton({ rows = 3 }: PanelSkeletonProps) {
  return (
    <ul className="flex animate-pulse flex-col gap-2 py-1" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-xl p-3">
          <span className="h-10 w-10 rounded-full bg-gray-200" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-3.5 w-1/2 rounded bg-gray-200" />
            <span className="h-3 w-1/3 rounded bg-gray-100" />
          </span>
        </li>
      ))}
    </ul>
  );
}
