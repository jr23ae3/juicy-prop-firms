"use client";

import { cn } from "@/lib/utils";

type GhostConfig = {
  color: string;
  eyeColor: string;
  trail: number;
};

type LaneConfig = {
  top: string;
  duration: number;
  delay: number;
  reverse: boolean;
  opacity: number;
  ghosts: GhostConfig[];
};

const LANES: LaneConfig[] = [
  {
    top: "10%",
    duration: 24,
    delay: 0,
    reverse: false,
    opacity: 0.18,
    ghosts: [
      { color: "#ff5c5c", eyeColor: "#1a4fd6", trail: 2.4 },
      { color: "#ffb8ff", eyeColor: "#1a4fd6", trail: 4.8 },
    ],
  },
  {
    top: "34%",
    duration: 32,
    delay: -11,
    reverse: true,
    opacity: 0.14,
    ghosts: [{ color: "#36ffff", eyeColor: "#c62828", trail: 3.2 }],
  },
  {
    top: "58%",
    duration: 20,
    delay: -6,
    reverse: false,
    opacity: 0.12,
    ghosts: [
      { color: "#ffb347", eyeColor: "#1a4fd6", trail: 2.1 },
      { color: "#ff5c5c", eyeColor: "#1a4fd6", trail: 4.2 },
    ],
  },
  {
    top: "82%",
    duration: 26,
    delay: -15,
    reverse: true,
    opacity: 0.1,
    ghosts: [{ color: "#ffb8ff", eyeColor: "#1a4fd6", trail: 3.6 }],
  },
];

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

function GhostSprite({
  color,
  eyeColor,
}: {
  color: string;
  eyeColor: string;
}) {
  return (
    <svg
      viewBox="0 0 14 16"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      className="arcade-pacman-ghost-body size-4 sm:size-5"
      aria-hidden
    >
      <path
        fill={color}
        d="M1 6.5C1 2.5 3.5 1 7 1s6 1.5 6 5.5V14l-2.2-1.6L7 14 4.2 12.4 1 14V6.5Z"
      />
      <ellipse cx="5" cy="6.2" rx="1.35" ry="1.75" fill="#fff" />
      <ellipse cx="9" cy="6.2" rx="1.35" ry="1.75" fill="#fff" />
      <circle cx="5.45" cy="6.55" r="0.75" fill={eyeColor} />
      <circle cx="9.45" cy="6.55" r="0.75" fill={eyeColor} />
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

          {lane.ghosts.map((ghost, ghostIndex) => (
            <div
              key={`${index}-ghost-${ghostIndex}`}
              className={cn(
                "arcade-pacman-ghost",
                lane.reverse && "arcade-pacman-ghost--reverse",
              )}
              style={{
                animationDuration: `${lane.duration}s`,
                animationDelay: `${lane.delay + ghost.trail}s`,
              }}
            >
              <div className={cn("inline-flex", lane.reverse && "-scale-x-100")}>
                <GhostSprite color={ghost.color} eyeColor={ghost.eyeColor} />
              </div>
            </div>
          ))}

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
