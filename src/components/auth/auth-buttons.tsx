import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";
import { getAuthUser } from "@/server/auth";

export async function AuthButtons() {
  const aiMatchLink = (
    <Link
      href="/advisor"
      className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
    >
      <Sparkles className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">Get AI Match</span>
      <span className="sm:hidden">AI Match</span>
    </Link>
  );

  if (!isSupabaseConfigured()) {
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
        {aiMatchLink}
      </>
    );
  }

  const user = await getAuthUser();

  if (user) {
    return (
      <>
        {aiMatchLink}
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
      {aiMatchLink}
    </>
  );
}
