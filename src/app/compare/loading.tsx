import { CompareSkeleton } from "@/components/compare/compare-skeleton";
import { Container } from "@/components/layout/container";

export default function CompareLoading() {
  return (
    <div className="site-canvas compare-workspace">
      <Container size="full" className="relative z-[1] py-8 md:py-12">
        <div className="sr-only" role="status" aria-live="polite">
          Loading comparison table…
        </div>
        <header className="compare-arcade-header mb-8">
          <div className="space-y-3">
            <p className="arcade-level-num text-[#ffd700]">★ LVL 1 · COMPARE ★</p>
            <h1 className="compare-arcade-title">PLAN SHOWDOWN</h1>
          </div>
        </header>
        <CompareSkeleton />
      </Container>
    </div>
  );
}
