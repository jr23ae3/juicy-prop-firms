import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

import { RankingFactorBars } from "@/components/rankings/ranking-factor-bars";
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
        "rounded-xl border border-border/60 bg-card shadow-sm transition-colors hover:border-primary/30",
        isPodium ? "p-5" : "p-4",
        isTopThree && isPodium && "border-primary/20 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <RankBadge position={ranking.position} large={isPodium} />
          <div>
            <h3 className={cn("font-semibold", isPodium && "text-lg")}>
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
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-lg font-bold tabular-nums text-primary">
            {ranking.score.toFixed(1)}
          </p>
        </div>
      </div>

      {isPodium ? (
        <div className="mt-4">
          <RankingFactorBars factors={ranking.factors} compact />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/firms/${ranking.firm.slug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
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
        "flex shrink-0 items-center justify-center gap-1 rounded-full bg-primary font-bold text-primary-foreground tabular-nums",
        large ? "size-10 text-sm" : "size-8 text-xs",
      )}
    >
      {position === 1 ? (
        <Trophy className={cn("size-3.5", large && "size-4")} aria-hidden />
      ) : null}
      #{position}
    </span>
  );
}
