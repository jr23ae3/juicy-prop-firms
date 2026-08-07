import { ContentPage } from "@/components/layout/content-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Juicy Trade Firms — independent futures prop firm comparisons with verified pricing and transparent rankings.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="About Juicy Trade Firms"
      description="Independent prop firm research built for futures traders."
    >
      <p>
        Juicy Trade Firms helps traders compare futures prop firms with clarity.
        We verify pricing directly with firms, surface true all-in costs, and
        publish rankings that no one can buy their way onto.
      </p>
      <h2>Our mission</h2>
      <p>
        Prop firm marketing is noisy. Hidden activation fees, confusing eval
        rules, and outdated discount codes waste traders&apos; time and money. We
        built Juicy Trade Firms to cut through the noise with verified data and
        tools that help you find the best fit for your trading style.
      </p>
      <h2>What we verify</h2>
      <ul>
        <li>Eval and activation pricing</li>
        <li>Active discount codes</li>
        <li>Payout terms and profit splits</li>
        <li>Drawdown rules and platform availability</li>
      </ul>
      <h2>Independence</h2>
      <p>
        Some links on this site are affiliate links. We never let affiliate
        relationships influence our rankings or recommendations. Read our{" "}
        <a href="/affiliate-disclosure" className="text-primary hover:underline">
          affiliate disclosure
        </a>{" "}
        for details.
      </p>
    </ContentPage>
  );
}
