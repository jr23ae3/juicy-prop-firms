import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RankingFactorGate } from "@/components/rankings/ranking-factor-gate";
import { FirmLogo } from "@/components/ui/firm-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RankingSummary } from "@/types/plan";

type RankingCardProps = {
  ranking: RankingSummary;
  variant?: "default" | "podium";
};

export function RankingCard({ ranking, variant = "default" }: RankingCardProps) {
  const isPodium = variant === "podium";
  const isTopThree = ranking.position <= 3;

  return (
    <article
      className={cn(
        "surface transition-colors hover:ring-primary/30",
        isPodium ? "p-5" : "p-4",
        isTopThree && isPodium && "ring-primary/25 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <FirmLogo
            name={ranking.firm.name}
            slug={ranking.firm.slug}
            logoUrl={ranking.firm.logoUrl}
            size={isPodium ? "lg" : "md"}
          />
          <div className="min-w-0">
            <h3 className={cn("font-heading font-semibold", isPodium && "text-lg")}>
              <Link
                href={`/firms/${ranking.firm.slug}`}
                className="hover:text-primary hover:underline underline-offset-4"
              >
                {ranking.firm.name}
              </Link>
            </h3>
            {ranking.firm.description ? (
              <p
                className={cn(
                  "mt-1 line-clamp-2 text-muted-foreground",
                  isPodium ? "text-sm" : "text-xs",
                )}
              >
                {ranking.firm.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <RankBadge position={ranking.position} large={isPodium} />
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Score
          </p>
          <p className="font-heading text-2xl font-semibold tabular-nums text-primary">
            {ranking.score.toFixed(1)}
          </p>
        </div>
      </div>

      {isPodium ? (
        <div className="mt-4">
          <RankingFactorGate factors={ranking.factors} compact />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/firms/${ranking.firm.slug}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          View firm
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        <Link
          href={`/compare?firm=${ranking.firm.slug}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Compare plans
        </Link>
      </div>
    </article>
  );
}

function RankBadge({
  position,
  large = false,
}: {
  position: number;
  large?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-primary font-mono text-sm font-normal text-primary-foreground tabular-nums",
        large ? "size-10 text-sm" : "size-8 text-xs",
      )}
    >
      {position}
    </span>
  );
}
