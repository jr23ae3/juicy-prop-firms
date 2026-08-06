import { formatCurrency } from "@/lib/format";

export type PlanFieldHistoryEntry = {
  id: string;
  value: number;
  previousValue: number | null;
  createdAt: string;
  changedBy: string | null;
};

export function PlanFieldHistory({
  title,
  emptyMessage,
  history,
}: {
  title: string;
  emptyMessage: string;
  history: PlanFieldHistoryEntry[];
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 p-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 space-y-2">
        {history.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
          >
            <div className="tabular-nums">
              {entry.previousValue == null ? (
                <span>Set to {formatCurrency(entry.value)}</span>
              ) : (
                <span>
                  {formatCurrency(entry.previousValue)} →{" "}
                  {formatCurrency(entry.value)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatHistoryDate(entry.createdAt)}
              {entry.changedBy ? ` · ${entry.changedBy}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatHistoryDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
