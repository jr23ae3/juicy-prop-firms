export const siteConfig = {
  name: "Juicy Trade Firms",
  tagline: "Independent prop firm research",
  description:
    "AI-powered prop firm comparisons with live pricing, verified discount codes, transparent all-in costs, and unbiased rankings — built for traders who want the truth.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/juicytradefirms",
    github: "https://github.com/juicy-prop-firms",
  },
  creator: {
    name: "Juicy Trade Firms",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
} as const;

export type SiteConfig = typeof siteConfig;
