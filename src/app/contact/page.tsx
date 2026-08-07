import Link from "next/link";

import { ContentPage } from "@/components/layout/content-page";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Get in touch with the Juicy Trade Firms team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      description="Questions, corrections, or partnership inquiries."
    >
      <p>
        We welcome feedback from traders and prop firms. For pricing corrections,
        ranking disputes, or general questions, reach out through the channels
        below.
      </p>
      <h2>Email</h2>
      <p>
        <a
          href="mailto:hello@juicytradefirms.com"
          className="text-primary hover:underline"
        >
          hello@juicytradefirms.com
        </a>
      </p>
      <h2>Data corrections</h2>
      <p>
        Found outdated pricing or an incorrect discount code? Include the firm
        name, plan, and a link to the current pricing page. We aim to verify
        corrections within 48 hours.
      </p>
      <h2>Social</h2>
      <p>
        Follow us on{" "}
        <a
          href={siteConfig.links.twitter}
          className="text-primary hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter / X
        </a>
        .
      </p>
      <div className="pt-4">
        <Link href="/compare" className={cn(buttonVariants())}>
          Compare plans
        </Link>
      </div>
    </ContentPage>
  );
}
