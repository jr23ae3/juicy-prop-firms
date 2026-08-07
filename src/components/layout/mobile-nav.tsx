"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SiteBrand } from "@/components/layout/site-brand";
import { mainNav } from "@/config/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex size-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 bg-transparent"
        aria-expanded={open}
        aria-controls="mobile-nav-dialog"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="block h-px w-5 bg-white" />
        <span className="block h-px w-5 bg-white" />
        <span className="block h-px w-5 bg-white" />
      </button>

      <dialog
        id="mobile-nav-dialog"
        ref={dialogRef}
        aria-label="Mobile navigation"
        className="fixed inset-0 z-[60] m-0 h-full max-h-none w-full max-w-none border-0 bg-black p-0 backdrop:bg-black/80 open:flex open:flex-col"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <SiteBrand compact />
          <button
            type="button"
            aria-label="Close menu"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/15"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 pb-8">
          <ul className="space-y-2">
            {mainNav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3 text-3xl font-medium tracking-[-0.03em] transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-white/70 hover:text-white",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/compare"
            className={cn(buttonVariants({ size: "lg" }), "mt-10 w-full")}
            onClick={() => setOpen(false)}
          >
            Compare now
          </Link>
        </nav>
      </dialog>
    </div>
  );
}
