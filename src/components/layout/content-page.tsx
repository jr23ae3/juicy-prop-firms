import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

type ContentPageProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export function ContentPage({
  title,
  description,
  eyebrow,
  children,
}: ContentPageProps) {
  return (
    <Container className="site-canvas py-12 md:py-16">
      <article className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:not-first:mt-8 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-4 [&_strong]:text-foreground [&_ul]:space-y-2">
          {children}
        </div>
      </article>
    </Container>
  );
}
