import Link from "next/link";

import { AuthButtons } from "@/components/auth/auth-buttons";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteBrand } from "@/components/layout/site-brand";
import { cn } from "@/lib/utils";

const TICKER_ITEMS = [
  "◆ INSERT COIN TO CONTINUE ◆",
  "★ JUICY TRADE FIRMS ★",
  "1UP EDITION",
  "◆ COMPARE · ADVISE · WIN ◆",
] as const;

export function SiteHeader() {
  return (
    <header className="site-header-arcade">
      <div className="site-header-arcade-ticker" aria-hidden>
        <div className="site-header-arcade-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span key={index} className="site-header-arcade-ticker-text">
              {item}
            </span>
          ))}
        </div>
      </div>

      <Container className="site-header-arcade-inner">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <div className="site-header-arcade-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <SiteBrand compact variant="arcade" />
          <MainNav />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/compare"
            className={cn(
              "arcade-btn arcade-btn--p1 hidden min-w-0 text-[8px] md:inline-flex sm:text-[9px]",
            )}
          >
            P1 · COMPARE
          </Link>
          <MobileNav />
          <AuthButtons />
        </div>
      </Container>
    </header>
  );
}
