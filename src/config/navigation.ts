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
    title: "Juice Index",
    href: "/rankings",
    description: "Independent firm scores based on verified data",
  },
  {
    title: "AI Advisor",
    href: "/advisor",
    description: "Get personalized firm recommendations",
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Free vs Juicy Pro plans",
  },
  {
    title: "How We Rank",
    href: "/methodology",
    description: "Our verification and ranking methodology",
  },
];

export const footerNav = {
  product: [
    { title: "Compare Plans", href: "/compare" },
    { title: "Juice Index", href: "/rankings" },
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
