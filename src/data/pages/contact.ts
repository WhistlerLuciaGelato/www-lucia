/**
 * Contact page copy as designed. Lucia edits it in the Studio (Pages › Contact); any field left
 * empty there shows the value here. The email address, phone number and addresses themselves come
 * from Site settings, and the form's fields stay in the code.
 */
export const contactPage = {
  metaDescription:
    "Get in touch with Whistler Lucia Gelato — email, phone, kitchen address and contact form.",
  heading: {
    eyebrow: "Contact us",
    title: "Say hello",
    intro: "Questions, custom orders, collaborations or flavour requests — drop us a line.",
  },
  /** The small headings above each contact detail. */
  details: {
    emailLabel: "Email",
    phoneLabel: "Phone",
    instagramLabel: "Instagram",
    kitchenLabel: "Kitchen",
    mailingLabel: "Mailing address",
  },
  form: {
    sendLabel: "Send message",
    successTitle: "Message sent — thanks!",
    successText: "We’ll get back to you as soon as we’re off the hill.",
  },
};

export type ContactPage = typeof contactPage;
