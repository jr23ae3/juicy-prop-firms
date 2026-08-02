import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";
import { getAuthUser } from "@/server/auth";

export async function AuthButtons() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex" disabled>
          Sign in
        </Button>
        <Button size="sm" disabled className="gap-1.5">
          <Sparkles className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Get AI Match</span>
          <span className="sm:hidden">AI Match</span>
        </Button>
      </>
    );
  }

  const user = await getAuthUser();

  if (user) {
    return (
      <>
        <Link
          href="/account"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Account
        </Link>
        <SignOutButton />
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hidden sm:inline-flex",
        )}
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
      >
        <Sparkles className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Get started</span>
        <span className="sm:hidden">Start</span>
      </Link>
    </>
  );
}
