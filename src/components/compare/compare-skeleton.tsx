import { Skeleton } from "@/components/ui/skeleton";

export function CompareSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="compare-arcade-skeleton h-[280px] w-full" />
      ))}
    </div>
  );
}
