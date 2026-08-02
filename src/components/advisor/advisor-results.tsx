"use client";

import Link from "next/link";
import { Sparkles, Trophy } from "lucide-react";

import { DiscountBadge } from "@/components/compare/discount-badge";
import { EvalTypeBadge } from "@/components/compare/eval-type-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAccountSize, formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdvisorResponse } from "@/types/advisor";

type AdvisorResultsProps = {
  result: AdvisorResponse;
};

export function AdvisorResults({ result }: AdvisorResultsProps) {
  if (result.recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No matches found</CardTitle>
          <CardDescription>{result.summary}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-5 text-primary" aria-hidden />
            <CardTitle>Your personalized matches</CardTitle>
            <Badge variant="secondary">
              {result.poweredBy === "openai" ? "AI powered" : "Smart match"}
            </Badge>
          </div>
          <CardDescription className="text-base text-foreground/80">
            {result.summary}
          </CardDescription>
        </CardHeader>
      </Card>

      <ol className="space-y-4">
        {result.recommendations.map((rec) => (
          <li key={rec.plan.id}>
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="gap-1">
                        {rec.rank === 1 ? (
                          <Trophy className="size-3" aria-hidden />
                        ) : null}
                        #{rec.rank} Match
                      </Badge>
                      <Badge variant="outline">{rec.matchScore}% fit</Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {rec.plan.firm.name} — {rec.plan.name}
                    </CardTitle>
                    <CardDescription>
                      {formatAccountSize(rec.plan.accountSize)} ·{" "}
                      <EvalTypeBadge evalType={rec.plan.evalType} />
                    </CardDescription>
                  </div>
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {formatCurrency(rec.plan.pricing.allInCost)}
                    <span className="block text-xs font-normal text-muted-foreground">
                      all-in
                    </span>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{rec.reasoning}</p>

                <ul className="flex flex-wrap gap-2">
                  {rec.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary">
                      {highlight}
                    </Badge>
                  ))}
                </ul>

                {rec.plan.discount ? (
                  <DiscountBadge discount={rec.plan.discount} />
                ) : null}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    href={`/compare?firm=${rec.plan.firm.slug}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    View in compare
                  </Link>
                  <Link
                    href={`/firms/${rec.plan.firm.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Firm profile
                  </Link>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
