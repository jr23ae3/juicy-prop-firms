import { getRankingFactorLabel } from "@/config/ranking-factors";
import { cn } from "@/lib/utils";

type RankingFactorBarsProps = {
  factors: Record<string, number> | null;
  className?: string;
  compact?: boolean;
};

export function RankingFactorBars({
  factors,
  className,
  compact = false,
}: RankingFactorBarsProps) {
  if (!factors || Object.keys(factors).length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Factor breakdown not available.
      </p>
    );
  }

  const entries = Object.entries(factors).sort(([, a], [, b]) => b - a);

  return (
    <ul className={cn("space-y-3", className)}>
      {entries.map(([key, value]) => (
        <li key={key}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className={compact ? "text-xs" : ""}>
              {getRankingFactorLabel(key)}
            </span>
            <span className="font-medium tabular-nums">{Math.round(value)}</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
