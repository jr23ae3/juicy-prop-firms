"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type RadialNoiseRevealProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  ariaLabel?: string;
};

function hashNoise(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function buildMaskUrl(
  width: number,
  height: number,
  cx: number,
  cy: number,
  progress: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.createImageData(width, height);
  const maxRadius = Math.hypot(width, height) * 1.15;
  const radius = maxRadius * progress;
  const noiseAmp = 16;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dist = Math.hypot(x - cx, y - cy);
      const noise =
        hashNoise(x * 0.09, y * 0.09) * 2 -
        1 +
        hashNoise(x * 0.04 + 12, y * 0.05) * 2 -
        1;
      const edge = radius + noise * noiseAmp;
      const alpha = dist < edge ? 0 : 255;
      const index = (y * width + x) * 4;
      imageData.data[index] = 255;
      imageData.data[index + 1] = 255;
      imageData.data[index + 2] = 255;
      imageData.data[index + 3] = alpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

const DURATION_MS = 650;

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
  const [maskUrl, setMaskUrl] = useState<string | null>(null);
  const [renderBack, setRenderBack] = useState(open);

  const animate = useCallback(
    (toOpen: boolean, origin: { x: number; y: number }) => {
      const container = containerRef.current;
      if (!container) return;

      setRenderBack(true);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        setMaskUrl(null);
        onOpenChange(toOpen);
        if (!toOpen) setRenderBack(false);
        return;
      }

      const { width, height } = container.getBoundingClientRect();
      const start = performance.now();
      const from = toOpen ? 0 : 1;
      const to = toOpen ? 1 : 0;

      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / DURATION_MS, 1);
        const eased = easeOutCubic(t);
        const progress = from + (to - from) * eased;
        const url = buildMaskUrl(width, height, origin.x, origin.y, progress);
        setMaskUrl(url);

        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }

        setMaskUrl(null);
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
    if (!open && maskUrl === null) {
      setRenderBack(false);
    }
  }, [open, maskUrl]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const origin = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    animate(!open, origin);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    animate(!open, {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });
  }

  const showFrontMask = maskUrl !== null || !open;

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-primary/50",
        open && "border-primary/40 shadow-[0_0_40px_rgb(0_185_122_/_12%)]",
        className,
      )}
    >
      {renderBack ? (
        <div className="relative z-0 min-h-full">{back}</div>
      ) : null}

      <div
        className={cn(
          "absolute inset-0 z-10 min-h-full bg-card",
          !showFrontMask && "pointer-events-none opacity-0",
        )}
        style={
          maskUrl
            ? {
                WebkitMaskImage: `url(${maskUrl})`,
                maskImage: `url(${maskUrl})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }
            : undefined
        }
      >
        {front}
      </div>

      {!open && !maskUrl ? (
        <p className="pointer-events-none absolute right-3 bottom-3 z-20 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Click to reveal
        </p>
      ) : null}
    </div>
  );
}
