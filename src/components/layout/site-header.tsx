import { AuthButtons } from "@/components/auth/auth-buttons";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteBrand } from "@/components/layout/site-brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
      <Container className="flex h-[4.25rem] items-center justify-between gap-4">
        <div className="flex items-center gap-10">
          <SiteBrand />
          <MainNav />
        </div>

        <div className="flex items-center gap-2">
          <MobileNav />
          <AuthButtons />
        </div>
      </Container>
    </header>
  );
}
