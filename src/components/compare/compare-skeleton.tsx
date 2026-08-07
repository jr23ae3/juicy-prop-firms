import { Skeleton } from "@/components/ui/skeleton";

export function CompareSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-[260px] w-full rounded-xl border border-border/60 bg-white/[0.03]"
        />
      ))}
    </div>
  );
}
