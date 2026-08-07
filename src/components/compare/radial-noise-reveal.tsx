"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  buildCodropsMaskUrl,
  easeQuadOut,
} from "@/lib/noise/radial-noise-shader";
import { cn } from "@/lib/utils";

type RadialNoiseRevealProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const DURATION_MS = 1000;

export function RadialNoiseReveal({
  open,
  onOpenChange,
  front,
  back,
  className,
  ariaLabel,
}: RadialNoiseRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const [renderBack, setRenderBack] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(
    (toOpen: boolean, origin: { x: number; y: number }) => {
      const container = containerRef.current;
      if (!container) return;

      setRenderBack(true);
      setIsAnimating(true);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        setMaskUrl(null);
        setIsAnimating(false);
        onOpenChange(toOpen);
        if (!toOpen) setRenderBack(false);
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      const from = toOpen ? 0 : 1;
      const to = toOpen ? 1 : 0;
      startTimeRef.current = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const t = Math.min(elapsed / DURATION_MS, 1);
        const eased = easeQuadOut(t);
        const progress = from + (to - from) * eased;
        const time = elapsed * 0.001;

        const url = buildCodropsMaskUrl(
          width,
          height,
          origin.x,
          origin.y,
          progress,
          time,
        );
        setMaskUrl(url);

        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }

        setMaskUrl(null);
        setIsAnimating(false);
        onOpenChange(toOpen);
        if (!toOpen) setRenderBack(false);
      };

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(tick);
    },
    [onOpenChange],
  );

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open && maskUrl === null && !isAnimating) {
      setRenderBack(false);
    }
  }, [open, maskUrl, isAnimating]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container || isAnimating) return;

    const rect = container.getBoundingClientRect();
    animate(!open, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (isAnimating) return;

    const container = containerRef.current;
    if (!container) return;
    animate(!open, {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });
  }

  const showFront = maskUrl !== null || !open;

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-busy={isAnimating}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "plan-card-face relative h-full cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50",
        open && "plan-card-face--open",
        isAnimating && "plan-card-face--animating",
        className,
      )}
    >
      {renderBack ? (
        <div className="relative z-0 min-h-full">{back}</div>
      ) : null}

      <div
        className={cn(
          "absolute inset-0 z-10 min-h-full",
          !showFront && "pointer-events-none opacity-0",
        )}
        style={
          maskUrl
            ? {
                WebkitMaskImage: `url(${maskUrl})`,
                maskImage: `url(${maskUrl})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                imageRendering: "pixelated",
                background:
                  "linear-gradient(160deg, rgb(255 255 255 / 6%) 0%, rgb(255 255 255 / 2%) 100%)",
              }
            : undefined
        }
      >
        {front}
      </div>

      {!open && !maskUrl && !isAnimating ? (
        <p className="plan-card-hint pointer-events-none absolute right-4 bottom-4 z-20">
          ▶ REVEAL
        </p>
      ) : null}
    </div>
  );
}
