import Link from "next/link";
import { BadgeCheck, Calculator, Sparkles } from "lucide-react";

import { FirmLogoStrip } from "@/components/marketing/firm-logo-strip";
import { ToolsGrid } from "@/components/marketing/tools-grid";
import { Container } from "@/components/layout/container";
import { IconTile } from "@/components/ui/icon-tile";
import { siteConfig } from "@/config/site";
import type { FeaturedFirm } from "@/server/data/plans";

const highlights = [
  {
    icon: BadgeCheck,
    label: "Verified pricing",
    description:
      "Pulled directly from each firm — never scraped from aggregators.",
  },
  {
    icon: Calculator,
    label: "True all-in cost",
    description:
      "Eval price plus activation fees, shown before you click out.",
  },
  {
    icon: Sparkles,
    label: "AI matching",
    description:
      "Plan recommendations shaped to how you actually trade.",
  },
] as const;

const heroLinks = [
  { href: "/compare", label: "Compare" },
  { href: "/rankings", label: "Juice Index" },
  { href: "/advisor", label: "AI Advisor" },
  { href: "/methodology", label: "Methodology" },
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

  return (
    <section className="site-canvas relative overflow-hidden">
      <div className="bf-hero-bg" aria-hidden />

      <Container size="wide" className="relative">
        <div className="bf-hero-area pt-8 md:pt-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              {hasStats ? (
                <div className="surface mb-8 inline-block p-5 md:p-6">
                  <p className="text-sm font-medium tracking-[-0.02em] text-muted-foreground">
                    Live catalog
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-baseline justify-between gap-6 border-b border-border pb-3">
                      <dt className="text-sm text-muted-foreground">Firms</dt>
                      <dd className="text-2xl font-medium tabular-nums">{stats.firms}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 border-b border-border pb-3">
                      <dt className="text-sm text-muted-foreground">Plans</dt>
                      <dd className="text-2xl font-medium tabular-nums">{stats.plans}</dd>
                    </div>
                    {stats.lowestAllIn != null ? (
                      <div className="flex items-baseline justify-between gap-6">
                        <dt className="text-sm text-muted-foreground">Lowest all-in</dt>
                        <dd className="text-2xl font-medium text-primary tabular-nums">
                          {formatCurrency(stats.lowestAllIn)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ) : (
                <div className="surface mb-8 p-5 md:p-6">
                  <p className="text-sm text-muted-foreground">
                    Run <code className="font-mono text-white/80">npm run db:seed</code> to load the catalog.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <ul className="space-y-1 text-right">
                {heroLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block text-2xl font-medium tracking-[-0.02em] text-white/65 transition-colors hover:text-white md:text-3xl"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="max-w-md text-xl leading-[1.25] font-medium tracking-[-0.03em] text-white md:text-2xl">
                {siteConfig.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/compare" className="bf-btn bf-btn-primary">
                  Compare now
                </Link>
                <Link href="/advisor" className="bf-btn bf-btn-outline">
                  Try AI advisor
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bf-marquee" aria-hidden>
                <ul className="bf-marquee-track">
                  <li className="bf-marquee-word">Prop</li>
                  <li className="bf-marquee-word">Firm</li>
                  <li className="bf-marquee-word">Data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ToolsGrid />
        <FirmLogoStrip firms={featuredFirms} />

        <div className="surface-dark mt-20 rounded-[var(--radius)] px-6 py-14 md:px-10 md:py-16">
          <p className="section-label mb-10">What you get</p>
          <ul className="grid gap-10 md:grid-cols-3">
            {highlights.map(({ icon, label, description }) => (
              <li key={label} className="flex gap-4">
                <IconTile icon={icon} />
                <div className="space-y-2">
                  <h2 className="text-xl font-medium tracking-[-0.02em]">{label}</h2>
                  <p className="text-sm leading-relaxed tracking-[-0.01em] text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 pb-8 text-sm tracking-[-0.01em] text-muted-foreground">
          Built for futures traders.{" "}
          <Link href="/methodology" className="text-white hover:underline">
            How we verify data
          </Link>
        </p>
      </Container>
    </section>
  );
}
