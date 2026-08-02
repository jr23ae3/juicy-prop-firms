"use client";

import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className={cn(buttonVariants())} onClick={reset}>
          Try again
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </Container>
  );
}
