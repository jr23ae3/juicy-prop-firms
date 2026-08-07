import { cn } from "@/lib/utils";

type TerminalPanelProps = {
  title?: string;
  version?: string;
  children: React.ReactNode;
  className?: string;
};

export function TerminalPanel({
  title = "juicy — trade terminal",
  version = "v1.0.0",
  children,
  className,
}: TerminalPanelProps) {
  return (
    <div className={cn("terminal", className)}>
      <div className="terminal-chrome">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--yellow" />
          <span className="terminal-dot terminal-dot--green" />
        </div>
        <p className="terminal-title">
          {title}
          <span className="text-muted-foreground">{version}</span>
        </p>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
