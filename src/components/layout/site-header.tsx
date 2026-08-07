import Link from "next/link";

import { AuthButtons } from "@/components/auth/auth-buttons";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteBrand } from "@/components/layout/site-brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8 lg:gap-12">
          <SiteBrand compact />
          <MainNav />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/compare"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden cta-arrow md:inline-flex",
            )}
          >
            Compare now
          </Link>
          <MobileNav />
          <AuthButtons />
        </div>
      </Container>
    </header>
  );
}
