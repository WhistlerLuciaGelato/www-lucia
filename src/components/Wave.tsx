/**
 * Scalloped edge from the website design: a strip of `color` whose top edge waves (56px
 * period, like the Figma artwork). Put it at the very top of a section, filled with that
 * section's colour, so it bites into the section above.
 */
export function Wave({ color, className = "" }: { color: string; className?: string }) {
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="14" viewBox="0 0 56 14"><path d="M0 12.9C9.3 12.9 18.7.9 28 .9S46.7 12.9 56 12.9V14H0Z" fill="${color}"/></svg>`;
  return (
    <div
      aria-hidden
      className={`h-3.5 w-full bg-repeat-x ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(tile)}")`,
        backgroundSize: "56px 14px",
      }}
    />
  );
}
