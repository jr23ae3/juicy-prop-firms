import type { DrawdownType, EvalType } from "@/generated/prisma/client";

export type SeedDiscount = {
  code: string;
  discountPct?: number;
  discountAmt?: number;
};

export type SeedPlan = {
  slug: string;
  name: string;
  accountSize: number;
  evalType: EvalType;
  evalPrice: number;
  activationFee?: number;
  profitTarget?: number;
  maxDrawdown?: number;
  drawdownType?: DrawdownType;
  profitSplit?: number;
  maxPayout?: number;
  payoutFrequency?: string;
  discount?: SeedDiscount;
};

export type SeedFirm = {
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  rankScore: number;
  rankPosition: number;
  rankingFactors: Record<string, number>;
  plans: SeedPlan[];
};

export const SEED_FIRMS: SeedFirm[] = [
  {
    slug: "lucid-trading",
    name: "Lucid Trading",
    description:
      "Top-ranked firm known for fast payouts, trader-friendly rules, and transparent pricing.",
    websiteUrl: "https://lucidtrading.com",
    rankScore: 94.2,
    rankPosition: 1,
    rankingFactors: {
      payoutSpeed: 96,
      affordability: 91,
      ruleFriendliness: 95,
      platformQuality: 92,
    },
    plans: [
      {
        slug: "50k-challenge",
        name: "50K Challenge",
        accountSize: 50000,
        evalType: "CHALLENGE",
        evalPrice: 155,
        activationFee: 0,
        profitTarget: 3000,
        maxDrawdown: 2000,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 3000,
        payoutFrequency: "Daily",
        discount: { code: "JUICY", discountPct: 0.4 },
      },
      {
        slug: "150k-challenge",
        name: "150K Challenge",
        accountSize: 150000,
        evalType: "CHALLENGE",
        evalPrice: 399,
        activationFee: 0,
        profitTarget: 9000,
        maxDrawdown: 4500,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 4500,
        payoutFrequency: "Daily",
        discount: { code: "JUICY", discountPct: 0.35 },
      },
    ],
  },
  {
    slug: "apex-trader-funding",
    name: "Apex Trader Funding",
    description:
      "Popular futures prop firm with flexible plan sizes and frequent promotional pricing.",
    websiteUrl: "https://apextraderfunding.com",
    rankScore: 88.5,
    rankPosition: 2,
    rankingFactors: {
      payoutSpeed: 88,
      affordability: 90,
      ruleFriendliness: 85,
      platformQuality: 91,
    },
    plans: [
      {
        slug: "50k-full",
        name: "50K Full",
        accountSize: 50000,
        evalType: "CHALLENGE",
        evalPrice: 167,
        activationFee: 85,
        profitTarget: 3000,
        maxDrawdown: 2500,
        drawdownType: "TRAILING",
        profitSplit: 0.9,
        maxPayout: 2500,
        payoutFrequency: "8 trading days",
        discount: { code: "JUICY", discountPct: 0.8 },
      },
      {
        slug: "100k-full",
        name: "100K Full",
        accountSize: 100000,
        evalType: "CHALLENGE",
        evalPrice: 257,
        activationFee: 85,
        profitTarget: 6000,
        maxDrawdown: 3000,
        drawdownType: "TRAILING",
        profitSplit: 0.9,
        maxPayout: 3500,
        payoutFrequency: "8 trading days",
        discount: { code: "JUICY", discountPct: 0.8 },
      },
    ],
  },
  {
    slug: "bulenox",
    name: "Bulenox",
    description:
      "Budget-friendly evaluations with option to skip eval via direct-to-funded plans.",
    websiteUrl: "https://bulenox.com",
    rankScore: 82.1,
    rankPosition: 3,
    rankingFactors: {
      payoutSpeed: 80,
      affordability: 95,
      ruleFriendliness: 78,
      platformQuality: 82,
    },
    plans: [
      {
        slug: "50k-option-1",
        name: "50K Option 1",
        accountSize: 50000,
        evalType: "CHALLENGE",
        evalPrice: 32,
        activationFee: 148,
        profitTarget: 3000,
        maxDrawdown: 2500,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 2500,
        payoutFrequency: "Bi-weekly",
        discount: { code: "JUICY", discountPct: 0.5 },
      },
      {
        slug: "50k-d2f",
        name: "50K Direct to Funded",
        accountSize: 50000,
        evalType: "DIRECT_TO_FUNDED",
        evalPrice: 299,
        activationFee: 0,
        profitTarget: 0,
        maxDrawdown: 2000,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 3000,
        payoutFrequency: "Bi-weekly",
        discount: { code: "JUICY", discountPct: 0.2 },
      },
    ],
  },
  {
    slug: "the5ers",
    name: "The5ers",
    description:
      "Established firm with day trade and swing programs across multiple account sizes.",
    websiteUrl: "https://the5ers.com",
    rankScore: 79.8,
    rankPosition: 4,
    rankingFactors: {
      payoutSpeed: 82,
      affordability: 88,
      ruleFriendliness: 76,
      platformQuality: 84,
    },
    plans: [
      {
        slug: "50k-day-trade",
        name: "50K Day Trade",
        accountSize: 50000,
        evalType: "CHALLENGE",
        evalPrice: 95,
        activationFee: 0,
        profitTarget: 3000,
        maxDrawdown: 2500,
        drawdownType: "STATIC",
        profitSplit: 0.8,
        maxPayout: 2500,
        payoutFrequency: "Monthly",
        discount: { code: "JUICY", discountPct: 0.5 },
      },
      {
        slug: "100k-day-trade",
        name: "100K Day Trade",
        accountSize: 100000,
        evalType: "CHALLENGE",
        evalPrice: 225,
        activationFee: 0,
        profitTarget: 6000,
        maxDrawdown: 4000,
        drawdownType: "STATIC",
        profitSplit: 0.8,
        maxPayout: 3500,
        payoutFrequency: "Monthly",
        discount: { code: "JUICY", discountPct: 0.45 },
      },
    ],
  },
  {
    slug: "topstep",
    name: "Topstep",
    description:
      "Industry pioneer with combine-style evaluations and a long track record.",
    websiteUrl: "https://topstep.com",
    rankScore: 77.4,
    rankPosition: 5,
    rankingFactors: {
      payoutSpeed: 75,
      affordability: 72,
      ruleFriendliness: 80,
      platformQuality: 90,
    },
    plans: [
      {
        slug: "50k-combine",
        name: "50K Trading Combine",
        accountSize: 50000,
        evalType: "CHALLENGE",
        evalPrice: 165,
        activationFee: 149,
        profitTarget: 3000,
        maxDrawdown: 2000,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 3000,
        payoutFrequency: "Weekly",
        discount: { code: "JUICY", discountAmt: 50 },
      },
      {
        slug: "100k-combine",
        name: "100K Trading Combine",
        accountSize: 100000,
        evalType: "CHALLENGE",
        evalPrice: 325,
        activationFee: 149,
        profitTarget: 6000,
        maxDrawdown: 3000,
        drawdownType: "END_OF_DAY",
        profitSplit: 0.9,
        maxPayout: 3500,
        payoutFrequency: "Weekly",
        discount: { code: "JUICY", discountAmt: 75 },
      },
    ],
  },
];
