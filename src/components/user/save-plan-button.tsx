"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useSavedPlanIds } from "@/hooks/use-saved-plans";
import { useToggleSavePlan } from "@/hooks/use-toggle-save-plan";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

type SavePlanButtonProps = {
  planId: string;
  size?: "sm" | "default";
  className?: string;
};

export function SavePlanButton({
  planId,
  size = "sm",
  className,
}: SavePlanButtonProps) {
  const pathname = usePathname();
  const { data: user } = useUser();
  const { data: savedPlanIds = [] } = useSavedPlanIds(Boolean(user));
  const toggleSave = useToggleSavePlan();

  const isSaved = savedPlanIds.includes(planId);

  if (!user) {
    const redirectTo = encodeURIComponent(pathname);
    return (
      <Link
        href={`/login?redirectTo=${redirectTo}`}
        aria-label="Sign in to save plan"
        className={cn(buttonVariants({ variant: "ghost", size }), className)}
      >
        <Bookmark className="size-4" aria-hidden />
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={cn(className, isSaved && "text-primary")}
      disabled={toggleSave.isPending}
      aria-label={isSaved ? "Remove saved plan" : "Save plan"}
      aria-pressed={isSaved}
      onClick={() => {
        toggleSave.mutate(
          { planId, isSaved },
          {
            onError: (err) => {
          if (err.message === "UNAUTHORIZED") {
            window.location.href = `/login?redirectTo=${encodeURIComponent(pathname)}`;
            return;
          }
          if (err.message === "PREMIUM_REQUIRED") {
            window.location.href = "/pricing";
          }
        },
          },
        );
      }}
    >
      <Bookmark
        className={cn("size-4", isSaved && "fill-current")}
        aria-hidden
      />
    </Button>
  );
}
