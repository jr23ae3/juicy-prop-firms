import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  FirmHeader,
  FirmRankingSection,
} from "@/components/firms/firm-header";
import { FirmPlansSection } from "@/components/firms/firm-plans-section";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { getActiveFirmSlugs } from "@/services/firm-service";
import { loadFirmPageData } from "@/server/data/firms";

type FirmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getActiveFirmSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: FirmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadFirmPageData(slug);

  if (!data) {
    return { title: "Firm not found" };
  }

  const title = `${data.firm.name} Review & Plans`;
  const description =
    data.firm.description ??
    `Compare ${data.firm.name} prop firm plans with verified pricing and all-in costs on ${siteConfig.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { slug } = await params;
  const data = await loadFirmPageData(slug);

  if (!data) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.firm.name,
    description: data.firm.description,
    url: data.firm.websiteUrl ?? `${siteConfig.url}/firms/${data.firm.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="space-y-8 py-8 md:py-12">
        <FirmHeader data={data} />
        <FirmRankingSection ranking={data.ranking} />
        <FirmPlansSection
          firmSlug={data.firm.slug}
          firmName={data.firm.name}
          plans={data.plans}
        />
      </Container>
    </>
  );
}
