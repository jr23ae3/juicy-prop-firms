"use client";

import { useEffect, useState } from "react";

type ArcadeScoreHudProps = {
  firms: number;
  plans: number;
  lowestAllIn: string | null;
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export function ArcadeScoreHud({
  firms,
  plans,
  lowestAllIn,
}: ArcadeScoreHudProps) {
  const firmCount = useCountUp(firms);
  const planCount = useCountUp(plans);

  return (
    <div className="arcade-hud" role="group" aria-label="Live catalog stats">
      <div className="arcade-hud-cell">
        <p className="arcade-hud-label">FIRMS</p>
        <p className="arcade-hud-value">{firmCount}</p>
      </div>
      <div className="arcade-hud-cell">
        <p className="arcade-hud-label">PLANS</p>
        <p className="arcade-hud-value">{planCount}</p>
      </div>
      <div className="arcade-hud-cell col-span-2 sm:col-span-2">
        <p className="arcade-hud-label">LOWEST ALL-IN</p>
        <p className="arcade-hud-value text-primary">
          {lowestAllIn ?? "—"}
        </p>
      </div>
    </div>
  );
}
