"use client";

import Link from "next/link";
import { Calculator, MonitorPlay, Table2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<
  string,
  typeof Table2 | typeof MonitorPlay | typeof Calculator | "advisor"
> = {
  "/compare": Table2,
  "/advisor": "advisor",
  "/skills-test": MonitorPlay,
  "/roi-calculator": Calculator,
};

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="site-header-main-nav hidden min-w-0 lg:flex"
    >
      {mainNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = navIcons[item.href];
        const compactTitle = item.shortTitle ?? item.title;

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
              "nav-link inline-flex shrink-0 items-center gap-1.5",
              isActive && "nav-link--active",
            )}
          >
            {Icon === "advisor" ? (
              <ArcadeAdvisorCharacter
                size="xs"
                animate={false}
                className="hidden xl:block"
              />
            ) : Icon ? (
              <Icon
                className="hidden size-3.5 shrink-0 opacity-60 xl:block"
                aria-hidden
              />
            ) : null}
            <span className="xl:hidden">{compactTitle}</span>
            <span className="hidden xl:inline">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
