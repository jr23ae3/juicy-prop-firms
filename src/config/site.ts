export const siteConfig = {
  name: "Juicy Prop Firms",
  tagline: "Compare futures prop firms with clarity",
  description:
    "AI-powered prop firm comparisons with live pricing, verified discount codes, transparent all-in costs, and unbiased rankings — built for traders who want the truth.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/juicypropfirms",
    github: "https://github.com/juicy-prop-firms",
  },
  creator: {
    name: "Juicy Prop Firms",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
} as const;

export type SiteConfig = typeof siteConfig;
