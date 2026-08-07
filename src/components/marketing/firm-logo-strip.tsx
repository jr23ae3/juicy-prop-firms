import Link from "next/link";

import { FirmLogo } from "@/components/ui/firm-logo";
import type { FeaturedFirm } from "@/server/data/plans";

type FirmLogoStripProps = {
  firms: FeaturedFirm[];
};

export function FirmLogoStrip({ firms }: FirmLogoStripProps) {
  if (firms.length === 0) return null;

  return (
    <section aria-label="Tracked prop firms" className="mt-16 border-t border-border pt-10">
      <p className="section-label mb-5">Firms in the catalog</p>
      <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {firms.map((firm) => (
          <li key={firm.slug} className="shrink-0">
            <Link
              href={`/firms/${firm.slug}`}
              className="surface flex items-center gap-3 px-3 py-2 transition-colors hover:border-primary/40"
              title={firm.name}
            >
              <FirmLogo
                name={firm.name}
                slug={firm.slug}
                logoUrl={firm.logoUrl}
                size="sm"
              />
              <span className="max-w-[8rem] truncate text-sm text-foreground/90">
                {firm.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
