import type { PlanSummary } from "@/types/plan";

import { siteConfig } from "@/config/site";
import { formatAccountSize, formatCurrency } from "@/lib/format";

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr><td style="background:#ea580c;padding:24px 28px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">${siteConfig.name}</p>
        </td></tr>
        <tr><td style="padding:28px;">${content}</td></tr>
        <tr><td style="padding:16px 28px 24px;border-top:1px solid #e4e4e7;">
          <p style="margin:0;font-size:12px;color:#71717a;">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail(name: string | null) {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return {
    subject: `Welcome to ${siteConfig.name}`,
    html: emailLayout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#18181b;">Welcome aboard!</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">${greeting}</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
        You're all set to compare futures prop firms with verified pricing, discount codes, and transparent all-in costs.
      </p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;">
        Start with the comparison table or try our AI Advisor for personalized matches.
      </p>
      <a href="${siteConfig.url}/compare" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">Compare plans</a>
    `),
  };
}

export function buildSubscriptionConfirmationEmail(name: string | null) {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return {
    subject: `Your ${siteConfig.name} Pro subscription is active`,
    html: emailLayout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#18181b;">You're now Juicy Pro!</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">${greeting}</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
        Your subscription is active. You now have full access to:
      </p>
      <ul style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.8;color:#3f3f46;">
        <li>Full AI Advisor (top 3 matches)</li>
        <li>Unlimited saved plans</li>
        <li>Deal alert emails</li>
        <li>Ranking factor breakdowns</li>
      </ul>
      <a href="${siteConfig.url}/account" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">Manage account</a>
    `),
  };
}

type DealAlertEmailParams = {
  alertLabel: string;
  plan: PlanSummary;
  maxAllIn: number | null;
};

export function buildDealAlertEmail({
  alertLabel,
  plan,
  maxAllIn,
}: DealAlertEmailParams) {
  const discountCode = plan.discount?.code;
  const compareUrl = `${siteConfig.url}/compare?firm=${plan.firm.slug}`;

  return {
    subject: `Deal alert: ${alertLabel} — ${formatCurrency(plan.pricing.allInCost)} all-in`,
    html: emailLayout(`
      <h1 style="margin:0 0 12px;font-size:22px;color:#18181b;">Price drop alert</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
        A plan you're watching hit your target price${maxAllIn != null ? ` (under ${formatCurrency(maxAllIn)})` : ""}.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#fafafa;border-radius:8px;border:1px solid #e4e4e7;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 4px;font-size:13px;color:#71717a;">${plan.firm.name}</p>
          <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#18181b;">${plan.name}</p>
          <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">${formatAccountSize(plan.accountSize)} · ${plan.evalType.replace(/_/g, " ")}</p>
          <p style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ea580c;">${formatCurrency(plan.pricing.allInCost)} <span style="font-size:13px;font-weight:400;color:#71717a;">all-in</span></p>
          ${discountCode ? `<p style="margin:8px 0 0;font-size:14px;color:#3f3f46;">Code: <strong>${discountCode}</strong></p>` : ""}
        </td></tr>
      </table>
      <a href="${compareUrl}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">View in compare table</a>
    `),
  };
}
