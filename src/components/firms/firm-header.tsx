import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { RankingFactorBars } from "@/components/rankings/ranking-factor-bars";
import { Badge } from "@/components/ui/badge";
import { FirmLogo } from "@/components/ui/firm-logo";
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
    <header className="surface p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-5">
          <FirmLogo
            name={firm.name}
            slug={firm.slug}
            logoUrl={firm.logoUrl}
            size="xl"
            className="hidden sm:flex"
          />
          <FirmLogo
            name={firm.name}
            slug={firm.slug}
            logoUrl={firm.logoUrl}
            size="lg"
            className="sm:hidden"
          />
          <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {firm.rankPosition ? (
              <Badge variant="secondary" className="rounded-full">
                Juice Index #{firm.rankPosition}
              </Badge>
            ) : null}
            {ranking ? (
              <Badge className="rounded-full">
                Score {ranking.score.toFixed(1)}
              </Badge>
            ) : null}
          </div>

          <div>
            <h1 className="page-title">{firm.name}</h1>
            {firm.description ? (
              <p className="page-lead mt-4">{firm.description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
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
            className={cn(buttonVariants(), "gap-1.5 cta-arrow")}
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
      className="surface p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="ranking-breakdown-heading"
          className="font-heading text-lg font-semibold"
        >
          Score breakdown
        </h2>
        <Link
          href="/methodology"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          How we score
        </Link>
      </div>
      <RankingFactorBars factors={ranking.factors} />
    </section>
  );
}
