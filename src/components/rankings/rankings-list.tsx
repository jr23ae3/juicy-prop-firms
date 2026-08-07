import Link from "next/link";

import { RankingCard } from "@/components/rankings/ranking-card";
import { RankingFactorGate } from "@/components/rankings/ranking-factor-gate";
import { FirmLogo } from "@/components/ui/firm-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RankingSummary } from "@/types/plan";

type RankingsListProps = {
  rankings: RankingSummary[];
};

export function RankingsList({ rankings }: RankingsListProps) {
  if (rankings.length === 0) {
    return (
      <div className="surface-muted border-dashed px-6 py-12 text-center">
        <h2 className="font-heading text-lg font-semibold">No rankings yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Run migrations and seed the database to load the Juice Index.
        </p>
        <pre className="mx-auto mt-4 max-w-xs overflow-x-auto rounded-md bg-muted p-3 text-left text-xs">
          npm run db:migrate{"\n"}npm run db:seed
        </pre>
      </div>
    );
  }

  const podium = rankings.filter((r) => r.position <= 3);
  const rest = rankings.filter((r) => r.position > 3);

  return (
    <div className="space-y-8">
      {podium.length > 0 ? (
        <section aria-labelledby="podium-heading">
          <h2 id="podium-heading" className="sr-only">
            Top 3 ranked firms
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {podium.map((ranking) => (
              <RankingCard
                key={ranking.firm.id}
                ranking={ranking}
                variant="podium"
              />
            ))}
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section aria-labelledby="full-rankings-heading">
          <h2
            id="full-rankings-heading"
            className="mb-4 font-heading text-lg font-semibold"
          >
            Rest of the index
          </h2>
          <ol className="space-y-3">
            {rest.map((ranking) => (
              <li key={ranking.firm.id}>
                <div className="surface p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <FirmLogo
                        name={ranking.firm.name}
                        slug={ranking.firm.slug}
                        logoUrl={ranking.firm.logoUrl}
                        size="sm"
                      />
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-sm tabular-nums text-accent">
                        {ranking.position}
                      </span>
                      <div>
                        <Link
                          href={`/firms/${ranking.firm.slug}`}
                          className="font-semibold hover:text-primary hover:underline underline-offset-4"
                        >
                          {ranking.firm.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Score:{" "}
                          <span className="font-medium text-foreground">
                            {ranking.score.toFixed(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-2 lg:justify-end">
                      <Link
                        href={`/firms/${ranking.firm.slug}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                        )}
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/compare?firm=${ranking.firm.slug}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                        )}
                      >
                        Plans
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 hidden lg:block">
                    <RankingFactorGate factors={ranking.factors} compact />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
