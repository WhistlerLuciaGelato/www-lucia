/**
 * Plain Studio text with `**bold**` marks, as used in the events package cards. Kept tiny on
 * purpose: bold is the only formatting, so editors don't need a rich text field.
 */
export function Rich({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

/** Splits Studio text into paragraphs at blank lines. */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
