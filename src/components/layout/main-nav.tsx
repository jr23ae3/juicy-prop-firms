"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
      {mainNav.map((item) => {
        const isActive = pathname === item.href;

        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60"
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
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
