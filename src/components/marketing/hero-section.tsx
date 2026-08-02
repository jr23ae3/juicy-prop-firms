import { ArrowRight, BadgeCheck, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const highlights = [
  {
    icon: BadgeCheck,
    label: "Verified pricing",
    description: "Direct from prop firms, never third-party scrapes",
  },
  {
    icon: TrendingUp,
    label: "True all-in cost",
    description: "Eval price + activation fees, surfaced upfront",
  },
  {
    icon: Sparkles,
    label: "AI recommendations",
    description: "Personalized matches based on your trading style",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.72_0.19_45/0.18),transparent)]"
      />
      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Coming soon — Milestone 1 foundation complete
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the{" "}
            <span className="text-primary">juiciest</span> prop firm deals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" disabled className="w-full gap-2 sm:w-auto">
              Compare Plans
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled
              className="w-full gap-2 sm:w-auto"
            >
              <Sparkles className="size-4" aria-hidden />
              Try AI Advisor
            </Button>
          </div>
        </div>

        <ul className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, description }) => (
            <li
              key={label}
              className="rounded-xl border border-border/60 bg-card/50 p-5 text-left shadow-sm backdrop-blur-sm"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h2 className="font-semibold">{label}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Built for futures traders.{" "}
          <Link href="/methodology" className="underline-offset-4 hover:underline">
            See our methodology
          </Link>
        </p>
      </Container>
    </section>
  );
}
