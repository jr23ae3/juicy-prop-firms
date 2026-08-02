export type NavItem = {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
};

export const mainNav: NavItem[] = [
  {
    title: "Compare",
    href: "/compare",
    description: "Side-by-side plan comparison with live pricing",
  },
  {
    title: "Rankings",
    href: "/rankings",
    description: "Power rankings based on verified data",
    disabled: true,
  },
  {
    title: "AI Advisor",
    href: "/advisor",
    description: "Get personalized firm recommendations",
    disabled: true,
  },
  {
    title: "How We Rank",
    href: "/methodology",
    description: "Our verification and ranking methodology",
    disabled: true,
  },
];

export const footerNav = {
  product: [
    { title: "Compare Plans", href: "/compare" },
    { title: "Rankings", href: "/rankings" },
    { title: "AI Advisor", href: "/advisor" },
    { title: "ROI Calculator", href: "/roi-calculator" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Methodology", href: "/methodology" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
} as const;
