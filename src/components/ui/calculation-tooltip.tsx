"use client";

import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type CalculationTooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CalculationTooltip({
  content,
  children,
  className,
}: CalculationTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const show = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        className={cn(
          "cursor-help border-b border-dotted border-muted-foreground/50",
          className,
        )}
      >
        {children}
      </span>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="tooltip"
              style={{
                top: position.top,
                left: position.left,
                transform: "translateX(-50%)",
              }}
              className="pointer-events-none fixed z-[100] w-max max-w-[min(20rem,calc(100vw-2rem))] rounded-md border border-border/60 bg-popover px-3 py-2 text-left text-xs text-popover-foreground shadow-lg"
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function CalculationTooltipBody({
  title,
  expression,
  note,
}: {
  title: string;
  expression: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      <p className="tabular-nums text-muted-foreground">{expression}</p>
      {note ? <p className="text-muted-foreground/80">{note}</p> : null}
    </div>
  );
}
