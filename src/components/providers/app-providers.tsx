import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { QueryProvider } from "@/components/providers/query-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <Analytics />
      <SpeedInsights />
    </QueryProvider>
  );
}
