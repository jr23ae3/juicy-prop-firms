import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteBrand } from "@/components/layout/site-brand";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const footerSections = [
  { title: "Explore", links: footerNav.product },
  { title: "Company", links: footerNav.company },
  { title: "Legal", links: footerNav.legal },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-foreground text-background/85">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <SiteBrand invert />
            <p className="max-w-sm text-sm leading-relaxed text-background/70">
              {siteConfig.description}
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-background/50">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/75 transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-8 text-sm text-background/60 sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <p className="max-w-lg text-xs leading-relaxed">
            Rankings and pricing are verified directly with prop firms. Some
            links may be affiliate links — we never let that influence our
            rankings.
          </p>
        </div>
      </Container>
    </footer>
  );
}
