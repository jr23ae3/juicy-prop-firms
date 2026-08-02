import { ContentPage } from "@/components/layout/content-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms governing your use of Juicy Prop Firms.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Service" description="Last updated: August 2026">
      <p>
        By using Juicy Prop Firms, you agree to these terms. If you do not agree,
        please do not use our services.
      </p>
      <h2>Service description</h2>
      <p>
        Juicy Prop Firms provides prop firm comparison data, rankings, and tools
        including an AI advisor. We strive for accuracy but do not guarantee
        that all pricing or rules are current — always verify with the prop firm
        before purchasing.
      </p>
      <h2>Not financial advice</h2>
      <p>
        Nothing on this site constitutes financial, investment, or trading advice.
        Prop trading involves substantial risk. You are solely responsible for
        your trading decisions.
      </p>
      <h2>Accounts & subscriptions</h2>
      <ul>
        <li>You must provide accurate account information</li>
        <li>Juicy Pro subscriptions renew per Stripe billing terms</li>
        <li>We may suspend accounts that violate these terms</li>
      </ul>
      <h2>Intellectual property</h2>
      <p>
        Site content, rankings methodology, and branding are owned by Juicy Prop
        Firms. You may not scrape, redistribute, or resell our data without
        permission.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        Juicy Prop Firms is provided &quot;as is.&quot; We are not liable for losses
        arising from reliance on our data, tool outages, or third-party prop
        firm actions.
      </p>
    </ContentPage>
  );
}
