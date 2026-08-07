"use client";

import Link from "next/link";
import {
  Calculator,
  ShieldCheck,
  Sparkles,
  Table2,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<string, LucideIcon> = {
  "/compare": Table2,
  "/rankings": Trophy,
  "/advisor": Sparkles,
  "/pricing": Calculator,
  "/methodology": ShieldCheck,
};

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center md:flex">
      {mainNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = navIcons[item.href];

        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="cursor-not-allowed px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground/40"
              title="Coming soon"
            >
              {item.title}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-link inline-flex items-center gap-1.5", isActive && "nav-link--active")}
          >
            {Icon ? <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden /> : null}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
