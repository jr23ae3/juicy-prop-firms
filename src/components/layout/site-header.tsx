import Link from "next/link";

import { AuthButtons } from "@/components/auth/auth-buttons";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteBrand } from "@/components/layout/site-brand";
import { cn } from "@/lib/utils";

const TICKER_ITEMS = [
  "◆ INSERT COIN TO PLAY TAPE QUEST ◆",
  "★ JUICY TRADES ★",
  "DAILY 1M FUTURES ARCADE",
  "◆ PLAY · TRAIN · COMPARE · FUND ◆",
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
        <div className="site-header-arcade-brand">
          <div className="site-header-arcade-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <SiteBrand compact variant="arcade" />
        </div>

        <MainNav />

        <div className="site-header-arcade-actions">
          <Link
            href="/skills-test"
            className={cn(
              "arcade-btn arcade-btn--p1 hidden min-w-0 text-[8px] md:inline-flex lg:hidden sm:text-[9px]",
            )}
          >
            P1 · PLAY
          </Link>
          <MobileNav />
          <AuthButtons variant="header" />
        </div>
      </Container>
    </header>
  );
}
