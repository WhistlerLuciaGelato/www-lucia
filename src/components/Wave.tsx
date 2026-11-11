/**
 * Scalloped edge from the website design: a strip of `color` whose top edge waves. Put it at the
 * very top of a section, filled with that section's colour, so it bites into the section above.
 *
 * - "regular": even 56px scallops, like the Figma artwork.
 * - "organic": a looser, hand-drawn wave whose bumps vary in width and height (repeats every 420px).
 */
const tiles = {
  regular: {
    w: 56,
    path: "M0 12.9C9.3 12.9 18.7.9 28 .9S46.7 12.9 56 12.9V14H0Z",
  },
  organic: {
    w: 420,
    path: "M0 11C22 11 34 3 60 3S96 12 128 12 162 1 205 1 248 10 270 10 296 6 318 6 352 13 380 13 404 11 420 11V14H0Z",
  },
} as const;

export type WaveVariant = keyof typeof tiles;

export function Wave({
  color,
  className = "",
  variant = "regular",
}: {
  color: string;
  className?: string;
  variant?: WaveVariant;
}) {
  const { w, path } = tiles[variant];
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="14" viewBox="0 0 ${w} 14"><path d="${path}" fill="${color}"/></svg>`;
  return (
    <div
      aria-hidden
      className={`h-3.5 w-full bg-repeat-x ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(tile)}")`,
        backgroundSize: `${w}px 14px`,
      }}
    />
  );
}

/**
 * A wiggly line (stroke only), e.g. under the header. "organic" is the looser, uneven wave;
 * "regular" the even one.
 */
export function WavyRule({
  color,
  className = "",
  variant = "organic",
}: {
  color: string;
  className?: string;
  variant?: WaveVariant;
}) {
  const line = {
    regular: { w: 56, d: "M0 7C9.3 7 18.7 2 28 2S46.7 7 56 7" },
    organic: {
      w: 420,
      d: "M0 8C22 8 34 3 60 3S96 9 128 9 162 2 205 2 248 7 270 7 296 5 318 5 352 10 380 10 404 8 420 8",
    },
  }[variant];
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="${line.w}" height="12" viewBox="0 0 ${line.w} 12"><path d="${line.d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  return (
    <div
      aria-hidden
      className={`h-3 w-full bg-repeat-x ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(tile)}")`,
        backgroundSize: `${line.w}px 12px`,
      }}
    />
  );
}
