/**
 * Soft, organic background shapes in brand colours, for scattering behind sections. Purely
 * decorative: place inside a `relative` (ideally `isolate overflow-hidden`) parent and size with
 * width classes; the height follows the shape.
 */
const shapes = {
  bean: "M118 12c48-14 104 6 130 50s16 104-24 136-104 40-150 18S2 150 6 104 70 26 118 12Z",
  puddle: "M60 30C98 2 170-6 214 22s52 84 22 116-62 30-96 52-82 30-112 2S-6 132 6 92 22 58 60 30Z",
  pebble: "M134 8c50 6 98 44 108 92s-22 100-74 118-118 6-148-34S4 92 30 52 84 2 134 8Z",
  splash:
    "M126 4c28 0 36 30 62 36s58-10 70 16-14 48-10 76 34 52 10 74-56 0-82 12-42 38-72 28-24-46-50-60-62-6-70-38 28-44 30-72S98 4 126 4Z",
} as const;

export type BlobShape = keyof typeof shapes;

export function Blob({
  shape = "bean",
  color,
  className = "",
}: {
  shape?: BlobShape;
  color: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 260 240"
      className={`pointer-events-none absolute -z-10 h-auto select-none ${className}`}
    >
      <path d={shapes[shape]} fill={color} />
    </svg>
  );
}
