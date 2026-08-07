import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteBrand } from "@/components/layout/site-brand";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const footerSections = [
  { title: "◆ EXPLORE ◆", links: footerNav.product },
  { title: "◆ COMPANY ◆", links: footerNav.company },
  { title: "◆ LEGAL ◆", links: footerNav.legal },
] as const;

const MARQUEE_ITEMS = [
  "THANKS FOR PLAYING",
  "HIGH SCORE RESEARCH",
  "VERIFIED PRICING",
  "BY TRADERS · FOR TRADERS",
  "CONTINUE?",
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer-arcade">
      <div className="site-footer-arcade-marquee" aria-hidden>
        <div className="site-footer-arcade-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={index} className="site-footer-arcade-marquee-text">
              ★ {item} ★
            </span>
          ))}
        </div>
      </div>

      <Container className="site-footer-arcade-inner py-12 md:py-14">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-4">
            <p className="site-footer-arcade-credits">★ PLAYER 2 READY ★</p>
            <SiteBrand variant="arcade" />
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="site-footer-arcade-dot-trail" aria-hidden>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="site-footer-arcade-section-title">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="site-footer-arcade-link"
                      >
                        ▷ {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer-arcade-bottom flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="site-footer-arcade-credits">
            © {year} {siteConfig.name.toUpperCase()}
          </p>
          <p className="max-w-lg text-xs leading-relaxed">
            Rankings and pricing verified directly with prop firms. Some links
            may be affiliate links — never influences our scores.
          </p>
        </div>
      </Container>
    </footer>
  );
}
