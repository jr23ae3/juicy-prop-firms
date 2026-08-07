import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const highlights = [
  {
    label: "Verified pricing",
    description: "Pulled directly from each firm — never scraped from aggregators.",
  },
  {
    label: "True all-in cost",
    description: "Eval price plus activation fees, shown before you click out.",
  },
  {
    label: "AI matching",
    description: "Get plan recommendations shaped to how you actually trade.",
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
    <section className="site-canvas border-b border-border/60">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="page-eyebrow">Independent prop firm research</p>
            <h1 className="page-title mt-4 max-w-2xl lg:text-5xl xl:text-[3.25rem]">
              Cut through the noise.{" "}
              <span className="text-primary">Find the deal.</span>
            </h1>
            <p className="page-lead mt-6 max-w-xl text-base sm:text-lg">
              {siteConfig.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compare"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full gap-2 rounded-full sm:w-auto",
                )}
              >
                Open comparison
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/advisor"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-full sm:w-auto",
                )}
              >
                Try AI advisor
              </Link>
            </div>
          </div>

          <aside className="surface lg:col-span-5 lg:col-start-8">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Live catalog
              </p>
              {hasStats ? (
                <dl className="mt-6 space-y-5">
                  <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-5">
                    <dt className="text-sm text-muted-foreground">Plans tracked</dt>
                    <dd className="font-heading text-3xl font-semibold tabular-nums">
                      {stats.plans}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-5">
                    <dt className="text-sm text-muted-foreground">Firms covered</dt>
                    <dd className="font-heading text-3xl font-semibold tabular-nums">
                      {stats.firms}
                    </dd>
                  </div>
                  {stats.lowestAllIn != null ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-muted-foreground">
                        Lowest all-in
                      </dt>
                      <dd className="font-heading text-3xl font-semibold text-primary tabular-nums">
                        {formatCurrency(stats.lowestAllIn)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Run{" "}
                  <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                    npm run db:seed
                  </code>{" "}
                  to load sample firm data.
                </p>
              )}
            </div>
          </aside>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-border/60 pt-12 sm:grid-cols-3">
          {highlights.map(({ label, description }) => (
            <li key={label} className="space-y-2">
              <h2 className="font-heading text-lg font-semibold">{label}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-muted-foreground">
          Built for futures traders.{" "}
          <Link
            href="/methodology"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            How we verify data
          </Link>
        </p>
      </Container>
    </section>
  );
}
