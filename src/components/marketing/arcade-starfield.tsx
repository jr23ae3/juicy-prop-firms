"use client";

const STARS = [
  { top: "8%", left: "12%", delay: "0s", size: "sm" },
  { top: "15%", left: "78%", delay: "0.4s", size: "md" },
  { top: "32%", left: "5%", delay: "0.8s", size: "sm" },
  { top: "45%", left: "92%", delay: "1.2s", size: "lg" },
  { top: "62%", left: "22%", delay: "0.2s", size: "md" },
  { top: "70%", left: "65%", delay: "1.6s", size: "sm" },
  { top: "85%", left: "40%", delay: "0.6s", size: "md" },
  { top: "22%", left: "48%", delay: "1s", size: "sm" },
  { top: "55%", left: "88%", delay: "1.4s", size: "sm" },
  { top: "78%", left: "8%", delay: "0.3s", size: "lg" },
] as const;

export function ArcadeStarfield() {
  return (
    <div className="arcade-starfield" aria-hidden>
      {STARS.map((star, i) => (
        <span
          key={i}
          className="arcade-star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            width: star.size === "lg" ? 6 : star.size === "md" ? 4 : 3,
            height: star.size === "lg" ? 6 : star.size === "md" ? 4 : 3,
          }}
        />
      ))}
    </div>
  );
}
