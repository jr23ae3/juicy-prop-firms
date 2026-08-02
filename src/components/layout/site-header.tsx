import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
            >
              J
            </span>
            <span className="text-base sm:text-lg">
              {siteConfig.name}
            </span>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" disabled>
            Sign in
          </Button>
          <Button size="sm" disabled className="gap-1.5">
            <Sparkles className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Get AI Match</span>
            <span className="sm:hidden">AI Match</span>
          </Button>
        </div>
      </Container>
    </header>
  );
}
