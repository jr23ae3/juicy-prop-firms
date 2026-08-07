function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function step(edge: number, x: number) {
  return x < edge ? 0 : 1;
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function grad4(hash: number, x: number, y: number, z: number, w: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : w;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const perm = new Uint8Array(512);
const gradP = new Uint8Array(512);

(function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i += 1) {
    perm[i] = p[i & 255];
    gradP[i] = perm[i] % 16;
  }
})();

/** Compact 4D Perlin-style noise adapted from the Codrops shader. */
export function cnoise4(x: number, y: number, z: number, w: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  const W = Math.floor(w) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  w -= Math.floor(w);

  const u = fade(x);
  const v = fade(y);
  const s = fade(z);
  const t = fade(w);

  const A = perm[X] + Y;
  const AA = perm[A] + Z;
  const AAA = perm[AA] + W;
  const AAB = perm[AA + 1] + W;
  const AB = perm[A + 1] + Z;
  const ABA = perm[AB] + W;
  const ABB = perm[AB + 1] + W;
  const B = perm[X + 1] + Y;
  const BA = perm[B] + Z;
  const BAA = perm[BA] + W;
  const BAB = perm[BA + 1] + W;
  const BB = perm[B + 1] + Z;
  const BBA = perm[BB] + W;
  const BBB = perm[BB + 1] + W;

  return lerp(
    lerp(
      lerp(
        grad4(gradP[AAA], x, y, z, w),
        grad4(gradP[BAA], x - 1, y, z, w),
        u,
      ),
      lerp(
        grad4(gradP[ABA], x, y - 1, z, w),
        grad4(gradP[BBA], x - 1, y - 1, z, w),
        u,
      ),
      v,
    ),
    lerp(
      lerp(
        grad4(gradP[AAB], x, y, z - 1, w),
        grad4(gradP[BAB], x - 1, y, z - 1, w),
        u,
      ),
      lerp(
        grad4(gradP[ABB], x, y - 1, z - 1, w),
        grad4(gradP[BBB], x - 1, y - 1, z - 1, w),
        u,
      ),
      v,
    ),
    s,
  ) +
    lerp(
      lerp(
        lerp(
          grad4(gradP[AA + 1], x, y, z, w - 1),
          grad4(gradP[BA + 1], x - 1, y, z, w - 1),
          u,
        ),
        lerp(
          grad4(gradP[AB + 1], x, y - 1, z, w - 1),
          grad4(gradP[BB + 1], x - 1, y - 1, z, w - 1),
          u,
        ),
        v,
      ),
      lerp(
        lerp(
          grad4(gradP[A + 1 + 1], x, y, z - 1, w - 1),
          grad4(gradP[B + 1 + 1], x - 1, y, z - 1, w - 1),
          u,
        ),
        lerp(
          grad4(gradP[AB + 1 + 1], x, y - 1, z - 1, w - 1),
          grad4(gradP[BB + 1 + 1], x - 1, y - 1, z - 1, w - 1),
          u,
        ),
        v,
      ),
      s,
    ) * t;
}

/** Port of BackgroundMaterial.js from codrops-noise-transition. */
export function sampleCodropsMaskAlpha(
  x: number,
  y: number,
  width: number,
  height: number,
  originX: number,
  originY: number,
  progress: number,
  time: number,
): number {
  const aspect = width / height;
  const u = x / width;
  const v = y / height;
  const originU = originX / width;
  const originV = originY / height;

  const dist = Math.hypot((u - originU) * aspect, v - originV);

  const nx = (u - 0.5) * aspect;
  const ny = v - 0.5;
  const density = 1.8 - dist;
  const noiseVal = cnoise4(nx * 40 * density, ny * 40 * density, time, 1);

  const facets = noiseVal * 2;
  const dots = smoothstep(0.1, 0.15, noiseVal);
  let n = facets * dots;
  n = step(0.2, facets) * dots;
  n = 1 - n;

  const radius = 1.5;
  const outerProgress = clamp(1.1 * progress, 0, 1);
  const innerProgress = clamp(1.1 * progress - 0.05, 0, 1);

  const innerCircle =
    1 -
    smoothstep(
      (innerProgress - 0.4) * radius,
      innerProgress * radius,
      dist,
    );
  const outerCircle =
    1 -
    smoothstep(
      (outerProgress - 0.1) * radius,
      innerProgress * radius,
      dist,
    );

  const displacement = outerCircle - innerCircle;
  const grain =
    (Math.sin(u * 12.9898 + v * 78.233 * 2000) * 43758.5453) % 1;
  const grainStrength = 0.3;
  const final = displacement - (n + noiseVal) - grain * grainStrength;

  const alpha = clamp(1 - innerCircle - final * 0.25, 0, 1);
  return Math.round(alpha * 255);
}

export function easeQuadOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

export function buildCodropsMaskUrl(
  width: number,
  height: number,
  originX: number,
  originY: number,
  progress: number,
  time: number,
  scale = 0.45,
) {
  const maskWidth = Math.max(1, Math.round(width * scale));
  const maskHeight = Math.max(1, Math.round(height * scale));
  const scaleX = width / maskWidth;
  const scaleY = height / maskHeight;

  const canvas = document.createElement("canvas");
  canvas.width = maskWidth;
  canvas.height = maskHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.createImageData(maskWidth, maskHeight);
  const scaledOriginX = originX / scaleX;
  const scaledOriginY = originY / scaleY;

  for (let y = 0; y < maskHeight; y += 1) {
    for (let x = 0; x < maskWidth; x += 1) {
      const alpha = sampleCodropsMaskAlpha(
        x,
        y,
        maskWidth,
        maskHeight,
        scaledOriginX,
        scaledOriginY,
        progress,
        time,
      );
      const index = (y * maskWidth + x) * 4;
      imageData.data[index] = 255;
      imageData.data[index + 1] = 255;
      imageData.data[index + 2] = 255;
      imageData.data[index + 3] = alpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
