import { CompareSkeleton } from "@/components/compare/compare-skeleton";
import { Container } from "@/components/layout/container";

export default function CompareLoading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="sr-only" role="status" aria-live="polite">
        Loading comparison table…
      </div>
      <CompareSkeleton />
    </Container>
  );
}
