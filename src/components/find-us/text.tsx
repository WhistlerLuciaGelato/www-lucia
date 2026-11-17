import { Fragment } from "react";
import { Rich } from "@/components/Rich";

/** Studio text with its line breaks (Enter) kept. */
export function Lines({ text }: { text: string }) {
  return text.split(/\r?\n/).map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

/**
 * Studio text where words in [square brackets] link to Lucia's Instagram and **double asterisks**
 * make words bold.
 */
export function InstagramText({
  text,
  href,
  linkClassName,
  newTab = false,
}: {
  text: string;
  href: string;
  linkClassName: string;
  newTab?: boolean;
}) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <a
        key={i}
        href={href}
        className={linkClassName}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {part.slice(1, -1)}
      </a>
    ) : (
      <Fragment key={i}>
        <Rich text={part} />
      </Fragment>
    ),
  );
}
