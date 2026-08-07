import { Skeleton } from "@/components/ui/skeleton";

export function CompareSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="hidden h-[28rem] w-full rounded-2xl lg:block" />
    </div>
  );
}
