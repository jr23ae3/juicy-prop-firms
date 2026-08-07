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
      <Container className="site-canvas py-16">
        <div className="surface mx-auto max-w-lg p-8 text-center">
          <h2 className="text-xl font-semibold">No plan data yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Connect your database and run the seed script to load sample prop
            firm plans.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-3 text-left text-xs">
            npm run db:migrate{"\n"}npm run db:seed
          </pre>
        </div>
      </Container>
    );
  }

  return (
    <div className="surface-muted border-dashed px-6 py-12 text-center">
      <h2 className="text-lg font-semibold">No plans match your filters</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try adjusting account size, eval type, or max budget.
      </p>
      <Link
        href="/compare"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
      >
        Clear filters
      </Link>
    </div>
  );
}
