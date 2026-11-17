import { img } from "@/lib/page-text";

/**
 * About page copy and photos as designed. Lucia edits them in the Studio (Pages › About); any
 * field left empty there shows the value here. Links, colours and the bear illustrations stay in
 * the code.
 */
export const aboutPage = {
  metaDescription:
    "Since 2007, Whistler Lucia Gelato has been whipping up small-batch gelato and sorbets at our kitchen in Base II — the only frozen treats made right here in Whistler.",
  heading: {
    eyebrow: "About us",
    title: "Proudly local, since 2007",
    intro: "It all started with a trip to Italy.",
  },
  story: {
    photo: img("/photos/skiers-cones.webp", "Friends sharing Lucia gelato on the mountain", 1200, 1833),
    startedTitle: "How we started",
    started:
      "The idea for Lucia Gelato started during our travels, where we discovered the simple pleasure of stopping for gelato — whether after a long day outside, exploring new places, or just enjoying the moment.\n\nThose experiences stayed with us. Back in Whistler, we kept thinking about how to bring that same feeling here: something simple, high-quality, and enjoyable for everyone.\n\nThat curiosity led us to learn more about gelato, from traditional techniques to the importance of fresh, natural ingredients. Inspired by the Italian approach, we make gelato and sorbetto in a true artisan style — honest, clean, and full of flavour.",
    commitmentTitle: "Our commitment",
    commitment:
      "Lucia Gelato is about more than ice cream. It’s about creating something that fits the Whistler lifestyle, whether you’re finishing a bike ride, skiing, or simply enjoying a sunny afternoon. We hope every scoop brings a little of that experience: quality ingredients, craftsmanship, and good moments.",
    signOff: "Ciao, Tancrede & Team Lucia",
  },
  /** The four coloured bubbles under the story. */
  pillars: {
    madeHere: {
      title: "Made here",
      body: "Since 2007, we’ve been whipping up small-batch gelato and sorbets at our kitchen in Base II — the only frozen treats made right here in Whistler.",
    },
    seaToSky: {
      title: "Sea to Sky sourced",
      body: "We source ingredients from the Sea to Sky, celebrate the community that shaped us, and never forget where we come from.",
    },
    adventure: {
      title: "Powered by adventure",
      body: "Inspired by the peaks and powered by a love of adventure, our gelato is playful, handmade, and full of local flavour.",
    },
    whistler: {
      title: "Just like Whistler",
      body: "For us, gelato isn’t just dessert — it’s an experience. Bold, joyful, a little whimsical.",
    },
  },
  lucia: {
    eyebrow: "Living the Whistler lifestyle",
    title: "Meet Lucia",
    body: "Lucia is no ordinary bear. She’s a Whistler bear — and our beloved mascot. No matter the season, you can find her eating a cone anywhere: on the slopes, at the pump track, or at one of her favourite lakeside spots.\n\nShe’s a true local, just like us. Every new flavour is a chance for Lucia to try a new mountainside adventure — look for her on every pint.",
    illustration: img("/bears/ski-jump-white.png", "", 616, 560),
  },
  sayHi: {
    title: "Come say hi",
    intro: "Questions, ideas, or a flavour you’re dreaming of? We’d love to hear from you.",
    contactLabel: "Contact us",
    findUsLabel: "Find Lucia",
  },
};

export type AboutPage = typeof aboutPage;
