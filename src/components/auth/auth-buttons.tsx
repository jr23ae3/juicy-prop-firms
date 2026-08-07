import Link from "next/link";

import { ArcadeAdvisorCharacter } from "@/components/marketing/arcade-advisor-character";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";
import { getAuthUser } from "@/server/auth";

type AuthButtonsProps = {
  variant?: "default" | "header";
};

export async function AuthButtons({ variant = "default" }: AuthButtonsProps) {
  const isHeader = variant === "header";

  const aiMatchLink = (
    <Link
      href="/advisor"
      className={cn(
        "arcade-btn arcade-btn--p2 hidden min-w-0 gap-1.5 text-[8px] sm:inline-flex sm:text-[9px]",
        isHeader && "lg:hidden",
      )}
    >
      <ArcadeAdvisorCharacter size="xs" animate={false} />
      <span className="hidden sm:inline">ORACLE OJ</span>
      <span className="sm:hidden">OJ</span>
    </Link>
  );

  const signInLink = (
    <Link
      href="/login"
      className="arcade-btn arcade-btn--p2 hidden min-w-0 text-[8px] sm:inline-flex sm:text-[9px]"
    >
      SIGN IN
    </Link>
  );

  const accountLink = (
    <Link
      href="/account"
      className="arcade-btn arcade-btn--p2 min-w-0 text-[8px] sm:text-[9px]"
    >
      ACCOUNT
    </Link>
  );

  if (!isSupabaseConfigured()) {
    return (
      <>
        {signInLink}
        {aiMatchLink}
      </>
    );
  }

  const user = await getAuthUser();

  if (user) {
    return (
      <>
        {aiMatchLink}
        {accountLink}
        <SignOutButton />
      </>
    );
  }

  return (
    <>
      {signInLink}
      {aiMatchLink}
    </>
  );
}
