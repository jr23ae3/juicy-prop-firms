export type NavItem = {
  title: string;
  href: string;
  description?: string;
  shortTitle?: string;
  disabled?: boolean;
};

export const mainNav: NavItem[] = [
  {
    title: "Tape Quest",
    shortTitle: "Play",
    href: "/skills-test",
    description: "Daily 1M futures arcade with missions and leaderboard",
  },
  {
    title: "Compare",
    href: "/compare",
    description: "Side-by-side plan comparison with live pricing",
  },
  {
    title: "AI Advisor",
    shortTitle: "Advisor",
    href: "/advisor",
    description: "Get personalized firm recommendations",
  },
  {
    title: "ROI Calculator",
    shortTitle: "ROI",
    href: "/roi-calculator",
    description: "Estimate break-even and ROI on prop firm plans",
  },
];

export const footerNav = {
  product: [
    { title: "Tape Quest", href: "/skills-test" },
    { title: "Compare Plans", href: "/compare" },
    { title: "AI Advisor", href: "/advisor" },
    { title: "ROI Calculator", href: "/roi-calculator" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
} as const;
