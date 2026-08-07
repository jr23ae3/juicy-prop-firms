import { ContentPage } from "@/components/layout/content-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Affiliate Disclosure",
  description:
    "How affiliate relationships work at Juicy Prop Firms and why they never affect our rankings.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <ContentPage
      title="Affiliate Disclosure"
      description="Transparency about how we earn revenue."
    >
      <p>
        Juicy Prop Firms participates in affiliate programs with some prop firms.
        When you use our discount codes or sign up through our links, we may
        earn a commission at no extra cost to you.
      </p>
      <h2>Rankings are independent</h2>
      <p>
        Affiliate relationships never influence our Juice Index scores, AI advisor
        recommendations, or compare table sort order. Firms cannot pay for
        placement. Our methodology is published openly on the{" "}
        <a href="/methodology" className="text-primary hover:underline">
          methodology page
        </a>
        .
      </p>
      <h2>Why we use affiliate links</h2>
      <p>
        Affiliate revenue helps us maintain verified pricing data, run servers,
        and build tools like the AI advisor — without charging traders for basic
        comparisons.
      </p>
      <h2>Verified discount codes</h2>
      <p>
        We only display discount codes we have verified directly with prop firms.
        Codes shown on Juicy Prop Firms are tested regularly and marked with
        verification dates in our compare table.
      </p>
    </ContentPage>
  );
}
