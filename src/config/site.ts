export const siteConfig = {
  name: "Juicy Trades",
  tagline: "Independent prop firm research",
  description:
    "AI-powered prop firm comparisons with live pricing, verified discount codes, transparent all-in costs, and unbiased rankings — built for traders who want the truth.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.svg",
  links: {
    twitter: "https://twitter.com/juicytrades",
    github: "https://github.com/juicy-prop-firms",
  },
  creator: {
    name: "Juicy Trades",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
} as const;

export type SiteConfig = typeof siteConfig;
