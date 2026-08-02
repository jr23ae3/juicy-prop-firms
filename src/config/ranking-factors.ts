/** Human-readable labels for ranking factor keys stored in JSON */
export const RANKING_FACTOR_LABELS: Record<string, string> = {
  payoutSpeed: "Payout speed & reliability",
  affordability: "Affordability (all-in cost)",
  ruleFriendliness: "Trader-friendly rules",
  platformQuality: "Platform & tooling",
};

export function getRankingFactorLabel(key: string): string {
  return RANKING_FACTOR_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").trim();
}

export const RANKING_METHODOLOGY_POINTS = [
  {
    title: "Verified directly with firms",
    description:
      "Every price, rule, and discount code is checked against the prop firm's own website and terms — never third-party scrapes.",
  },
  {
    title: "True all-in cost",
    description:
      "Affordability weighs discounted eval price plus activation fees, so cheap evals with hidden fees don't inflate scores.",
  },
  {
    title: "Payout reliability",
    description:
      "We track how fast payouts arrive, how large they run, and whether traders consistently reach live funding.",
  },
  {
    title: "Trader-friendly rules",
    description:
      "Drawdown types, consistency rules, and plan changes that hurt traders reduce a firm's score over time.",
  },
  {
    title: "No pay-for-placement",
    description:
      "Firms cannot buy a higher rank. Affiliate relationships never influence position on this list.",
  },
] as const;
