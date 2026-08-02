import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {params.error ? (
        <p
          role="alert"
          className="w-full max-w-md rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          Authentication failed. Please try again.
        </p>
      ) : null}
      <LoginForm redirectTo={params.redirectTo} />
    </div>
  );
}
