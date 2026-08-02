import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function RankingsLoading() {
  return (
    <Container className="space-y-8 py-8 md:py-12">
      <div className="sr-only" role="status" aria-live="polite">
        Loading rankings…
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </Container>
  );
}
