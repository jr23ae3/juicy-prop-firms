import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FirmNotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold">Firm not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This prop firm doesn&apos;t exist or is no longer listed on Juicy Trades.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/compare" className={cn(buttonVariants(), "cta-arrow")}>
          Compare plans
        </Link>
      </div>
    </Container>
  );
}
