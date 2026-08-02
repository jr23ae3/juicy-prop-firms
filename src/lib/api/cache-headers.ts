export const PUBLIC_API_CACHE = "public, s-maxage=60, stale-while-revalidate=300";

export function withPublicCache(init?: ResponseInit): ResponseInit {
  return {
    ...init,
    headers: {
      ...init?.headers,
      "Cache-Control": PUBLIC_API_CACHE,
    },
  };
}
