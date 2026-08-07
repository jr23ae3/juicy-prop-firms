"use client";

import Link from "next/link";

import { FirmLogo } from "@/components/ui/firm-logo";
import type { FeaturedFirm } from "@/server/data/plans";

type ArcadeFirmMarqueeProps = {
  firms: FeaturedFirm[];
};

export function ArcadeFirmMarquee({ firms }: ArcadeFirmMarqueeProps) {
  if (firms.length === 0) return null;

  const items = [...firms, ...firms];

  return (
    <section aria-label="Featured prop firms" className="mt-14">
      <p className="arcade-level-num mb-3 text-center">★ BONUS STAGE — FIRM SELECT ★</p>
      <div className="arcade-marquee-wrap">
        <ul className="arcade-marquee-track">
          {items.map((firm, index) => (
            <li key={`${firm.slug}-${index}`}>
              <Link
                href={`/firms/${firm.slug}`}
                className="arcade-pixel-border flex items-center gap-2 px-3 py-2 transition-colors hover:border-accent/50"
                title={firm.name}
              >
                <FirmLogo
                  name={firm.name}
                  slug={firm.slug}
                  logoUrl={firm.logoUrl}
                  size="sm"
                />
                <span className="arcade-level-title whitespace-nowrap">{firm.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
