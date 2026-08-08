export const siteConfig = {
  name: "Juicy Trades",
  tagline: "Tape Quest futures training arcade",
  description:
    "Train on a daily 1-minute futures replay arcade — mark entries, run missions, chase the global leaderboard, then compare prop firms with live pricing when you are ready to fund.",
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
