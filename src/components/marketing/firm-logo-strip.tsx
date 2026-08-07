import Link from "next/link";

import { FirmLogo } from "@/components/ui/firm-logo";
import type { FeaturedFirm } from "@/server/data/plans";

type FirmLogoStripProps = {
  firms: FeaturedFirm[];
};

export function FirmLogoStrip({ firms }: FirmLogoStripProps) {
  if (firms.length === 0) return null;

  return (
    <section aria-label="Tracked prop firms" className="mt-20 border-t border-border pt-12">
      <p className="section-label mb-6">Trusted firms in the catalog</p>
      <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {firms.map((firm) => (
          <li key={firm.slug} className="shrink-0">
            <Link
              href={`/firms/${firm.slug}`}
              className="surface flex items-center gap-3 px-4 py-3 transition-colors hover:border-white/20 hover:bg-[#242426]"
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
