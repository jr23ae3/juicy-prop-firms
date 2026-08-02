import { Container } from "@/components/layout/container";

type ContentPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ContentPage({ title, description, children }: ContentPageProps) {
  return (
    <Container className="py-12 md:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 space-y-3 border-b border-border/60 pb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="text-lg text-muted-foreground">{description}</p>
          ) : null}
        </header>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:not-first:mt-8 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-4 [&_strong]:text-foreground [&_ul]:space-y-2">
          {children}
        </div>
      </article>
    </Container>
  );
}
