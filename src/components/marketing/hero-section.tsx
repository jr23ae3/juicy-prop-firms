import Link from "next/link";
import { BadgeCheck, Calculator, Table2 } from "lucide-react";

import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import { ArcadeFirmMarquee } from "@/components/marketing/arcade-firm-marquee";
import { ArcadePacmanBackground } from "@/components/marketing/arcade-pacman-background";
import { ArcadeScoreHud } from "@/components/marketing/arcade-score-hud";
import { ArcadeStarfield } from "@/components/marketing/arcade-starfield";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import type { FeaturedFirm } from "@/server/data/plans";

const levels = [
  {
    href: "/compare",
    num: "LVL 1",
    title: "COMPARE",
    desc: "Side-by-side plan showdown",
    icon: Table2,
  },
  {
    href: "/advisor",
    num: "LVL 2",
    title: "AI BOSS",
    desc: "Oracle OJ — firm matches",
    character: true as const,
  },
  {
    href: "/roi-calculator",
    num: "LVL 3",
    title: "ROI RUN",
    desc: "Break-even calculator",
    icon: Calculator,
  },
] as const;

const powerUps = [
  {
    icon: BadgeCheck,
    title: "VERIFIED",
    desc: "Pricing pulled direct from each firm.",
  },
  {
    icon: Calculator,
    title: "ALL-IN",
    desc: "Eval + activation fees upfront.",
  },
  {
    character: true as const,
    title: "AI MATCH",
    desc: "Oracle OJ picks your plans.",
  },
] as const;

type HeroSectionProps = {
  stats?: {
    firms: number;
    plans: number;
    lowestAllIn: number | null;
  };
  featuredFirms?: FeaturedFirm[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HeroSection({ stats, featuredFirms = [] }: HeroSectionProps) {
  const hasStats = stats && stats.plans > 0;
  const lowestLabel =
    hasStats && stats.lowestAllIn != null
      ? formatCurrency(stats.lowestAllIn)
      : null;

  return (
    <section className="arcade-landing">
      <ArcadePacmanBackground />
      <ArcadeStarfield />

      {/* floating coins */}
      <span className="arcade-coin left-[8%] top-[18%]" style={{ animationDelay: "0s" }} aria-hidden />
      <span className="arcade-coin right-[12%] top-[28%]" style={{ animationDelay: "1s" }} aria-hidden />
      <span className="arcade-coin left-[85%] top-[62%]" style={{ animationDelay: "0.5s" }} aria-hidden />

      <Container className="relative z-[1] py-10 sm:py-14 lg:py-16">
        <div className="arcade-cabinet">
          <div className="arcade-cabinet-shell">
            <div className="arcade-screen">
              <div className="arcade-screen-inner">
                <p className="arcade-coin-text">◆ INSERT COIN TO CONTINUE ◆</p>

                <h1 className="arcade-title">
                  JUICY TRADE
                  <br />
                  FIRMS
                </h1>
                <p className="arcade-subtitle">PROP FIRM QUEST · 1UP EDITION</p>

                <p className="arcade-press-start" aria-hidden>
                  ▶ PRESS START
                </p>

                {hasStats ? (
                  <ArcadeScoreHud
                    firms={stats.firms}
                    plans={stats.plans}
                    lowestAllIn={lowestLabel}
                  />
                ) : (
                  <p className="mt-8 font-mono text-xs text-muted-foreground">
                    RUN npm run db:seed TO LOAD THE CATALOG
                  </p>
                )}

                <p className="mx-auto mt-6 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  {siteConfig.description}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/compare" className="arcade-btn arcade-btn--p1">
                    P1 · COMPARE
                  </Link>
                  <Link href="/advisor" className="arcade-btn arcade-btn--p2">
                    P2 · ADVISOR
                  </Link>
                </div>

                <div className="arcade-dot-trail mx-auto mt-8 w-fit" aria-hidden>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <span
                      key={i}
                      className="arcade-dot"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="level-select" className="mt-16">
          <h2 id="level-select" className="arcade-level-num mb-5 text-center">
            ★ SELECT YOUR LEVEL ★
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {levels.map(({ href, num, title, desc, ...level }) => (
              <li key={href}>
                <Link href={href} className="group arcade-level-card">
                  <p className="arcade-level-num">{num}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {"icon" in level ? (
                      <level.icon className="size-4 text-primary" aria-hidden />
                    ) : (
                      <ArcadeAdvisorCharacter size="sm" animate={false} />
                    )}
                    <p className="arcade-level-title">{title}</p>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {desc}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ArcadeFirmMarquee firms={featuredFirms} />

        <section aria-labelledby="power-ups" className="mt-16">
          <h2 id="power-ups" className="arcade-level-num mb-5 text-center">
            ★ POWER-UPS UNLOCKED ★
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {powerUps.map(({ title, desc, ...powerUp }) => (
              <li key={title} className="arcade-powerup">
                <div className="flex size-10 shrink-0 items-center justify-center border-2 border-primary/40 bg-primary/10">
                  {"icon" in powerUp ? (
                    <powerUp.icon className="size-5 text-primary" aria-hidden />
                  ) : (
                    <ArcadeAdvisorCharacter size="xs" animate={false} />
                  )}
                </div>
                <div>
                  <p className="arcade-level-title">{title}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-center font-mono text-[10px] text-muted-foreground">
          © HIGH SCORE RESEARCH · BUILT FOR FUTURES TRADERS
        </p>
      </Container>
    </section>
  );
}
