"use client";

import { cn } from "@/lib/utils";

type ArcadeTapeScoutCharacterProps = {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
};

const sizeMap = {
  sm: "h-14 w-11",
  md: "h-24 w-20",
  lg: "h-32 w-28",
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

export function ArcadeTapeScoutCharacter({
  size = "md",
  animate = true,
  className,
}: ArcadeTapeScoutCharacterProps) {
  const walkClass = animate ? "skills-guide-scout-walk" : undefined;

  return (
    <div
      className={cn(
        "skills-guide-character-shell",
        sizeMap[size],
        className,
      )}
    >
      <svg
        viewBox="0 0 16 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        aria-hidden
        className={cn("h-full w-full", walkClass)}
      >
        <Pixel x={3} y={0} fill="#ffd700" />
        <Pixel x={4} y={0} fill="#ffd700" />
        <Pixel x={5} y={0} fill="#ffd700" />
        <Pixel x={6} y={0} fill="#ffd700" />
        <Pixel x={2} y={1} fill="#00b97a" />
        <Pixel x={3} y={1} fill="#00b97a" />
        <Pixel x={4} y={1} fill="#36ffff" />
        <Pixel x={5} y={1} fill="#36ffff" />
        <Pixel x={6} y={1} fill="#00b97a" />
        <Pixel x={7} y={1} fill="#00b97a" />
        <Pixel x={1} y={2} fill="#0b3135" />
        <Pixel x={2} y={2} fill="#00b97a" />
        <Pixel x={3} y={2} fill="#00b97a" />
        <Pixel x={4} y={2} fill="#04110a" />
        <Pixel x={5} y={2} fill="#04110a" />
        <Pixel x={6} y={2} fill="#00b97a" />
        <Pixel x={7} y={2} fill="#00b97a" />
        <Pixel x={8} y={2} fill="#0b3135" />
        <Pixel x={1} y={3} fill="#0b3135" />
        <Pixel x={2} y={3} fill="#00b97a" />
        <Pixel x={3} y={3} fill="#36ffff" />
        <Pixel x={4} y={3} fill="#36ffff" />
        <Pixel x={5} y={3} fill="#36ffff" />
        <Pixel x={6} y={3} fill="#36ffff" />
        <Pixel x={7} y={3} fill="#00b97a" />
        <Pixel x={8} y={3} fill="#0b3135" />
        <Pixel x={2} y={4} fill="#00b97a" />
        <Pixel x={3} y={4} fill="#00b97a" />
        <Pixel x={4} y={4} fill="#00b97a" />
        <Pixel x={5} y={4} fill="#00b97a" />
        <Pixel x={6} y={4} fill="#00b97a" />
        <Pixel x={7} y={4} fill="#00b97a" />
        <Pixel x={2} y={5} fill="#04110a" />
        <Pixel x={3} y={5} fill="#00b97a" />
        <Pixel x={4} y={5} fill="#00b97a" />
        <Pixel x={5} y={5} fill="#00b97a" />
        <Pixel x={6} y={5} fill="#00b97a" />
        <Pixel x={7} y={5} fill="#04110a" />
        <Pixel x={1} y={6} fill="#00b97a" />
        <Pixel x={2} y={6} fill="#00b97a" />
        <Pixel x={3} y={6} fill="#00b97a" />
        <Pixel x={4} y={6} fill="#36ffff" />
        <Pixel x={5} y={6} fill="#00b97a" />
        <Pixel x={6} y={6} fill="#00b97a" />
        <Pixel x={7} y={6} fill="#00b97a" />
        <Pixel x={8} y={6} fill="#00b97a" />
        <Pixel x={0} y={7} fill="#ffd700" />
        <Pixel x={1} y={7} fill="#00b97a" />
        <Pixel x={2} y={7} fill="#04110a" />
        <Pixel x={3} y={7} fill="#04110a" />
        <Pixel x={4} y={7} fill="#04110a" />
        <Pixel x={5} y={7} fill="#04110a" />
        <Pixel x={6} y={7} fill="#04110a" />
        <Pixel x={7} y={7} fill="#00b97a" />
        <Pixel x={8} y={7} fill="#00b97a" />
        <Pixel x={9} y={7} fill="#ffd700" />
        <Pixel x={2} y={8} fill="#00b97a" />
        <Pixel x={3} y={8} fill="#00b97a" />
        <Pixel x={4} y={8} fill="#00b97a" />
        <Pixel x={5} y={8} fill="#00b97a" />
        <Pixel x={6} y={8} fill="#00b97a" />
        <Pixel x={7} y={8} fill="#00b97a" />
        <Pixel x={2} y={9} fill="#00b97a" />
        <Pixel x={3} y={9} fill="#0b3135" />
        <Pixel x={4} y={9} fill="#00b97a" />
        <Pixel x={5} y={9} fill="#00b97a" />
        <Pixel x={6} y={9} fill="#0b3135" />
        <Pixel x={7} y={9} fill="#00b97a" />
        <Pixel x={1} y={10} fill="#00b97a" />
        <Pixel x={2} y={10} fill="#00b97a" />
        <Pixel x={3} y={10} fill="#00b97a" />
        <Pixel x={4} y={10} fill="#00b97a" />
        <Pixel x={5} y={10} fill="#00b97a" />
        <Pixel x={6} y={10} fill="#00b97a" />
        <Pixel x={7} y={10} fill="#00b97a" />
        <Pixel x={8} y={10} fill="#00b97a" />
        <Pixel x={2} y={11} fill="#04110a" />
        <Pixel x={3} y={11} fill="#04110a" />
        <Pixel x={4} y={11} fill="#04110a" />
        <Pixel x={5} y={11} fill="#04110a" />
        <Pixel x={6} y={11} fill="#04110a" />
        <Pixel x={7} y={11} fill="#04110a" />
      </svg>
    </div>
  );
}
