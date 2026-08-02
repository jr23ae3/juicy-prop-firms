import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const footerSections = [
  { title: "Product", links: footerNav.product },
  { title: "Company", links: footerNav.company },
  { title: "Legal", links: footerNav.legal },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold">
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                J
              </span>
              {siteConfig.name}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="max-w-md text-xs leading-relaxed">
            Rankings and pricing are verified directly with prop firms. Some links
            may be affiliate links — we never let that influence our rankings.
          </p>
        </div>
      </Container>
    </footer>
  );
}
