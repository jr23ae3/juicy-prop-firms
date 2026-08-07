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
    title: "AI Advisor",
    href: "/advisor",
    description: "Get personalized firm recommendations",
  },
  {
    title: "Skills Test",
    href: "/skills-test",
    description: "Replay today's NQ, MNQ, ES, and MES session",
  },
];

export const footerNav = {
  product: [
    { title: "Compare Plans", href: "/compare" },
    { title: "AI Advisor", href: "/advisor" },
    { title: "Skills Test", href: "/skills-test" },
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
