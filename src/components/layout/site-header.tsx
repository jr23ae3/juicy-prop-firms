import Link from "next/link";

import { AuthButtons } from "@/components/auth/auth-buttons";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteBrand } from "@/components/layout/site-brand";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="bf-header">
      <div className="bf-header-inner">
        <SiteBrand compact />

        <MainNav />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/compare" className={cn("bf-btn bf-btn-accent hidden md:inline-flex")}>
            Compare now
          </Link>
          <MobileNav />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
