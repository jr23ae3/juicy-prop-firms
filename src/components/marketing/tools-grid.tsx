import Link from "next/link";
import {
  Calculator,
  Sparkles,
  Table2,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { IconTile } from "@/components/ui/icon-tile";

const tools: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/compare",
    label: "Compare",
    description: "Side-by-side plan explorer",
    icon: Table2,
  },
  {
    href: "/rankings",
    label: "Juice Index",
    description: "Independent firm scores",
    icon: Trophy,
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
    <section aria-labelledby="tools-heading" className="mt-20 border-t border-border pt-16">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p id="tools-heading" className="section-label mb-3">
            Platform tools
          </p>
          <h2 className="section-title max-w-xl">
            Everything you need to pick a firm
          </h2>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map(({ href, label, description, icon }) => (
          <li key={href}>
            <Link href={href} className="bf-tool-link group">
              <IconTile icon={icon} />
              <div className="min-w-0">
                <p className="text-lg font-medium tracking-[-0.02em] text-white group-hover:text-primary">
                  {label}
                </p>
                <p className="mt-1 text-sm tracking-[-0.01em] text-muted-foreground">
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
