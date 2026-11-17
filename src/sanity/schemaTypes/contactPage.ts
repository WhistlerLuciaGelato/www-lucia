import { defineType } from "sanity";
import { blurb, line, section, seoDescription } from "./pageFields";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  fields: [
    section(
      "heading",
      "Top of the page",
      [line("eyebrow", "Small heading"), line("title", "Big heading"), blurb("intro", "Text", { rows: 2 })],
      { collapsed: false },
    ),
    section(
      "details",
      "Contact details",
      [
        line("emailLabel", "Heading above the email address"),
        line("phoneLabel", "Heading above the phone number"),
        line("instagramLabel", "Heading above the Instagram link"),
        line("kitchenLabel", "Heading above the kitchen address"),
        line("mailingLabel", "Heading above the mailing address"),
      ],
      {
        description:
          "The small headings in the boxes beside the form. The email, phone and addresses themselves are in Site settings.",
      },
    ),
    section(
      "form",
      "Contact form",
      [
        line("sendLabel", "Send button"),
        line("successTitle", "Thank-you heading", { description: "Shown once a message has been sent." }),
        blurb("successText", "Thank-you text", { rows: 2 }),
      ],
      { description: "The form’s questions stay as they are, so messages always reach you complete." },
    ),
    seoDescription(),
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});
