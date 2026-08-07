"use client";

import { cn } from "@/lib/utils";

const LANES = [
  { top: "10%", duration: 24, delay: 0, reverse: false, opacity: 0.18 },
  { top: "34%", duration: 32, delay: -11, reverse: true, opacity: 0.14 },
  { top: "58%", duration: 20, delay: -6, reverse: false, opacity: 0.12 },
  { top: "82%", duration: 26, delay: -15, reverse: true, opacity: 0.1 },
] as const;

const DOT_COUNT = 36;

function PacmanSprite({ reverse }: { reverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={cn("size-5 sm:size-6", reverse && "-scale-x-100")}
      aria-hidden
    >
      <circle cx="8" cy="8" r="7" fill="#ffd800" />
      <path
        className="arcade-pacman-mouth"
        fill="#0a0520"
        d="M8 8 L15 8 A7 7 0 0 1 8 1 Z"
      />
      <circle cx="10.5" cy="5.5" r="1.25" fill="#04110a" />
    </svg>
  );
}

export function ArcadePacmanBackground() {
  return (
    <div className="arcade-pacman-scene" aria-hidden>
      {LANES.map((lane, index) => (
        <div
          key={index}
          className="arcade-pacman-lane"
          style={{ top: lane.top, opacity: lane.opacity }}
        >
          <div className="arcade-pacman-dots">
            {Array.from({ length: DOT_COUNT }, (_, dotIndex) => (
              <span
                key={dotIndex}
                className={cn(
                  "arcade-pacman-dot",
                  dotIndex % 9 === 0 && "arcade-pacman-dot--power",
                )}
                style={{ animationDelay: `${dotIndex * 0.12}s` }}
              />
            ))}
          </div>

          <div
            className={cn(
              "arcade-pacman-runner",
              lane.reverse && "arcade-pacman-runner--reverse",
            )}
            style={{
              animationDuration: `${lane.duration}s`,
              animationDelay: `${lane.delay}s`,
            }}
          >
            <PacmanSprite reverse={lane.reverse} />
          </div>
        </div>
      ))}
    </div>
  );
}
