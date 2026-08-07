export function getFirmInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getFirmAvatarColors(slug: string): {
  background: string;
  foreground: string;
} {
  const hue = hashSlug(slug) % 360;
  return {
    background: `hsl(${hue} 35% 22%)`,
    foreground: `hsl(${hue} 60% 78%)`,
  };
}
