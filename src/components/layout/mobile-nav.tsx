"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SiteBrand } from "@/components/layout/site-brand";
import { mainNav } from "@/config/navigation";
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
    <div className="md:hidden">
      <button
        type="button"
        className="site-mobile-nav-arcade inline-flex size-9 items-center justify-center text-foreground"
        aria-expanded={open}
        aria-controls="mobile-nav-dialog"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <X className="size-5" aria-hidden />
        ) : (
          <Menu className="size-5" aria-hidden />
        )}
      </button>

      <dialog
        id="mobile-nav-dialog"
        ref={dialogRef}
        aria-label="Mobile navigation"
        className="site-mobile-nav-dialog fixed inset-0 z-[60] m-0 h-full max-h-none w-full max-w-none border-0 p-0 backdrop:bg-black/80 open:flex open:flex-col"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="flex h-16 items-center justify-between border-b-2 border-primary/30 bg-[#04110a] px-4">
          <SiteBrand compact variant="arcade" />
          <button
            type="button"
            aria-label="Close menu"
            className="site-mobile-nav-arcade inline-flex size-9 items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto bg-[#0a0520] p-4"
        >
          <p className="arcade-level-num mb-4 text-[9px] text-[#ffd700]">
            ★ SELECT STAGE ★
          </p>
          <ul className="space-y-2">
            {mainNav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-link-mobile",
                      isActive && "nav-link-mobile--active",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.title.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/compare"
            className="arcade-btn arcade-btn--p1 mt-6 w-full text-[9px]"
            onClick={() => setOpen(false)}
          >
            P1 · COMPARE
          </Link>
        </nav>
      </dialog>
    </div>
  );
}
