"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_PHRASES = [
  "PICK A FIRM!",
  "I KNOW PLANS!",
  "1UP ADVICE!",
  "INSERT QUEST!",
] as const;

type ArcadeAdvisorCharacterProps = {
  size?: "xs" | "sm" | "md" | "lg";
  showBubble?: boolean;
  bubbleText?: string;
  bubblePhrases?: readonly string[];
  animate?: boolean;
  className?: string;
};

const sizeMap = {
  xs: "h-4 w-4",
  sm: "h-12 w-10",
  md: "h-32 w-24",
  lg: "h-40 w-32",
} as const;

function Pixel({
  x,
  y,
  fill,
  className,
}: {
  x: number;
  y: number;
  fill: string;
  className?: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={1}
      height={1}
      fill={fill}
      className={className}
    />
  );
}

function AdvisorSprite({ animate }: { animate: boolean }) {
  const bobClass = animate ? "arcade-advisor-idle" : undefined;
  const blinkClass = animate ? "arcade-advisor-eye" : undefined;
  const glowClass = animate ? "arcade-advisor-antenna" : undefined;

  return (
    <svg
      viewBox="0 0 16 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden
      className={cn("h-full w-full", bobClass)}
    >
      {/* antenna */}
      <Pixel x={7} y={0} fill="#5a5a72" />
      <Pixel x={7} y={1} fill="#5a5a72" />
      <rect
        x={7}
        y={2}
        width={1}
        height={1}
        fill="#36ffff"
        className={glowClass}
      />

      {/* head shell */}
      <Pixel x={4} y={3} fill="#2e7a8c" />
      <Pixel x={5} y={3} fill="#2e7a8c" />
      <Pixel x={6} y={3} fill="#2e7a8c" />
      <Pixel x={7} y={3} fill="#2e7a8c" />
      <Pixel x={8} y={3} fill="#2e7a8c" />
      <Pixel x={9} y={3} fill="#2e7a8c" />
      <Pixel x={10} y={3} fill="#2e7a8c" />
      <Pixel x={11} y={3} fill="#2e7a8c" />

      <Pixel x={3} y={4} fill="#2e7a8c" />
      <Pixel x={4} y={4} fill="#0b3135" />
      <Pixel x={5} y={4} fill="#0b3135" />
      <Pixel x={6} y={4} fill="#0b3135" />
      <Pixel x={7} y={4} fill="#0b3135" />
      <Pixel x={8} y={4} fill="#0b3135" />
      <Pixel x={9} y={4} fill="#0b3135" />
      <Pixel x={10} y={4} fill="#0b3135" />
      <Pixel x={11} y={4} fill="#0b3135" />
      <Pixel x={12} y={4} fill="#2e7a8c" />

      <Pixel x={3} y={5} fill="#2e7a8c" />
      <Pixel x={4} y={5} fill="#04110a" />
      <Pixel x={5} y={5} fill="#36ffff" className={blinkClass} />
      <Pixel x={6} y={5} fill="#04110a" />
      <Pixel x={7} y={5} fill="#0b3135" />
      <Pixel x={8} y={5} fill="#0b3135" />
      <Pixel x={9} y={5} fill="#04110a" />
      <Pixel x={10} y={5} fill="#36ffff" className={blinkClass} />
      <Pixel x={11} y={5} fill="#04110a" />
      <Pixel x={12} y={5} fill="#2e7a8c" />

      <Pixel x={3} y={6} fill="#2e7a8c" />
      <Pixel x={4} y={6} fill="#0b3135" />
      <Pixel x={5} y={6} fill="#00b97a" />
      <Pixel x={6} y={6} fill="#00b97a" />
      <Pixel x={7} y={6} fill="#00b97a" />
      <Pixel x={8} y={6} fill="#00b97a" />
      <Pixel x={9} y={6} fill="#00b97a" />
      <Pixel x={10} y={6} fill="#00b97a" />
      <Pixel x={11} y={6} fill="#0b3135" />
      <Pixel x={12} y={6} fill="#2e7a8c" />

      <Pixel x={4} y={7} fill="#2e7a8c" />
      <Pixel x={5} y={7} fill="#2e7a8c" />
      <Pixel x={6} y={7} fill="#2e7a8c" />
      <Pixel x={7} y={7} fill="#2e7a8c" />
      <Pixel x={8} y={7} fill="#2e7a8c" />
      <Pixel x={9} y={7} fill="#2e7a8c" />
      <Pixel x={10} y={7} fill="#2e7a8c" />
      <Pixel x={11} y={7} fill="#2e7a8c" />

      {/* body */}
      <Pixel x={2} y={8} fill="#2e7a8c" />
      <Pixel x={3} y={8} fill="#0a232c" />
      <Pixel x={4} y={8} fill="#0a232c" />
      <Pixel x={5} y={8} fill="#0a232c" />
      <Pixel x={6} y={8} fill="#0a232c" />
      <Pixel x={7} y={8} fill="#0a232c" />
      <Pixel x={8} y={8} fill="#0a232c" />
      <Pixel x={9} y={8} fill="#0a232c" />
      <Pixel x={10} y={8} fill="#0a232c" />
      <Pixel x={11} y={8} fill="#0a232c" />
      <Pixel x={12} y={8} fill="#0a232c" />
      <Pixel x={13} y={8} fill="#2e7a8c" />

      <Pixel x={2} y={9} fill="#2e7a8c" />
      <Pixel x={3} y={9} fill="#0b3135" />
      <Pixel x={4} y={9} fill="#00b97a" />
      <Pixel x={5} y={9} fill="#00b97a" />
      <Pixel x={6} y={9} fill="#04110a" />
      <Pixel x={7} y={9} fill="#04110a" />
      <Pixel x={8} y={9} fill="#04110a" />
      <Pixel x={9} y={9} fill="#04110a" />
      <Pixel x={10} y={9} fill="#00b97a" />
      <Pixel x={11} y={9} fill="#00b97a" />
      <Pixel x={12} y={9} fill="#0b3135" />
      <Pixel x={13} y={9} fill="#2e7a8c" />

      <Pixel x={2} y={10} fill="#2e7a8c" />
      <Pixel x={3} y={10} fill="#0b3135" />
      <Pixel x={4} y={10} fill="#0b3135" />
      <Pixel x={5} y={10} fill="#0b3135" />
      <Pixel x={6} y={10} fill="#0b3135" />
      <Pixel x={7} y={10} fill="#36ffff" className={animate ? "arcade-advisor-core" : undefined} />
      <Pixel x={8} y={10} fill="#36ffff" className={animate ? "arcade-advisor-core" : undefined} />
      <Pixel x={9} y={10} fill="#0b3135" />
      <Pixel x={10} y={10} fill="#0b3135" />
      <Pixel x={11} y={10} fill="#0b3135" />
      <Pixel x={12} y={10} fill="#0b3135" />
      <Pixel x={13} y={10} fill="#2e7a8c" />

      <Pixel x={3} y={11} fill="#2e7a8c" />
      <Pixel x={4} y={11} fill="#0b3135" />
      <Pixel x={5} y={11} fill="#0b3135" />
      <Pixel x={6} y={11} fill="#0b3135" />
      <Pixel x={7} y={11} fill="#0b3135" />
      <Pixel x={8} y={11} fill="#0b3135" />
      <Pixel x={9} y={11} fill="#0b3135" />
      <Pixel x={10} y={11} fill="#0b3135" />
      <Pixel x={11} y={11} fill="#0b3135" />
      <Pixel x={12} y={11} fill="#2e7a8c" />

      {/* arm + juice orb */}
      <Pixel x={0} y={10} fill="#2e7a8c" />
      <Pixel x={1} y={10} fill="#5a5a72" />
      <Pixel x={0} y={11} fill="#5a5a72" />
      <Pixel x={1} y={11} fill="#ff8c00" />
      <Pixel x={1} y={12} fill="#ffd700" />
      <Pixel x={2} y={12} fill="#ff8c00" />

      <Pixel x={14} y={10} fill="#2e7a8c" />
      <Pixel x={15} y={10} fill="#5a5a72" />
      <Pixel x={14} y={11} fill="#5a5a72" />
      <Pixel x={15} y={11} fill="#5a5a72" />

      {/* legs */}
      <Pixel x={4} y={12} fill="#2e7a8c" />
      <Pixel x={5} y={12} fill="#0a232c" />
      <Pixel x={6} y={12} fill="#0a232c" />
      <Pixel x={7} y={12} fill="#0a232c" />
      <Pixel x={8} y={12} fill="#0a232c" />
      <Pixel x={9} y={12} fill="#0a232c" />
      <Pixel x={10} y={12} fill="#0a232c" />
      <Pixel x={11} y={12} fill="#0a232c" />
      <Pixel x={12} y={12} fill="#2e7a8c" />

      <Pixel x={4} y={13} fill="#2e7a8c" />
      <Pixel x={5} y={13} fill="#0a232c" />
      <Pixel x={6} y={13} fill="#0a232c" />
      <Pixel x={9} y={13} fill="#0a232c" />
      <Pixel x={10} y={13} fill="#0a232c" />
      <Pixel x={11} y={13} fill="#2e7a8c" />

      <Pixel x={4} y={14} fill="#5a5a72" />
      <Pixel x={5} y={14} fill="#5a5a72" />
      <Pixel x={6} y={14} fill="#04110a" />
      <Pixel x={9} y={14} fill="#04110a" />
      <Pixel x={10} y={14} fill="#5a5a72" />
      <Pixel x={11} y={14} fill="#5a5a72" />

      {/* shadow */}
      <rect x={3} y={20} width={10} height={1} fill="#00b97a" opacity={0.25} />
    </svg>
  );
}

export function ArcadeAdvisorCharacter({
  size = "md",
  showBubble = false,
  bubbleText,
  bubblePhrases = DEFAULT_PHRASES,
  animate = true,
  className,
}: ArcadeAdvisorCharacterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const cycling = showBubble && !bubbleText && bubblePhrases.length > 1;

  useEffect(() => {
    if (!cycling || !animate) return;

    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % bubblePhrases.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [animate, bubblePhrases.length, cycling]);

  const label =
    bubbleText ?? (showBubble ? bubblePhrases[phraseIndex] : undefined);

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center",
        sizeMap[size],
        className,
      )}
    >
      {label ? (
        <div
          className={cn(
            "arcade-advisor-bubble absolute bottom-full z-10 mb-2 whitespace-nowrap px-3 py-2",
            animate && "arcade-advisor-bubble--pulse",
          )}
          aria-hidden
        >
          {label}
        </div>
      ) : null}
      <AdvisorSprite animate={animate} />
    </div>
  );
}
