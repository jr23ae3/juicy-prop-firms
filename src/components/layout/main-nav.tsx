"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center md:flex">
      {mainNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

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
            className={cn("nav-link", isActive && "nav-link--active")}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
