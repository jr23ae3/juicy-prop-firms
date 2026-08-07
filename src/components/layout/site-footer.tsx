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
    <footer className="mt-auto border-t border-border bg-black">
      <Container size="wide" className="py-16 md:py-20">
        <div className="mb-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-4">
            <SiteBrand />
            <p className="max-w-md text-base leading-relaxed tracking-[-0.02em] text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <Link
            href="/compare"
            className="bf-btn bf-btn-primary w-fit"
          >
            Start comparing
          </Link>
        </div>

        <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="section-label">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p>© {year} {siteConfig.name}</p>
          <p className="max-w-lg text-xs leading-relaxed tracking-[-0.01em]">
            Rankings and pricing verified directly with prop firms. Some links
            may be affiliate links — never influences our scores.
          </p>
        </div>
      </Container>
    </footer>
  );
}
