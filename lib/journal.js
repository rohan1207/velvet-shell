export const journal = [
  {
    slug: "nacre-remembers-light",
    title: "How nacre remembers light",
    eyebrow: "Material",
    date: "August 2026",
    read: "4 min",
    image: "/images/still-nacre.png",
    excerpt:
      "A pearl is not a stone. It is a slow architecture of light, laid down in silence, one season at a time.",
    body: [
      "Nacre is built the way a day is built — in layers too thin to notice until there are thousands of them. What we call iridescence is only memory. The shell is recalling every angle of sun it has ever held.",
      "At Velvet Shell we do not round pearls into obedience. We look for the ones that kept their weather. A ridge, a blush, a refusal to sit still. These are not flaws. They are the record.",
      "Gold, beside nacre, should behave like a quiet room. We brush it, then polish only the places where a thumb might rest. The pearl remains the one that speaks.",
    ],
  },
  {
    slug: "week-in-jaipur",
    title: "A week in the Jaipur atelier",
    eyebrow: "House",
    date: "June 2026",
    read: "6 min",
    image: "/images/atelier-hands.png",
    excerpt:
      "Before a clasp is a clasp it is a conversation. The goldsmiths work in daylight, and they do not hurry the metal.",
    body: [
      "The atelier sits behind a limewashed wall in the old city. There is no sign. There is a bowl of pearls on the windowsill and a kettle that is never quite empty.",
      "Monday is for looking. We lay out nacre on linen and wait to see which pieces want to live together. Matching is a factory idea. We wait for kinship instead.",
      "By Thursday the gold has been drawn, cut, and quietly persuaded into architecture. The last two days are for setting — the slow work of making a pearl feel as if it grew there.",
    ],
  },
  {
    slug: "wearing-less",
    title: "On wearing less, better",
    eyebrow: "Notes",
    date: "March 2026",
    read: "3 min",
    image: "/images/look-lumen.png",
    excerpt:
      "A single true piece will do more than a tray of almosts. Jewelry should feel like a decision, not a decoration.",
    body: [
      "We make fewer things than a house of this size is supposed to. That is not a marketing sentence. It is the only way the work stays awake.",
      "Wear the collar with a white shirt. Wear the studs to sleep. Wear the chain until you forget the clasp is gold. The point is not to be seen collecting jewelry. The point is to be changed, slightly, by one object.",
      "If you already own something you love, we would rather you keep it. Velvet Shell is for the space that is still empty, and honest about it.",
    ],
  },
  {
    slug: "architecture-of-a-shell",
    title: "The architecture of a shell",
    eyebrow: "Form",
    date: "January 2026",
    read: "5 min",
    image: "/images/salon-interior.png",
    excerpt:
      "Every piece begins as a section through a chamber — not as a sketch of jewelry, but as a drawing of space.",
    body: [
      "A nautilus does not decorate itself. It builds a room, then another, then another, each one a little larger, each one still the same idea. That is the only brief we give the goldsmiths.",
      "The Velvet Cuff is a wall. The Nacre Collar is a threshold. The ear cuff is a staircase that happens to fit an ear.",
      "When a piece is finished we ask only one question: would a shell recognise itself. If the answer is no, it does not leave the atelier.",
    ],
  },
];

export function getJournal(slug) {
  return journal.find((item) => item.slug === slug) ?? null;
}
