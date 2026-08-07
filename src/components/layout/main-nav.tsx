"use client";

import Link from "next/link";
import { MonitorPlay, Table2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<string, typeof Table2 | typeof MonitorPlay | "advisor"> =
  {
    "/compare": Table2,
    "/advisor": "advisor",
    "/skills-test": MonitorPlay,
  };

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center lg:flex">
      {mainNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = navIcons[item.href];

        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="cursor-not-allowed px-4 py-2 text-sm font-medium text-white/25"
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
            className={cn(
              "nav-link inline-flex items-center gap-2",
              isActive && "nav-link--active",
            )}
          >
            {Icon === "advisor" ? (
              <ArcadeAdvisorCharacter size="xs" animate={false} />
            ) : Icon ? (
              <Icon className="size-4 shrink-0 opacity-60" aria-hidden />
            ) : null}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
