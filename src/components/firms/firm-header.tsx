import Link from "next/link";
import { ExternalLink, Trophy } from "lucide-react";

import { RankingFactorBars } from "@/components/rankings/ranking-factor-bars";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FirmPageData } from "@/server/data/firms";

type FirmHeaderProps = {
  data: FirmPageData;
};

export function FirmHeader({ data }: FirmHeaderProps) {
  const { firm, ranking, lowestAllIn } = data;

  return (
    <header className="rounded-xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {firm.rankPosition ? (
              <Badge className="gap-1">
                <Trophy className="size-3.5" aria-hidden />#{firm.rankPosition}{" "}
                Ranked
              </Badge>
            ) : null}
            {ranking ? (
              <Badge variant="secondary">
                Score {ranking.score.toFixed(1)}
              </Badge>
            ) : null}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {firm.name}
            </h1>
            {firm.description ? (
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {firm.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {lowestAllIn != null ? (
              <p>
                Lowest all-in:{" "}
                <span className="font-semibold text-primary">
                  {formatCurrency(lowestAllIn)}
                </span>
              </p>
            ) : null}
            {data.plans.length > 0 ? (
              <p className="text-muted-foreground">
                {data.plans.length} active plan
                {data.plans.length === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {firm.websiteUrl ? (
            <a
              href={firm.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-1.5",
              )}
            >
              Visit website
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : null}
          <Link
            href={`/compare?firm=${firm.slug}`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            Compare plans
          </Link>
        </div>
      </div>
    </header>
  );
}

type FirmRankingSectionProps = {
  ranking: FirmPageData["ranking"];
};

export function FirmRankingSection({ ranking }: FirmRankingSectionProps) {
  if (!ranking) return null;

  return (
    <section
      aria-labelledby="ranking-breakdown-heading"
      className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="ranking-breakdown-heading" className="text-lg font-semibold">
          Ranking breakdown
        </h2>
        <Link
          href="/methodology"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          How we rank
        </Link>
      </div>
      <RankingFactorBars factors={ranking.factors} />
    </section>
  );
}
