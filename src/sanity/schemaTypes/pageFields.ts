import { defineField } from "sanity";

/**
 * Field builders for page copy and photos. Every field is optional: one left empty shows the
 * website's original wording or photo, so clearing a field brings the original back.
 */

type Opts = { description?: string; group?: string; fieldset?: string; hidden?: boolean };

/** A short line: a heading, eyebrow or button label. */
export const line = (name: string, title: string, opts: Opts = {}) =>
  defineField({ name, title, type: "string", ...opts });

/** A sentence or two, kept as one paragraph. */
export const blurb = (name: string, title: string, opts: Opts & { rows?: number } = {}) =>
  defineField({ name, title, type: "text", rows: opts.rows ?? 3, ...opts });

/** Several paragraphs: a blank line starts a new one, and **double asterisks** make words bold. */
export const paragraphs = (name: string, title: string, opts: Opts & { rows?: number } = {}) =>
  defineField({
    name,
    title,
    type: "text",
    rows: opts.rows ?? 8,
    ...opts,
    description: [
      opts.description,
      "Leave a blank line between paragraphs. Wrap words in **double asterisks** to make them bold.",
    ]
      .filter(Boolean)
      .join(" "),
  });

/**
 * A photo with its description for screen readers. `decorative` images (cut-out bears, scoops)
 * are skipped by screen readers, so they have no description field.
 */
export const photo = (name: string, title: string, opts: Opts & { decorative?: boolean } = {}) => {
  const { decorative, ...rest } = opts;
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    ...rest,
    fields: decorative
      ? []
      : [
          defineField({
            name: "alt",
            title: "Description",
            description:
              "What the photo shows, for people using screen readers, e.g. “Two skiers sharing a cone”.",
            type: "string",
            validation: (r) =>
              r
                .custom((alt, ctx) =>
                  (ctx.parent as { asset?: unknown } | undefined)?.asset && !alt?.trim()
                    ? "Describe the photo for people who can't see it."
                    : true,
                )
                .warning(),
          }),
        ],
  });
};

/** The description search engines and link previews show for the page. */
export const seoDescription = (opts: Opts = {}) =>
  blurb("metaDescription", "Search engine description", {
    rows: 3,
    description: "One or two sentences shown under the page's link in Google and in link previews.",
    ...opts,
  });

/** Studio tabs for documents that hold both page copy and other settings. */
export const pageTextGroup = { name: "pageText", title: "Page text & photos" };

/** A titled box of fields, for one section of a page. Collapsed so long pages stay scannable. */
export const section = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
  opts: Opts & { collapsed?: boolean } = {},
) => {
  const { collapsed = true, ...rest } = opts;
  return defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed },
    fields,
    ...rest,
  });
};
