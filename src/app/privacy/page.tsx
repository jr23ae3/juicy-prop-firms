import { ContentPage } from "@/components/layout/content-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How Juicy Trade Firms collects, uses, and protects your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" description="Last updated: August 2026">
      <p>
        Juicy Trade Firms (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
        explains what data we collect and how we use it when you use our website
        and services.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> email, name, and profile info from
          Supabase Auth when you sign up
        </li>
        <li>
          <strong>Usage data:</strong> pages visited, features used, and
          anonymized analytics via Vercel Analytics
        </li>
        <li>
          <strong>Preferences:</strong> saved plans, deal alerts, and advisor
          inputs you choose to store
        </li>
        <li>
          <strong>Payment data:</strong> processed by Stripe — we do not store
          card numbers
        </li>
      </ul>
      <h2>How we use your data</h2>
      <ul>
        <li>Provide and improve our comparison and recommendation tools</li>
        <li>Send transactional emails (welcome, subscription, deal alerts)</li>
        <li>Process subscriptions and manage your account</li>
      </ul>
      <h2>Third-party services</h2>
      <p>
        We use Supabase (auth), Stripe (payments), Resend (email), OpenAI (AI
        advisor), and Vercel (hosting). Each provider has its own privacy
        policy governing how they handle data.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your account data by
        contacting us. You can manage email preferences in your account
        settings.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Reach us via the{" "}
        <a href="/contact" className="text-primary hover:underline">
          contact page
        </a>
        .
      </p>
    </ContentPage>
  );
}
