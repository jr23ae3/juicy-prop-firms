import Link from "next/link";

import { Container } from "@/components/layout/container";
import { TerminalPanel } from "@/components/layout/terminal-panel";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const highlights = [
  {
    label: "Verified pricing",
    description:
      "Pulled directly from each firm — never scraped from aggregators.",
  },
  {
    label: "True all-in cost",
    description:
      "Eval price plus activation fees, shown before you click out.",
  },
  {
    label: "AI matching",
    description:
      "Plan recommendations shaped to how you actually trade.",
  },
] as const;

type HeroSectionProps = {
  stats?: {
    firms: number;
    plans: number;
    lowestAllIn: number | null;
  };
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HeroSection({ stats }: HeroSectionProps) {
  const hasStats = stats && stats.plans > 0;

  return (
    <section className="site-canvas border-b border-border">
      <Container className="py-16 sm:py-20 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="page-eyebrow">Independent prop firm research</p>
            <h1 className="page-title mt-5 max-w-3xl">
              No affiliate noise.
              <br />
              Just the highest-signal prop firm data you&apos;ll find.
            </h1>
            <p className="page-lead mt-6 max-w-xl">{siteConfig.description}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compare"
                className={cn(buttonVariants({ size: "lg" }), "cta-arrow w-full sm:w-auto")}
              >
                Compare now
              </Link>
              <Link
                href="/advisor"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                Try AI advisor
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <TerminalPanel>
              {hasStats ? (
                <>
                  <p>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-cmd">firms --count</span>
                  </p>
                  <p className="terminal-output pl-4">
                    → {stats.firms} firms indexed
                  </p>
                  <p className="pt-2">
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-cmd">plans --list</span>
                  </p>
                  <p className="terminal-output pl-4">
                    → {stats.plans} plans tracked
                  </p>
                  {stats.lowestAllIn != null ? (
                    <>
                      <p className="pt-2">
                        <span className="terminal-prompt">$</span>{" "}
                        <span className="terminal-cmd">pricing --min --all-in</span>
                      </p>
                      <p className="terminal-output pl-4">
                        → {formatCurrency(stats.lowestAllIn)}
                      </p>
                    </>
                  ) : null}
                  <p className="terminal-muted pt-4 text-xs">
                    try:{" "}
                    <span className="text-foreground/80">compare</span>{" "}
                    <span className="text-foreground/80">advisor</span>{" "}
                    <span className="text-foreground/80">rankings</span>{" "}
                    <span className="text-foreground/80">methodology</span>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-cmd">db --seed</span>
                  </p>
                  <p className="terminal-muted pl-4">
                    → run npm run db:seed to load catalog
                  </p>
                </>
              )}
            </TerminalPanel>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-12">
          <p className="section-label mb-8">What you get</p>
          <ul className="grid gap-10 sm:grid-cols-3">
            {highlights.map(({ label, description }) => (
              <li key={label} className="space-y-2">
                <h2 className="text-lg font-normal text-foreground">{label}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 font-mono text-xs text-muted-foreground">
          Built for futures traders.{" "}
          <Link href="/methodology" className="text-accent hover:underline">
            How we verify data
          </Link>
        </p>
      </Container>
    </section>
  );
}
