import Link from "next/link";
import {
  Calculator,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";

import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/utils";

const tools: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/compare",
    label: "Compare",
    description: "Side-by-side plan table",
    icon: Table2,
  },
  {
    href: "/advisor",
    label: "AI Advisor",
    description: "Personalized matches",
    icon: Sparkles,
  },
  {
    href: "/roi-calculator",
    label: "ROI Calc",
    description: "Break-even estimates",
    icon: Calculator,
  },
];

export function ToolsGrid() {
  return (
    <section aria-labelledby="tools-heading" className="mt-16">
      <p id="tools-heading" className="section-label mb-5">
        Platform tools
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ href, label, description, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "surface group flex items-start gap-3 p-4 transition-colors",
                "hover:border-primary/40 hover:bg-primary/5",
              )}
            >
              <IconTile icon={icon} />
              <div className="min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary">
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
