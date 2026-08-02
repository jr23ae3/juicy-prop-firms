import { HeroSection } from "@/components/marketing/hero-section";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  JsonLdScript,
} from "@/lib/seo/metadata";
import { loadPlatformStats } from "@/server/data/plans";

export const revalidate = 3600;

export default async function HomePage() {
  const statsResult = await loadPlatformStats();
  const stats = statsResult.success ? statsResult.data : undefined;

  return (
    <>
      <JsonLdScript data={createWebsiteJsonLd()} />
      <JsonLdScript data={createOrganizationJsonLd()} />
      <HeroSection stats={stats} />
    </>
  );
}
