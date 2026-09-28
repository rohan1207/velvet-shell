export const collections = [
  {
    slug: "the-shell-edit",
    name: "The Shell Edit",
    line: "Sculptural gold, drawn with quiet architecture.",
  },
  {
    slug: "pearls-of-nacre",
    name: "Lumen Line",
    line: "Fine gold and light, worn close to the skin.",
  },
  {
    slug: "gilded-tide",
    name: "Gilded Tide",
    line: "Worn like water. Held like architecture.",
  },
  {
    slug: "private-atelier",
    name: "Private Atelier",
    line: "Made in small numbers. Never hurried.",
  },
];

export const categories = [
  { slug: "necklaces", name: "Necklaces" },
  { slug: "earrings", name: "Earrings" },
  { slug: "rings", name: "Rings" },
  { slug: "bracelets", name: "Bracelets" },
  { slug: "cuffs", name: "Cuffs" },
];

export const products = [
  {
    slug: "nacre-collar",
    name: "Nacre Collar",
    collection: "the-shell-edit",
    category: "necklaces",
    price: 8400,
    limited: true,
    madeToOrder: true,
    badge: "Atelier",
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-nacre-collar.png",
    gallery: ["/images/product-nacre-collar.png", "/images/wear-nacre-collar.png"],
    hoverImage: "/images/wear-nacre-collar.png",
    description:
      "An architectural collar of 18k champagne gold — clean links, quiet weight, designed to sit on the collarbone with presence and restraint.",
    story:
      "Drawn for the reveal. Brushed gold, polished at the edges so it catches only the last of the light.",
    details: [
      "18k champagne gold",
      "Sculptural collar links",
      "Inner circumference 36 cm",
      "Handmade in Jaipur",
    ],
    care: "Wipe with a soft dry cloth after wearing. Store in the suede pouch, alone.",
  },
  {
    slug: "tide-drops",
    name: "Tide Drops",
    collection: "gilded-tide",
    category: "earrings",
    price: 2180,
    limited: false,
    madeToOrder: false,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-tide-drops.png",
    gallery: ["/images/product-tide-drops.png", "/images/wear-tide-drops.png"],
    hoverImage: "/images/wear-tide-drops.png",
    description:
      "Elongated champagne-gold drops that fall with quiet gravity. Tapered forms, a soft diamond sparkle at each tip.",
    story: "A study in line and light. Gold as the tide.",
    details: ["18k champagne gold", "Diamond accents", "Post and butterfly", "Length 6.2 cm", "Handmade in Jaipur"],
    care: "Remove before bathing. Store hanging or lying flat.",
  },
  {
    slug: "abalone-signet",
    name: "Abalone Signet",
    collection: "private-atelier",
    category: "rings",
    price: 3240,
    limited: true,
    madeToOrder: true,
    badge: "Limited",
    metal: ["18k Champagne Gold"],
    sizes: ["5", "6", "7", "8", "9"],
    image: "/images/product-abalone-signet.png",
    gallery: ["/images/product-abalone-signet.png", "/images/wear-abalone-signet.png"],
    hoverImage: "/images/wear-abalone-signet.png",
    description:
      "A heavy signet with a polished oval face and a champagne diamond set flush. Classic weight, contemporary quiet.",
    story: "A private seal — gold that speaks softly.",
    details: ["18k champagne gold", "Champagne diamond", "Face 16 × 13 mm", "Comfort fit", "Made to order, 3 weeks"],
    care: "Avoid knocks and chemicals. Polish gold gently with a soft cloth.",
  },
  {
    slug: "velvet-cuff",
    name: "Velvet Cuff",
    collection: "the-shell-edit",
    category: "cuffs",
    price: 6900,
    limited: true,
    madeToOrder: true,
    badge: "Atelier",
    metal: ["18k Champagne Gold"],
    sizes: ["S / M", "M / L"],
    image: "/images/product-velvet-cuff.png",
    gallery: ["/images/product-velvet-cuff.png", "/images/wear-velvet-cuff.png"],
    hoverImage: "/images/wear-velvet-cuff.png",
    description:
      "A wide open cuff — liquid polish outside, satin within. Opens just enough to slip over the wrist.",
    story: "Named for the way gold feels when it has been worked for a long time. Not fabric. Weight.",
    details: ["18k champagne gold", "Open cuff", "Width 42 mm", "Handmade in Jaipur"],
    care: "Slide on — never force. Wipe after wear.",
  },
  {
    slug: "lumen-choker",
    name: "Lumen Choker",
    collection: "pearls-of-nacre",
    category: "necklaces",
    price: 4820,
    limited: false,
    madeToOrder: false,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-lumen-choker.png",
    gallery: ["/images/product-lumen-choker.png", "/images/wear-lumen-choker.png"],
    hoverImage: "/images/wear-lumen-choker.png",
    description:
      "A close collar of fine champagne gold with spaced diamond stations — light held quietly against the throat.",
    story: "Lumen, from the Latin for light. Gold that behaves like lamps.",
    details: ["18k champagne gold", "Diamond stations", "Length 34 cm + 4 cm extender", "Clasp in gold"],
    care: "Cloth only. Never ultrasonic.",
  },
  {
    slug: "nautilus-ear-cuff",
    name: "Nautilus Ear Cuff",
    collection: "the-shell-edit",
    category: "earrings",
    price: 1680,
    limited: false,
    madeToOrder: false,
    badge: "New",
    metal: ["18k Champagne Gold"],
    sizes: ["Right ear", "Left ear"],
    image: "/images/product-nautilus-cuff.png",
    gallery: ["/images/product-nautilus-cuff.png", "/images/wear-nautilus-cuff.png"],
    hoverImage: "/images/wear-nautilus-cuff.png",
    description:
      "A minimal cuff that wraps the ear with sculptural gold. No piercing required — it holds by architecture.",
    story: "A quiet spiral, worn.",
    details: ["18k champagne gold", "Clip architecture, no piercing", "Handmade"],
    care: "Ease on from the top of the ear. Do not bend the form.",
  },
  {
    slug: "foam-bracelet",
    name: "Foam Bracelet",
    collection: "pearls-of-nacre",
    category: "bracelets",
    price: 2940,
    limited: false,
    madeToOrder: false,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-foam-bracelet.png",
    gallery: ["/images/product-foam-bracelet.png", "/images/wear-foam-bracelet.png"],
    hoverImage: "/images/wear-foam-bracelet.png",
    description:
      "A slim champagne-gold line with tiny diamond stations — light enough to forget, precise enough to remember.",
    story: "The least of our pieces. The one that is worn every day.",
    details: ["18k champagne gold", "Diamond stations", "Length 18 cm", "Box clasp"],
    care: "Last on, first off. Keep away from water and scent.",
  },
  {
    slug: "gilded-conch",
    name: "Gilded Conch",
    collection: "gilded-tide",
    category: "necklaces",
    price: 5120,
    limited: true,
    madeToOrder: true,
    badge: "Limited",
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-conch-pendant.png",
    gallery: ["/images/product-conch-pendant.png", "/images/wear-conch-pendant.png"],
    hoverImage: "/images/wear-conch-pendant.png",
    description:
      "A refined teardrop pendant in 18k gold on a fine chain that almost disappears. Presence without noise.",
    story: "We asked the goldsmiths to keep the silhouette light. The emptiness is the point.",
    details: ["18k champagne gold", "Sculptural pendant", "Chain 55 cm", "Pendant 48 mm"],
    care: "Wipe after wear. Avoid water and perfume on the clasp.",
  },
  {
    slug: "whisper-hoops",
    name: "Whisper Hoops",
    collection: "gilded-tide",
    category: "earrings",
    price: 1980,
    limited: false,
    madeToOrder: false,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-whisper-hoops.png",
    gallery: ["/images/product-whisper-hoops.png", "/images/wear-whisper-hoops.png"],
    hoverImage: "/images/wear-whisper-hoops.png",
    description:
      "Large hoops with a mixed surface — brushed, then quietly polished. Almost nothing, and then one true thing.",
    story: "For the days that need almost nothing.",
    details: ["18k champagne gold", "Diameter 42 mm", "Hinged closure"],
    care: "Close the hinge fully. Wipe with a soft cloth.",
  },
  {
    slug: "moon-band",
    name: "Moon Band",
    collection: "pearls-of-nacre",
    category: "rings",
    price: 2460,
    limited: false,
    madeToOrder: true,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["5", "6", "7", "8", "9"],
    image: "/images/product-moon-band.png",
    gallery: ["/images/product-moon-band.png", "/images/wear-moon-band.png"],
    hoverImage: "/images/wear-moon-band.png",
    description:
      "A slim gold band holding a single brilliant diamond — soft against the finger, serious in its quiet.",
    story: "A ring for people who do not need a stone to shout.",
    details: ["18k champagne gold", "Single diamond", "Band 2.2 mm", "Made to order, 2 weeks"],
    care: "Remove for pools and harsh chemicals.",
  },
  {
    slug: "dusk-studs",
    name: "Dusk Studs",
    collection: "private-atelier",
    category: "earrings",
    price: 1280,
    limited: false,
    madeToOrder: false,
    badge: "New",
    metal: ["18k Champagne Gold"],
    sizes: ["One size"],
    image: "/images/product-dusk-studs.png",
    gallery: ["/images/product-dusk-studs.png", "/images/wear-dusk-studs.png"],
    hoverImage: "/images/wear-dusk-studs.png",
    description:
      "Tiny champagne-gold studs with a breath of diamond. The smallest pieces we make — designed to be lived in.",
    story: "Dusk, because they only appear when you look for them.",
    details: ["18k champagne gold", "Diamond accent", "Post and butterfly", "Width 9 mm"],
    care: "Sleep in them if you wish. Take them off for the sea.",
  },
  {
    slug: "tidal-chain",
    name: "Tidal Chain",
    collection: "gilded-tide",
    category: "necklaces",
    price: 3180,
    limited: false,
    madeToOrder: false,
    badge: null,
    metal: ["18k Champagne Gold"],
    sizes: ["50 cm", "60 cm", "70 cm"],
    image: "/images/product-tidal-chain.png",
    gallery: ["/images/product-tidal-chain.png", "/images/wear-tidal-chain.png"],
    hoverImage: "/images/wear-tidal-chain.png",
    description:
      "A long, fine champagne-gold chain. Layer it. Sleep in it. Forget it is gold.",
    story: "The chain is the tide.",
    details: ["18k champagne gold", "Drawn cable chain", "Choose length"],
    care: "Unclasp to remove. Do not pull over the head.",
  },
  {
    slug: "moonlit-strand",
    name: "Moonlit Strand",
    collection: "pearls-of-nacre",
    category: "necklaces",
    price: 7240,
    limited: true,
    madeToOrder: true,
    badge: "Atelier",
    metal: ["18k Champagne Gold"],
    sizes: ["Opera, 90 cm"],
    image: "/images/product-moonlit-strand.png",
    gallery: ["/images/product-moonlit-strand.png", "/images/wear-moonlit-strand.png"],
    hoverImage: "/images/wear-moonlit-strand.png",
    description:
      "An opera-length strand of fine gold with subtle diamond stations. Double it. Triple it. Let it fall.",
    story: "Length is the luxury. Light is the point.",
    details: ["18k champagne gold", "Diamond stations", "90 cm", "Made in Jaipur"],
    care: "Put on after perfume has dried. Wipe after wear.",
  },
  {
    slug: "chamber-stack",
    name: "Chamber Stack",
    collection: "private-atelier",
    category: "rings",
    price: 3860,
    limited: true,
    madeToOrder: true,
    badge: "Set of three",
    metal: ["18k Champagne Gold"],
    sizes: ["5", "6", "7", "8", "9"],
    image: "/images/product-chamber-stack.png",
    gallery: ["/images/product-chamber-stack.png", "/images/wear-chamber-stack.png"],
    hoverImage: "/images/wear-chamber-stack.png",
    description:
      "Three organic bands, meant to be worn as one chamber. One holds a tiny diamond. Together they read as a single piece.",
    story: "A stack is a conversation. These three already know each other.",
    details: ["18k champagne gold, set of three", "One diamond accent", "Organic cast", "Sold as a set", "Made to order"],
    care: "Wear together. Store together.",
  },
];

export function getProduct(slug) {
  return products.find((item) => item.slug === slug) ?? null;
}

export function getRelated(slug, count = 4) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, count);
  return products
    .filter((item) => item.slug !== slug)
    .sort((a, b) => {
      const aScore = (a.collection === current.collection ? 2 : 0) + (a.category === current.category ? 1 : 0);
      const bScore = (b.collection === current.collection ? 2 : 0) + (b.category === current.category ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, count);
}

export function collectionName(slug) {
  return collections.find((item) => item.slug === slug)?.name ?? slug;
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((item) =>
    [item.name, item.description, item.category, collectionName(item.collection)].join(" ").toLowerCase().includes(q)
  );
}
