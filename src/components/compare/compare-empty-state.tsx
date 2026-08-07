import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CompareEmptyStateProps = {
  variant: "no-data" | "no-results";
};

export function CompareEmptyState({ variant }: CompareEmptyStateProps) {
  if (variant === "no-data") {
    return (
      <Container className="site-canvas compare-workspace py-16">
        <div className="compare-arcade-empty mx-auto max-w-lg">
          <p className="arcade-level-num text-[#ffd700]">★ NO CARTRIDGE ★</p>
          <h2 className="compare-arcade-empty-title mt-4">INSERT PLAN DATA</h2>
          <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
            Connect your database and run the seed script to load sample prop
            firm plans.
          </p>
          <pre className="mt-4 overflow-x-auto border-2 border-primary/25 bg-[#020812] p-3 text-left font-mono text-xs text-primary">
            npm run db:migrate{"\n"}npm run db:seed
          </pre>
        </div>
      </Container>
    );
  }

  return (
    <div className="compare-arcade-empty">
      <p className="arcade-level-num text-[#ffd700]">★ GAME OVER ★</p>
      <h2 className="compare-arcade-empty-title mt-4">NO PLANS MATCH</h2>
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        Try adjusting account size, eval type, or max budget — then press start
        again.
      </p>
      <Link
        href="/compare"
        className={cn(
          buttonVariants({ size: "sm" }),
          "arcade-btn arcade-btn--p1 mt-6 min-w-0 text-[9px]",
        )}
      >
        RESET FILTERS
      </Link>
    </div>
  );
}
