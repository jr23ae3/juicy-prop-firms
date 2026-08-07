"use client";

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import { CardHoverShader } from "@/components/compare/card-hover-shader";
import { cn } from "@/lib/utils";

type PlanCardShellProps = {
  children: ReactNode;
  className?: string;
  /** Disable tilt when card is expanded or animating */
  interactive?: boolean;
};

export function PlanCardShell({
  children,
  className,
  interactive = true,
}: PlanCardShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!interactive || !shellRef.current) return;

      const rect = shellRef.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      setSpotlight({ x: px * 100, y: py * 100 });
      setTilt({
        x: (0.5 - py) * 10,
        y: (px - 0.5) * 14,
      });
    },
    [interactive],
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50 });
  }, []);

  const transform = interactive
    ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.015 : 1})`
    : undefined;

  return (
    <div className={cn("plan-card-scene h-full", className)}>
      <div
        ref={shellRef}
        className="plan-card-shell h-full rounded-xl"
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="plan-card-spotlight"
          aria-hidden
          style={
            {
              "--spotlight-x": `${spotlight.x}%`,
              "--spotlight-y": `${spotlight.y}%`,
            } as React.CSSProperties
          }
        />
        <div
          className="plan-card-rim"
          aria-hidden
          style={
            {
              "--spotlight-x": `${spotlight.x}%`,
              "--spotlight-y": `${spotlight.y}%`,
            } as React.CSSProperties
          }
        />
        {interactive && hovered ? (
          <CardHoverShader
            mouseX={spotlight.x}
            mouseY={spotlight.y}
          />
        ) : null}
        <div className="plan-card-content h-full">{children}</div>
      </div>
    </div>
  );
}
