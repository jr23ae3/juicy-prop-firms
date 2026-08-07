import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: PageHeaderProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "flex flex-col gap-6 border-b border-border/60 pb-8",
        centered && "items-center text-center",
        !centered && actions && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("space-y-3", centered && "max-w-2xl")}>
        {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
        <h1 className="page-title">{title}</h1>
        {description ? (
          <p className={cn("page-lead", centered && "mx-auto")}>{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("shrink-0", centered && "justify-center")}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
