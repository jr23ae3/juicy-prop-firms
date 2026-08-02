import Link from "next/link";

import { CreateFirmForm } from "@/components/admin/create-firm-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminNewFirmPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/firms"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        ← All firms
      </Link>
      <CreateFirmForm />
    </div>
  );
}
