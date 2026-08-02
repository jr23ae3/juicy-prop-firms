import { HeroSection } from "@/components/marketing/hero-section";
import { loadPlatformStats } from "@/server/data/plans";

export default async function HomePage() {
  const statsResult = await loadPlatformStats();
  const stats = statsResult.success ? statsResult.data : undefined;

  return <HeroSection stats={stats} />;
}
