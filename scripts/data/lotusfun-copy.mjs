/**
 * Lotus Fun product copy keyed by match aliases (normalized folder/name tokens).
 * descriptions are full PDP body; bullets become variant features (plus SKU).
 */

export function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/pedant/g, 'pendant')
    .replace(/lilly/g, 'lily')
    .replace(/bloosom/g, 'blossom')
    .replace(/pomegrante/g, 'pomegranate')
    .replace(/autum\b/g, 'autumn')
    .replace(/gems stone/g, 'gemstone')
    .replace(/forest-me-not/g, 'forget-me-not')
    .replace(/&/g, ' and ')
    .replace(/[\[\]()]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const BASE_BULLETS = [
  'Handmade With Love',
  'Unique Design',
  'Beautifully Packaged',
  'Free Worldwide Shipping',
  'Great For Gift',
];

function bullets(extra = []) {
  return [...BASE_BULLETS, ...extra.filter(Boolean)];
}

/** @type {Array<{aliases:string[], name:string, collection:string, material:string, description:string, bullets:string[], price?:number}>} */
export const COPY = [
  // —— Rings ——
  {
    aliases: ['lotus natural stone ring', 'lotus natural stone'],
    name: 'Lotus Natural Stone Ring',
    collection: 'lotus-whispers',
    material: 'Green Aventurine or Rose Quartz, Sterling Silver',
    description:
      'A delicate lotus rests beautifully against the organic character of natural stone, creating a piece that feels quietly drawn from nature.\n\nThe soft contrast between the sculpted silver lotus and the stone brings out the beauty of both — the cool sheen of the metal and the natural depth of the gemstone.\n\nA thoughtful piece for anyone who finds beauty in florals, nature, and jewellery with a story of its own.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4480,
  },
  {
    aliases: ['agate stone bee and honey'],
    name: 'Agate Stone Bee and Honey Ring',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A little bee rests delicately on a trail of golden honey, bringing together the charm of nature and the playful beauty of an unexpected form.\n\nThe sculpted honey detail gives the ring a sense of movement, while the tiny bee adds a delightful touch of character. Handcrafted in sterling silver with an 18K gold-plated finish, it is a whimsical piece made to catch the eye and invite a closer look.\n\nA lovely addition to a nature-inspired jewellery collection, or a thoughtful gift for someone who finds beauty in the little things.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4280,
  },
  {
    aliases: ['aquamarine stone butterfly ring', 'aquamarine stone butterfly'],
    name: 'Aquamarine Stone Butterfly Ring',
    collection: 'butterfly-meadow',
    material: 'Aquamarine, Sterling Silver, 18K Gold Plated',
    description:
      'A delicate butterfly rests above the luminous blue of aquamarine, bringing together two of nature’s most beautiful expressions — movement and stillness.\n\nThe cool, ocean-like stone gives the piece a sense of calm, while the sculpted butterfly adds a lightness that makes the ring feel almost ready to take flight. A nature-inspired piece with a quiet sense of transformation.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4580,
  },
  {
    aliases: ['bees kissing roses', 'bees kisses roses'],
    name: 'Bees Kissing Roses Ring',
    collection: 'fauna',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A little meeting between the garden and the hive, captured in a delicate piece of jewellery.\n\nThe design brings a bee and roses together in an unexpected little moment, balancing the softness of flowers with the lively character of a tiny winged visitor. A playful nature-inspired piece with a story waiting to be noticed.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3980,
  },
  {
    aliases: ['crystal flower in rain', 'crystal flower in the rain'],
    name: 'Crystal Flower In Rain Ring',
    collection: 'soft-rain-garden',
    material: 'Sterling Silver, White Quartz, Pink Quartz',
    description:
      'Like a flower caught just after a passing shower, this piece captures the quiet beauty of petals touched by light.\n\nThe crystal petals bring a soft luminosity to the design, while the silver stem curves naturally around the form. A delicate piece inspired by those fleeting moments when nature feels especially beautiful.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4180,
  },
  {
    aliases: ['flower adjustable ring'],
    name: 'Flower Adjustable Ring',
    collection: 'garden-path',
    material: 'Silver Plated, Resizable',
    description:
      'A small flower, shaped into a delicate ring that follows the natural softness of a bloom.\n\nIts adjustable form makes it easy to wear, while the floral centre gives the piece a simple, feminine character. An everyday design for anyone who likes a little nature woven into their jewellery.',
    bullets: bullets([]),
    price: 2980,
  },
  {
    aliases: ['flying swallow adjustable ring'],
    name: 'Flying Swallow Adjustable Ring',
    collection: 'birds-on-branch',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A swallow in flight becomes a quiet symbol of movement, freedom and new beginnings.\n\nThe open silhouette gives the ring a sense of lightness, while the birds create a graceful sense of motion around the finger. Designed to adjust comfortably, it is a meaningful piece for anyone drawn to the feeling of taking flight.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3890,
  },
  {
    aliases: [
      'lily of the valley flower natural crystal ring',
      'lily of the valley flower natural crystal',
    ],
    name: 'Lily Of The Valley Flower Natural Crystal Ring',
    collection: 'lily-of-the-valley',
    material: 'Sterling Silver, 18K Gold Plated, Natural White Crystal, Red Coral',
    description:
      'Inspired by the delicate bell-shaped flowers of Lily of the Valley, this ring brings a little wildflower elegance to the hand.\n\nThe fine floral details give it a soft, almost garden-like quality, while the natural crystal adds a subtle touch of luminosity. A graceful piece for those who love jewellery that feels closely connected to nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4480,
  },
  {
    aliases: ['pencil shaving shape', 'pencil shaving shape ring'],
    name: 'Pencil Shaving Shape Ring',
    collection: 'pencil-shavings',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'An everyday object becomes something unexpectedly beautiful.\n\nInspired by the delicate spiral of a pencil shaving, this design turns something usually discarded into a playful piece of wearable art. Clever, sculptural and a little unexpected, it is made for anyone who enjoys finding beauty where others might not look twice.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3680,
  },
  {
    aliases: ['phalaenopsis flower ring'],
    name: 'Phalaenopsis Flower Ring',
    collection: 'phalaenopsis',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The graceful Phalaenopsis orchid takes shape in silver, capturing the soft curves of one of nature’s most elegant blooms.\n\nIts sculptural floral form gives the ring a refined yet organic character. A thoughtful piece for anyone drawn to flowers that carry beauty with a quiet sense of strength.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3980,
  },
  {
    aliases: ['pink gems stone rings', 'pink gemstone ring', 'pink gemstone rings'],
    name: 'Pink Gemstone Ring',
    collection: 'gemstone-series',
    material: 'Pink Gemstone, Sterling Silver',
    description:
      'A soft pink gemstone takes centre stage, bringing a gentle touch of colour to an otherwise refined design.\n\nThe contrast between the natural stone and the sculpted metal keeps the piece elegant without making it feel overly ornate. A subtle choice for those who like their jewellery to carry a little colour and character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstone']),
    price: 3890,
  },
  {
    aliases: ['pomegranate fruits ring', 'pomegranate fruits'],
    name: 'Pomegranate Fruits Ring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the intricate beauty of a pomegranate, this ring transforms one of nature’s most fascinating fruits into wearable art.\n\nThe layered fruit and leaf details give the design an organic richness, celebrating the beauty found in forms we encounter every day. A distinctive piece for anyone who sees jewellery as a little story from nature.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 4180,
  },

  // —— Bracelets ——
  {
    aliases: ['flower in the rain bracelet', 'flower in the rain'],
    name: 'Flower In The Rain Bracelet',
    collection: 'soft-rain-garden',
    material: 'Sterling Silver, White Crystals',
    description:
      'A flower in full bloom, held delicately by a silver stem that curls around the wrist.\n\nThe crystal petals catch the light like tiny drops left behind after rain, giving the bracelet a soft, luminous quality. A beautiful expression of nature’s delicate resilience.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4680,
    categoryHint: 'bracelets',
  },
  {
    aliases: ['forget me not flower bracelet', 'forget me not flower'],
    name: 'Forget-Me-Not Flower Bracelet',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Small flowers, quiet meaning.\n\nInspired by the delicate Forget-Me-Not, this piece carries the sentiment of remembrance and connection in a form that feels soft and personal. A thoughtful design for yourself or someone you never want to forget.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3980,
    categoryHint: 'bracelets',
  },
  {
    aliases: ['lotus whispers bracelet', 'lotus whispers'],
    name: 'Lotus Whispers Bracelet',
    collection: 'lotus-whispers',
    material: 'Green Aventurine or Rose Quartz, Sterling Silver, 18K Gold Plated',
    description:
      'A delicate lotus rests beautifully against the organic character of natural stone, creating a piece that feels quietly drawn from nature.\n\nThe soft contrast between the sculpted silver lotus and the stone brings out the beauty of both — the cool sheen of the metal and the natural depth of the gemstone. A thoughtful piece for anyone who finds beauty in florals, nature and jewellery with a story of its own.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4480,
    categoryHint: 'bracelets',
  },
  {
    aliases: ['lotus whispers bangles', 'lotus whispers bangle'],
    name: 'Lotus Whispers Bangles',
    collection: 'lotus-whispers',
    material: 'Green Aventurine or Rose Quartz, Sterling Silver, 18K Gold Plated',
    description:
      'A silver lotus rests against a natural gemstone, bringing together the quiet beauty of a flower and the individuality of natural stone.\n\nThe organic character of the stone gives every piece its own presence, while the lotus creates a graceful focal point. An elegant bangle for anyone who prefers jewellery that feels considered rather than loud.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4680,
    categoryHint: 'bracelets',
    imageFallback: 'Lotus Whispers',
  },

  // —— Brooches ——
  {
    aliases: ['nandina flower brooch', 'nandina flower'],
    name: 'Nandina Flower Brooch',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the delicate structure of the Nandina flower, this brooch brings a botanical detail to your wardrobe.\n\nIts sculptural floral form makes it a beautiful accent for a lapel, scarf or dress — a small piece of nature that adds character without overwhelming the look.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3480,
    categoryHint: 'cuffs',
  },
  {
    aliases: ['calla lily brooch', 'calla lily', 'calla lilly'],
    name: 'Calla Lily Brooch',
    collection: 'calla-lily',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The elegant curves of a Calla Lily become a sculptural brooch designed to stay in bloom.\n\nIts graceful silhouette captures the natural movement of the flower, creating a refined accent for a blazer, scarf or dress. A timeless botanical piece that brings the beauty of a fresh bloom into something made to last.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3680,
    categoryHint: 'cuffs',
  },
  {
    aliases: ['sacred bamboo flower brooch', 'sacred bamboo flower'],
    name: 'Sacred Bamboo Flower Brooch',
    collection: 'soft-bloom',
    material: 'Sterling Silver',
    description:
      'Inspired by bamboo’s quiet resilience and its ability to keep growing forward, this brooch turns a natural form into a graceful wearable detail.\n\nThe delicate botanical silhouette feels understated yet meaningful — a piece that carries the beauty of nature along with the symbolism of strength and renewal.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3280,
    categoryHint: 'cuffs',
  },

  // —— Chains / Necklaces (base) ——
  {
    aliases: ['chain', 'chain necklace'],
    name: 'Chain Necklace',
    collection: 'chain-necklace',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Sometimes the simplest piece is the one that gives everything else room to shine.\n\nThis classic chain is designed to pair effortlessly with pendants, or to be worn alone for a clean, understated look. Its versatility makes it an easy everyday essential.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 2499,
    categoryHint: 'necklaces',
  },
  {
    aliases: ['choker chain'],
    name: 'Choker Chain',
    collection: 'chain-necklace',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A closer, more delicate take on the classic chain, designed to sit neatly around the neckline.\n\nMinimal enough to wear alone and versatile enough to layer, it creates an effortless base for pendants and other necklaces. A simple piece that works beautifully across different looks.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 2499,
    categoryHint: 'necklaces',
  },

  // —— Earrings (named) ——
  {
    aliases: ['honeybee earring', 'honey bee earring'],
    name: 'Honeybee Earring',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The honeybee brings a little sweetness from nature into this delicate pair of earrings.\n\nBeyond its playful form, the bee represents the quiet work and balance that keeps nature flourishing. A charming choice for anyone who loves jewellery with a little personality and a story behind it.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3180,
  },
  {
    aliases: ['leaf hoop earring', 'leafhoop earring'],
    name: 'Leaf Hoop Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A classic hoop takes inspiration from the simple beauty of leaves.\n\nThe organic leaf detail softens the clean circular form, creating an earring that feels natural, light and easy to wear. A subtle way to bring a little of the outdoors into everyday dressing.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3480,
  },
  {
    aliases: ['autumn tree branch', 'autum tree branch'],
    name: 'Autumn Tree Branch Earrings',
    collection: 'autumn-leaf',
    material: 'Sterling Silver',
    description:
      'A delicate branch seems to grow naturally from the ear, capturing the quiet beauty of trees in autumn.\n\nThe curved silhouette gives the earrings a sense of movement, as though a small piece of the landscape has been caught mid-season. Elegant, organic and quietly expressive.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3680,
  },
  {
    aliases: ['butterfly stud', 'butterfly stud gold silver', 'butterfly stud silver gold'],
    name: 'Butterfly Stud',
    collection: 'butterfly-meadow',
    material: 'Sterling Silver, 18K Gold Plated, Mother of Pearl',
    description:
      'A tiny butterfly, captured in a moment of stillness.\n\nThe delicate silhouette brings a sense of lightness and transformation to the ear, making these studs easy to wear while still carrying a little meaning. A simple nature-inspired piece for everyday moments.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3180,
  },
  {
    aliases: ['chrysanthemum flower dangle long'],
    name: 'Chrysanthemum Flower Dangle Long',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A chrysanthemum unfolds into an elongated silhouette designed to move gently with you.\n\nThe layered floral form gives the earrings their character, while the long drop adds an elegant sense of movement. A botanical piece that feels delicate, expressive and beautifully considered.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3980,
  },
  {
    aliases: ['curved branches leaves asymmetric', 'curved branches and leaves asymmetric'],
    name: 'Curved Branches & Leaves Asymmetric Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Nature rarely grows in perfect symmetry — and this pair celebrates exactly that.\n\nCurved branches and delicate leaves move differently on either side, creating an asymmetric design that feels organic rather than rigid. A distinctive piece for anyone who likes jewellery with an artistic point of view.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3890,
  },
  {
    aliases: [
      'dragonfly removable assemblable baroque pearl',
      'dragonflyremovable assembleable baroque pearl',
      'dragonfly removable assembleable baroque pearl',
    ],
    name: 'Dragonfly Removable Assemblable Baroque Pearl Earrings',
    collection: 'dragonfly',
    material: 'Sterling Silver, 18K Gold Plated, Baroque Pearl',
    description:
      'A delicate dragonfly meets the natural individuality of a baroque pearl.\n\nThe airy wings contrast beautifully with the organic shape of the pearl, while the removable design gives you the freedom to style the piece in different ways. A graceful design inspired by movement, transformation and nature’s imperfect beauty.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Pearl']),
    price: 4280,
  },
  {
    aliases: ['dripping honey and bee', 'dripping honey bee', 'dripping honeybee', 'dripping honey and bee stud'],
    name: 'Dripping Honey & Bee Earrings',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A little bee rests against a flowing trail of honey, turning one of nature’s sweetest moments into jewellery.\n\nThe fluid honey form brings movement to the design, while the bee adds a small touch of character. Whimsical, detailed and unmistakably inspired by the natural world.',
    bullets: bullets(['Authentic 925 Sterling Silver']),
    price: 3680,
  },
  {
    aliases: ['elegant flower stud'],
    name: 'Elegant Flower Stud',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A simple floral silhouette, shaped with the quiet charm of a flower just beginning to bloom.\n\nThe softly sculpted petals give these studs an understated character, while the choice of silver or warm gold tones lets the design shift effortlessly between everyday and occasion dressing.\n\nA graceful addition to a jewellery collection for anyone who prefers nature-inspired details with a clean, timeless finish.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['epipremnum aureum dangle drop'],
    name: 'Epipremnum Aureum Dangle Drop',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the trailing beauty of Epipremnum Aureum, this dangle design brings the organic movement of leaves into a delicate jewellery form.\n\nIts flowing silhouette gives the piece an easy sense of movement, creating a botanical accent that feels distinctive without being overwhelming.\n\nA thoughtful choice for nature lovers and anyone drawn to jewellery that takes its cues from the forms found outdoors.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['flower design dangle earring', 'flower design dangle'],
    name: 'Flower Design Dangle',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A floral form takes on a graceful sense of movement in this delicate dangle earring.\n\nThe elongated silhouette lets the flower catch the light as it moves, creating a piece that feels feminine without losing its sculptural character.\n\nEasy to dress up yet distinctive enough to stand on its own, it makes a lovely addition to a nature-inspired jewellery wardrobe.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['flower earring'],
    name: 'Flower Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A flower brought down to its most graceful form, this earring celebrates the simple beauty of petals and natural curves.\n\nThe sculpted floral shape gives it a soft presence, while the polished metal adds a subtle gleam that works beautifully against both everyday and occasion looks.\n\nA versatile piece for someone who prefers jewellery that feels inspired by nature without being overly ornate.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['flower in the rain earring', 'flower in the rain'],
    name: 'Flower In The Rain Earrings',
    collection: 'soft-rain-garden',
    material: 'Sterling Silver, White Crystals',
    description:
      'Five delicate petals come together like a flower caught beneath a soft shower, creating the signature beauty of this design.\n\nThe sculpted petals are held by a twisting sterling silver stem, giving the earring an organic sense of movement and a beautifully composed silhouette.\n\nA distinctive floral piece for anyone who loves jewellery that feels as though it has been lifted straight from nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
    categoryHint: 'earrings',
  },
  {
    aliases: ['flower stud'],
    name: 'Flower Stud',
    collection: 'garden-path',
    material: 'Sterling Silver',
    description:
      'A tiny bloom, thoughtfully translated into a pair of wearable studs.\n\nThe compact floral form keeps the design effortless, while carefully shaped petals give it enough detail to remain interesting up close.\n\nMade for everyday moments, these are the kind of earrings that quietly bring a little of the natural world into your personal style.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
  },
  {
    aliases: ['forget me not flower earring', 'forget me not flower'],
    name: 'Forget-Me-Not Flower Earrings',
    collection: 'forget-me-not',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Small, delicate and full of meaning, the Forget-Me-Not has long been associated with remembrance, loyalty and enduring affection.\n\nIts tiny floral form translates beautifully into jewellery, creating a piece that feels intimate rather than imposing.\n\nA thoughtful choice for keeping a person, memory or feeling a little closer — whether gifted or worn for yourself.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
    categoryHint: 'earrings',
  },
  {
    aliases: ['agate forest me not flower stud', 'agate forget me not flower stud'],
    name: 'Agate Forget-Me-Not Flower Stud',
    collection: 'forget-me-not',
    material: 'Sterling Silver, 18K Gold Plated, Agate',
    description:
      'Tiny Forget-Me-Not blooms meet the natural character of agate in these delicate studs.\n\nThe floral form carries the gentle symbolism of remembrance, while the stone adds depth and individuality to each pair.\n\nA thoughtful everyday piece for anyone who likes jewellery with quiet meaning.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3280,
    categoryHint: 'earrings',
  },
  {
    aliases: ['bamboo charm stud'],
    name: 'Bamboo Charm Stud',
    collection: 'bamboo-grove',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The quiet strength of bamboo becomes a delicate stud for the ear.\n\nIts slender form brings an organic touch to everyday dressing, while the clean finish keeps the piece light and versatile.\n\nA meaningful choice for someone who appreciates understated jewellery with a connection to nature and growth.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
    categoryHint: 'earrings',
  },
  {
    aliases: ['begonia flower stud'],
    name: 'Begonia Flower Stud',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A begonia bloom, distilled into a compact floral stud.\n\nSculpted petals give the design enough detail to stay interesting up close, while the small silhouette keeps it easy for everyday wear.\n\nA soft botanical accent for anyone who likes a little garden character at the ear.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
    categoryHint: 'earrings',
  },
  {
    aliases: ['camellia flower stud'],
    name: 'Camellia Flower Stud',
    collection: 'camellia',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A camellia bloom becomes a refined stud designed to sit neatly against the ear.\n\nThe sculpted petals give the flower a sense of depth, while the compact form keeps the piece easy to wear from day to evening.\n\nA graceful botanical accent with the quiet symbolism of affection and admiration.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
    categoryHint: 'earrings',
  },
  {
    aliases: ['nandina flower earrings', 'nandina flower earring'],
    name: 'Nandina Flower Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the delicate structure of the Nandina plant, these earrings bring botanical detailing into a refined silhouette.\n\nThe fine arrangement of leaves and floral elements creates a naturally composed design that feels intricate without appearing heavy.\n\nA distinctive addition for someone who enjoys jewellery with an organic character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
    categoryHint: 'earrings',
  },
  {
    aliases: ['amber dragonfly'],
    name: 'Amber Dragonfly Earrings',
    collection: 'dragonfly',
    material: 'Sterling Silver, 18K Gold Plated, Amber',
    description:
      'A dragonfly takes flight in warm amber tones, capturing the lightness of wings in a wearable form.\n\nThe sculpted silhouette brings movement to the ear, while the amber detail adds a soft glow against the metal.\n\nA nature-inspired piece for anyone drawn to transformation, flight and quiet beauty.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3680,
    categoryHint: 'earrings',
  },
  {
    aliases: ['bird stud'],
    name: 'Bird Stud',
    collection: 'birds-on-branch',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A tiny bird, captured in a moment of stillness at the ear.\n\nThe compact stud silhouette keeps the design easy to wear, while the avian form carries a quiet sense of freedom and new beginnings.\n\nA charming everyday piece for anyone who likes jewellery with a little life in it.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
    categoryHint: 'earrings',
  },
  {
    aliases: ['dragonfly earrings', 'dragonfly earring'],
    name: 'Dragonfly Earrings',
    collection: 'dragonfly',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Delicate dragonfly forms bring a sense of movement and lightness to the ear.\n\nAiry wings and fine detailing create a piece that feels expressive without becoming oversized.\n\nA graceful choice for anyone drawn to jewellery inspired by transformation and flight.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
    categoryHint: 'earrings',
  },
  {
    aliases: ['dragonfly hoops', 'dragonfly hoop'],
    name: 'Dragonfly Hoops',
    collection: 'dragonfly',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Classic hoops meet the airy silhouette of a dragonfly in this nature-led design.\n\nThe winged detail softens the circular form, creating earrings that feel light, organic and easy to wear.\n\nA distinctive everyday pair for someone who likes jewellery with a quiet sense of movement.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
    categoryHint: 'earrings',
  },
  {
    aliases: ['forget me not flower hoop'],
    name: 'Forget-Me-Not Flower Hoop',
    collection: 'forget-me-not',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A familiar hoop takes on a softer character with the delicate presence of Forget-Me-Not flowers.\n\nThe floral detailing adds movement and personality while keeping the overall silhouette easy to wear.\n\nA meaningful everyday piece for anyone who loves jewellery that carries a little sentiment beneath its beauty.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['french style iris flower long drop'],
    name: 'French Style Iris Flower Long Drop',
    collection: 'iris-flower',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the iris, a flower long associated with beauty, elegance and a regal presence, this long-drop design has a distinctly graceful character.\n\nThe elongated floral form creates a gentle line along the face, while the contrast of silver and gold details brings depth to the design.\n\nA statement-making pair for celebrations, evening occasions or simply days when a little more beauty feels right.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 4280,
  },
  {
    aliases: [
      'freshwater pearl classic four leaf clover pear dangle drop earrings',
      'freshwater pearl classic four leaf clover pear long drop',
    ],
    name: 'Freshwater Pearl Classic Four Leaf Clover Pear Long Drop',
    collection: 'clover-lumen',
    material: 'Sterling Silver, 18K Gold Plated, Freshwater Pearls',
    description:
      'A graceful four-leaf form meets the natural lustre of freshwater pearls in this elegant long-drop design.\n\nThe soft sheen of the pearl brings a gentle contrast to the sculpted floral silhouette, while the elongated drop gives the earrings an elegant sense of movement.\n\nA thoughtful piece for weddings, celebrations or anyone who likes classic pearls with a more unexpected botanical character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4480,
  },
  {
    aliases: ['ginkgo leaf and butterfly earring'],
    name: 'Ginkgo Leaf And Butterfly Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A butterfly rests lightly against a ginkgo leaf, bringing together two of nature’s most evocative forms.\n\nThe flowing arrangement creates a sense of transformation and movement, while the combination of sterling silver and gold-plated details gives the piece a warm, sculptural finish.\n\nA distinctive choice for anyone drawn to jewellery that carries both natural beauty and quiet symbolism.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['gold plated flower design dangle earring'],
    name: 'Gold Plated Flower Design Dangle Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A sculpted flower takes centre stage in this graceful gold-toned dangle.\n\nThe layered floral form creates depth and movement, allowing the design to catch light with every turn.\n\nElegant enough for occasion dressing yet distinctive enough to become a signature piece, it brings a polished floral note to any look.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['honey comb stud', 'honeycomb stud'],
    name: 'Honeycomb Stud',
    collection: 'honeycomb',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by one of nature’s most beautiful geometric structures, the honeycomb brings a subtle architectural quality to these studs.\n\nThe clean hexagonal forms create a graphic contrast against the organic idea of the honeybee, while the gold and silver combination adds warmth and character.\n\nA playful yet refined choice for someone who likes their jewellery with an unexpected point of view.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['honeybee dangle', 'honey bee dangle'],
    name: 'HoneyBee Dangle',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A tiny honeybee takes flight in this charming dangle design.\n\nThe delicate bee silhouette adds movement to the earring, creating a playful piece that still retains the refined finish of sterling silver craftsmanship.\n\nA lovely choice for anyone who finds joy in small details and the beauty of nature’s tiniest creatures.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['honeybee silver and gold', 'honey bee silver and gold'],
    name: 'HoneyBee Silver & Gold',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A little honeybee, brought to life through the contrast of silver and warm gold.\n\nThe two-tone finish gives the design a playful dimension, while the carefully formed bee keeps the piece delicate and easy to wear.\n\nA charming addition to a nature-inspired jewellery collection, especially for someone who likes pieces with personality.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['honeybee stud', 'honey bee stud'],
    name: 'Honeybee Stud',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Small, charming and unmistakably inspired by nature, these honeybee studs bring a little character to everyday dressing.\n\nThe detailed bee form gives the earrings their personality, while the compact stud silhouette keeps them understated and versatile.\n\nA sweet choice for anyone who likes jewellery with a story hidden in the details.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
  },
  {
    aliases: ['iris flower'],
    name: 'Iris Flower Earrings',
    collection: 'iris-flower',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The iris has a naturally graceful form, and this piece captures that elegance in a sculpted floral silhouette.\n\nIts layered petals create a sense of depth, while the silver and gold tones add a refined contrast to the botanical design.\n\nA beautiful choice for someone who enjoys floral jewellery with a slightly more regal presence.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['iris flower dangle'],
    name: 'Iris Flower Dangle',
    collection: 'iris-flower',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'An iris bloom becomes a graceful moving form in this delicate dangle earring.\n\nThe floral silhouette falls softly from the ear, giving the piece an elegant vertical line while retaining the intricate character of the flower.\n\nA refined option for occasions that call for something feminine, distinctive and beautifully detailed.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['iris flower long drop'],
    name: 'Iris Flower Long Drop',
    collection: 'iris-flower',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A longer interpretation of the iris, designed to let the flower become the focal point.\n\nThe elongated form creates graceful movement around the face, while the sculpted petals retain the natural character of the bloom.\n\nA striking floral piece for evenings, celebrations and moments that deserve a little more presence.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3980,
  },
  {
    aliases: ['iris flower stud'],
    name: 'Iris Flower Stud',
    collection: 'iris-flower',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The iris is distilled into a more intimate silhouette with these floral studs.\n\nCarefully shaped petals create a sense of dimension while keeping the design neat and easy to wear.\n\nA lovely everyday choice for someone who prefers their statement to come through in detail rather than scale.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['jasmine'],
    name: 'Jasmine Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated, Mother of Pearl',
    description:
      'Inspired by the delicate jasmine flower, this piece carries the softness and warmth associated with one of nature’s most beloved blooms.\n\nThe floral form is paired with a gentle mother-of-pearl detail, creating a subtle play of colour and light.\n\nA sweet reminder of positivity and calm, made for someone who likes jewellery with a little feeling behind it.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3480,
  },
  {
    aliases: ['kiss from a bee'],
    name: 'Kiss From A Bee Earrings',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated, Natural Pink Mother of Pearl, White Nano-Ceramic',
    description:
      'A tiny bee appears to hover over a delicate flower, creating a charming moment frozen in jewellery.\n\nThe contrast between the warm gold-plated bee, pink mother of pearl and white ceramic gives the piece an almost storybook quality.\n\nPlayful yet elegant, it is made for someone who enjoys jewellery that invites a second look.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
  },
  {
    aliases: ['leaf earring'],
    name: 'Leaf Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A single leaf becomes the centre of this understated botanical design.\n\nThe organic shape brings softness to the silhouette, while the sculpted detailing gives the metal a sense of natural texture and movement.\n\nA versatile piece for anyone who prefers nature-inspired jewellery with an effortless, everyday quality.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['lilac flower designer drop earring'],
    name: 'Lilac Flower Designer Drop Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the clustered delicacy of lilac blossoms, this designer drop brings a softer floral rhythm to the ear.\n\nThe elongated arrangement gives the flowers room to move and catch the light, creating an elegant silhouette without feeling overly formal.\n\nA distinctive choice for floral lovers who appreciate jewellery with a little more artistic character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['lotus whispers earring', 'lotus whispers'],
    name: 'Lotus Whispers Earrings',
    collection: 'lotus-whispers',
    material: 'Green Aventurine or Rose Quartz, Sterling Silver, 18K Gold Plated',
    description:
      'A delicate lotus rests against the natural character of a gemstone, bringing together the cool sheen of silver and the organic depth of stone.\n\nThe lotus appears almost nestled into the gem, creating a quiet contrast between the sculpted flower and the natural surface beneath it.\n\nA meaningful choice for those drawn to florals, natural stones and jewellery that feels connected to nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
    categoryHint: 'earrings',
  },
  {
    aliases: ['magnolia earring'],
    name: 'Magnolia Earring',
    collection: 'magnolia',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The magnolia’s full bloom gives these earrings their sense of quiet grandeur.\n\nIts generous floral form is beautifully sculpted, allowing each petal to hold its own while coming together as a complete blossom.\n\nA refined choice for someone who appreciates floral jewellery with presence, symbolism and timeless elegance.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: [
      'minimalist pearl earrings crystal rhinestone leaf stud earrings',
      'minimalist pearl crystal rhinestone leaf stud',
    ],
    name: 'Minimalist Pearl Crystal Rhinestone Leaf Stud Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, Pearl, Crystal/Rhinestone',
    description:
      'A delicate leaf meets the soft lustre of pearl and the subtle sparkle of crystal details.\n\nThe combination creates a balanced contrast — organic leaf forms alongside the clean glimmer of the stones.\n\nA versatile choice when you want something understated for the day, yet detailed enough to carry into an evening look.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3480,
  },
  {
    aliases: ['monstera leaves'],
    name: 'Monstera Leaves Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver',
    description:
      'The distinctive silhouette of the monstera leaf gives these earrings an instantly recognisable botanical character.\n\nFine cut-out details bring the leaf to life, creating an airy design that feels organic while remaining contemporary.\n\nA beautiful choice for nature lovers who prefer jewellery with a stronger visual identity and a subtle connection to the natural world.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['natural crystal lily of the valley flower'],
    name: 'Natural Crystal Lily Of The Valley Flower Earrings',
    collection: 'lily-of-the-valley',
    material: 'Sterling Silver, Natural Crystal',
    description:
      'Inspired by the tiny bell-shaped blooms of lily of the valley, this piece brings an entire little moment from nature into jewellery.\n\nThe delicate floral form and natural crystal detail create a soft balance between sparkle and botanical character.\n\nA graceful choice for someone who finds beauty in the quieter, less obvious forms found in nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
  },
  {
    aliases: ['olives leaves', 'olive leaves'],
    name: 'Olive Leaves Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The understated form of olive leaves gives this design a calm, organic character.\n\nSlim leaves create a naturally flowing silhouette, bringing texture and movement without overwhelming the ear.\n\nA timeless botanical piece for someone who prefers jewellery inspired by nature in its most effortless form.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['osmanthus flower'],
    name: 'Osmanthus Flower Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Small blossoms and graceful detailing give the Osmanthus Flower Earring its delicate charm.\n\nThe floral design can be worn in silver or warm gold, allowing the same botanical silhouette to take on two distinct moods.\n\nA thoughtful piece for nature lovers, especially those drawn to jewellery that feels elegant without becoming too elaborate.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['pearl leaf earring'],
    name: 'Pearl Leaf Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated, Pearl',
    description:
      'A luminous pearl rests against a sculpted leaf, creating the feeling of a tiny drop of morning dew caught in nature.\n\nThe combination of the organic leaf shape and the classic pearl gives the design an elegant balance between earthy and refined.\n\nA versatile pair that works beautifully for everyday dressing as well as more polished occasions.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3480,
  },
  {
    aliases: ['pearl leave earring'],
    name: 'Pearl Leave Earring',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated, Pearl',
    description:
      'A softly sculpted leaf frames the natural glow of a pearl in this delicate botanical design.\n\nThe pearl adds a classic note, while the leaf keeps the overall look connected to the organic beauty of nature.\n\nA graceful choice for someone who likes timeless pearl jewellery with a less traditional silhouette.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3480,
  },
  {
    aliases: ['peony flower stud'],
    name: 'Peony Flower Stud',
    collection: 'peony',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The full, layered form of a peony gives these studs a rich floral character.\n\nSculpted petals create depth and a gentle sense of movement, while the silver or gold finish lets the bloom remain the focus.\n\nRomantic without being overly delicate, these are a beautiful choice for both everyday styling and special occasions.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['phalaenopsis flower hoop'],
    name: 'Phalaenopsis Flower Hoop',
    collection: 'phalaenopsis',
    material: 'Sterling Silver',
    description:
      'Classic hoops meet the sculptural elegance of orchid blooms in this distinctive design.\n\nThe flowers follow the curve of the hoop, creating a beautiful balance between structure and softness with every movement.\n\nLight and versatile, they bring a fresh botanical note to both casual dressing and more considered occasions.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['plum and snowflake'],
    name: 'Plum And Snowflake Earrings',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A meeting of delicate floral form and winter-inspired detail gives this piece its unusual character.\n\nThe contrasting motifs create a design that feels both seasonal and timeless, bringing together the softness of a blossom with the crisp geometry of a snowflake.\n\nA distinctive choice for someone who prefers jewellery that feels a little unexpected.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['plum bloosom', 'plum blossom'],
    name: 'Plum Blossom Earrings',
    collection: 'plum-blossom',
    material: 'Natural Pink Mother of Pearl, 18K Gold Plated, Sterling Silver',
    description:
      'A spray of plum blossoms captures the feeling of a garden coming back to life.\n\nPink mother-of-pearl flowers sit along a silver branch, with a warm gold detail adding depth to the composition.\n\nThe design carries the spirit of spring, renewal and resilience while remaining a striking piece of wearable art.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
  },
  {
    aliases: ['retro french vintage simple circle drop'],
    name: 'Retro French Vintage Simple Circle Drop',
    collection: 'vintage',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A simple circular silhouette takes on a vintage character through its proportions and delicate drop construction.\n\nThe design feels intentionally pared back, allowing its shape and finish to become the focus rather than relying on elaborate detailing.\n\nAn easy piece for adding a touch of old-world charm to contemporary dressing.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['tulip blossom long leaf dangle'],
    name: 'Tulip Blossom Long Leaf Dangle',
    collection: 'tulip',
    material: 'Sterling Silver, 18K Gold Plated, Mother of Pearl',
    description:
      'The graceful silhouette of a tulip meets the elongated shape of a leaf in this nature-led dangle.\n\nThe design creates a gentle vertical movement, with the flower and leaf working together like a small botanical composition.\n\nA romantic choice for someone who enjoys floral jewellery with a little more length and movement.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3680,
  },
  {
    aliases: ['tulip flower dangle drop'],
    name: 'Tulip Flower Dangle Drop',
    collection: 'tulip',
    material: 'Sterling Silver, 18K Gold Plated, Mother of Pearl',
    description:
      'Inspired by the unmistakable cup-like form of a tulip bud, this dangle brings a little botanical romance to the ear.\n\nThe floral form is paired with a graceful drop, allowing the piece to move naturally and catch the light.\n\nA beautiful option for romantic occasions, celebrations or simply adding a softer floral note to your style.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3480,
  },
  {
    aliases: ['vintage feather earring'],
    name: 'Vintage Feather Earring',
    collection: 'feather-sky',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A feather is translated into a refined, sculptural form in this vintage-inspired design.\n\nThe intricate feather detailing gives the earring a sense of movement, while the combination of sterling silver and gold plating brings a warm, polished finish.\n\nA distinctive piece for anyone drawn to symbols of freedom, movement and nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['wild rose flower stud'],
    name: 'Wild Rose Flower Stud',
    collection: 'wild-rose',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The wild rose brings together delicacy and a slightly untamed beauty in these sculpted studs.\n\nThe detailed floral form keeps the design expressive while the compact silhouette makes it easy to wear.\n\nA lovely choice for someone who appreciates the softer side of nature without wanting something overly conventional.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['winter bloosom and snow flower', 'winter blossom and snow flower'],
    name: 'Winter Blossom And Snow Flower Earrings',
    collection: 'frost-bloom',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by delicate blooms that appear against the stillness of winter, this design brings together softness and resilience.\n\nThe floral form carries a quiet seasonal beauty, while the snow-inspired details give the piece a slightly dreamlike quality.\n\nA thoughtful choice for someone who finds beauty in contrast — softness against strength, bloom against winter.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },

  // —— Necklaces ——
  {
    aliases: ['bamboo charm necklace'],
    name: 'Bamboo Charm Necklace',
    collection: 'bamboo-grove',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The quiet strength of bamboo becomes a delicate charm in this nature-inspired necklace.\n\nIts slender form brings an organic touch to the neckline, while the clean finish keeps the piece versatile enough for everyday styling.\n\nA meaningful choice for someone who appreciates understated jewellery with a connection to nature and growth.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['blooming anemone flower', 'blooming anemone'],
    name: 'Blooming Anemone Necklace',
    collection: 'blooming-anemone',
    material: 'Sterling Silver, 18K Gold Plated, Topaz, Garnet, Amethyst or Peridot',
    description:
      'A blooming anemone takes centre stage in this delicate nature-inspired design.\n\nThe layered flower creates a sense of depth, while the central gemstone detail adds a subtle point of colour and light.\n\nA beautiful piece for someone who likes jewellery that feels expressive, botanical and distinctly individual.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4280,
  },
  {
    aliases: ['calla lily flower', 'calla lilly flower'],
    name: 'Calla Lily Flower Necklace',
    collection: 'calla-lily',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The elegant curve of a calla lily translates naturally into a graceful pendant.\n\nIts sculpted petal creates a clean, flowing silhouette that feels refined without needing excessive ornamentation.\n\nA timeless botanical piece for someone who prefers jewellery inspired by the quiet sophistication of nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
    categoryHint: 'necklaces',
  },
  {
    aliases: ['camellia flower pendant', 'camellia flower pedant'],
    name: 'Camellia Flower Pendant',
    collection: 'camellia',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A camellia bloom becomes a delicate pendant designed to rest close to the heart.\n\nThe sculpted petals give the flower a refined sense of depth, while its simple silhouette keeps the piece easy to wear.\n\nA meaningful choice for celebrating affection, admiration and the quiet strength found in beautiful things.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['camellia flower with baroque pearl'],
    name: 'Camellia Flower With Baroque Pearl',
    collection: 'camellia',
    material: 'Sterling Silver, 18K Gold Plated, Baroque Pearl',
    description:
      'A sculpted camellia meets the naturally irregular beauty of a baroque pearl in this distinctive necklace.\n\nThe contrast between the structured bloom and the organic pearl creates a design that feels both polished and wonderfully imperfect.\n\nA beautiful choice for someone who appreciates the individuality of natural forms and jewellery with character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 4280,
  },
  {
    aliases: ['flower in the rain necklace', 'flower in the rain'],
    name: 'Flower In The Rain Necklace',
    collection: 'soft-rain-garden',
    material: 'Sterling Silver, Clear Quartz or Rose Quartz',
    description:
      'A five-petal flower appears suspended in a quiet moment, inspired by the feeling of a bloom after rainfall.\n\nThe delicate flower rests against a twisting sterling silver stem, creating a graceful botanical pendant with a gentle sense of movement.\n\nAvailable with clear or pink tones, it brings the poetry of nature to the neckline in a beautifully wearable form.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
    categoryHint: 'necklaces',
  },
  {
    aliases: ['forget me not flower necklace', 'forget me not flower'],
    name: 'Forget-Me-Not Flower Necklace',
    collection: 'forget-me-not',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A delicate Forget-Me-Not bloom makes this necklace feel like a small keepsake worn close to the heart.\n\nThe flower’s long association with remembrance and enduring affection gives the design a meaning that goes beyond its delicate appearance.\n\nA thoughtful piece for gifting to someone whose presence, memory or place in your life deserves to be remembered.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
    categoryHint: 'necklaces',
  },
  {
    aliases: [
      'forget me not flower small pendant',
      'forget me not flower small pedant',
    ],
    name: 'Forget-Me-Not Flower Small Pendant',
    collection: 'forget-me-not',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A smaller expression of the Forget-Me-Not, designed to sit delicately against the neckline.\n\nIts floral form carries the gentle symbolism of remembrance and affection while remaining subtle enough for everyday wear.\n\nA beautiful little keepsake for someone who values meaning in the details.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
  },
  {
    aliases: ['fresh redbud bell'],
    name: 'Fresh Redbud Bell Necklace',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the delicate form of a flowering redbud, this pendant brings together botanical detail and a softly sculptural silhouette.\n\nThe bell-like shape gives it a gentle sense of movement, making the pendant feel almost like a tiny bloom caught mid-sway.\n\nA distinctive choice for someone who prefers nature-inspired jewellery with an unusual point of view.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['heart shaped bee'],
    name: 'Heart Shaped Bee Necklace',
    collection: 'honey-atelier',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A tiny bee takes on a more intimate form through the shape of a heart.\n\nThe design brings together the charm of the honeybee and the universal language of affection, creating a pendant that feels playful without becoming overly sweet.\n\nA thoughtful gift for someone who brings a little sweetness into your life.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3180,
  },
  {
    aliases: ['hollow out butterfly pendant', 'hollow out butterfly pedant', 'hollow out butterfly'],
    name: 'Hollow-Out Butterfly Necklace',
    collection: 'butterfly-meadow',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The delicate outline of a butterfly is captured through an airy, openwork design.\n\nIts light silhouette gives the pendant a sense of movement, while the negative space keeps the piece feeling refined and contemporary.\n\nA lovely choice for anyone who sees beauty in transformation, freedom and the lighter side of nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['leaf pendant', 'leaf pedant'],
    name: 'Leaf Pendant',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A single leaf becomes a simple yet expressive pendant, celebrating the natural beauty of an organic form.\n\nThe sculpted contours give the piece dimension while keeping the overall silhouette clean and versatile.\n\nAn easy everyday piece for someone who likes their jewellery to feel close to nature without being overly ornate.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 2980,
  },
  {
    aliases: ['long feather'],
    name: 'Long Feather Necklace',
    collection: 'feather-sky',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A graceful feather extends into a slender pendant designed to create a sense of movement along the neckline.\n\nIts fine detailing gives the piece a light, almost weightless quality, while the elongated form makes it an elegant layering piece.\n\nA thoughtful choice for anyone drawn to the symbolism of freedom, movement and new beginnings.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
  },
  {
    aliases: ['lotus flower pendant', 'lotus flower pedant'],
    name: 'Lotus Flower Pendant',
    collection: 'lotus-series',
    material: 'Sterling Silver',
    description:
      'The lotus carries a quiet story of transformation — emerging from muddy water to bloom above it.\n\nThis pendant captures that symbolism in a clean floral silhouette, turning a familiar flower into something that can be carried close every day.\n\nA meaningful piece for someone who appreciates jewellery that holds a little more than beauty alone.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3280,
  },
  {
    aliases: ['nandina flower necklace', 'nandina flower'],
    name: 'Nandina Flower Necklace',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'Inspired by the delicate structure of the Nandina plant, this pendant brings botanical detailing into a refined silhouette.\n\nThe fine arrangement of leaves and floral elements creates a naturally composed design that feels intricate without appearing heavy.\n\nA distinctive addition to a nature-inspired collection for someone who enjoys jewellery with an organic character.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
    categoryHint: 'necklaces',
  },
  {
    aliases: [
      'olive leaves branch fruits aventurine gemstone pendant',
      'olive leaves branch fruit aventurine gemstone pendant',
      'olive leaves branch fruits aventurine gemstone pedant',
    ],
    name: 'Olive Leaves Branch Fruit Aventurine Gemstone Pendant',
    collection: 'garden-path',
    material: 'Sterling Silver, Aventurine Gemstone',
    description:
      'An olive branch, small fruits and natural aventurine come together in a pendant inspired by the quiet richness of the natural world.\n\nThe green gemstone adds depth to the silver botanical form, creating a contrast between polished metal and the organic variation of the stone.\n\nA beautiful choice for someone who likes jewellery that feels collected from nature rather than simply decorated with it.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
  },
  {
    aliases: ['pearl long leaf'],
    name: 'Pearl Long Leaf Necklace',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated, Pearl',
    description:
      'A graceful leaf stretches into an elegant pendant, finished with the soft lustre of a pearl.\n\nThe elongated form gives the necklace a refined vertical line, while the pearl introduces a timeless note against the organic shape.\n\nA beautiful everyday-to-evening piece for anyone who loves the meeting of classic pearls and botanical design.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3680,
  },
  {
    aliases: ['pencil shaving', 'pencil shaving necklace'],
    name: 'Pencil Shaving Necklace',
    collection: 'pencil-shavings',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'An everyday object becomes something unexpectedly beautiful in this playful pendant inspired by pencil shavings.\n\nThe curled form is arranged into a circular design, making the piece appear almost conventional from afar before revealing its unusual inspiration up close.\n\nA wonderful conversation starter for artists, teachers, students or anyone who appreciates creativity in unexpected places.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Thoughtfully Crafted']),
    price: 3480,
    categoryHint: 'necklaces',
  },
  {
    aliases: ['peony flower', 'peony flower necklace'],
    name: 'Peony Flower Necklace',
    collection: 'peony',
    material: 'Sterling Silver, 18K Gold Plated, Zircon',
    description:
      'The peony’s lush, layered bloom becomes the focal point of this elegant pendant.\n\nIts sculpted petals create a sense of fullness, while the floral silhouette carries the associations of beauty, prosperity and romance traditionally connected with the flower.\n\nA graceful piece for celebrations, gifting or simply bringing a little bloom into everyday dressing.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3980,
    categoryHint: 'necklaces',
  },
  {
    aliases: ['phalaenopsis orchid'],
    name: 'Phalaenopsis Orchid Necklace',
    collection: 'phalaenopsis',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The Phalaenopsis orchid is translated into a delicate pendant that captures the flower’s graceful silhouette.\n\nIts softly curved form gives the piece a quiet elegance, making it feel natural against the neckline rather than overly ornate.\n\nA beautiful choice for someone who prefers jewellery inspired by flowers in their most refined and understated form.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3680,
  },
  {
    aliases: ['pomegranate fruits leaves', 'pomegrante fruits leaves'],
    name: 'Pomegranate Fruits Leaves Necklace',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'The rich visual character of a pomegranate is paired with delicate leaves in this botanical-inspired pendant.\n\nThe fruit-and-foliage composition brings together abundance, colour and organic form, creating a piece that feels both expressive and rooted in nature.\n\nA distinctive choice for anyone who likes jewellery inspired by the unexpected beauty of everyday natural forms.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3980,
  },
  {
    aliases: [
      'small flowering crabapple with pearl pendant',
      'small flowering crabapple with pearl pedant',
    ],
    name: 'Small Flowering Crabapple With Pearl Pendant',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated, Pearl',
    description:
      'A tiny flowering branch meets the natural glow of a pearl in this delicate pendant.\n\nThe combination of blossoms, fine branches and the rounded pearl creates the feeling of a miniature flowering tree captured in jewellery.\n\nA quietly romantic piece for anyone who appreciates the beauty of small, fleeting moments in nature.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Natural Gemstones']),
    price: 3680,
  },
  {
    aliases: ['plum and snowflake necklace', 'plum and snowflake'],
    name: 'Plum & Snowflake Necklace',
    collection: 'garden-path',
    material: 'Sterling Silver, 18K Gold Plated',
    description:
      'A meeting of delicate floral form and winter-inspired detail gives this necklace its unusual character.\n\nThe contrasting motifs create a design that feels both seasonal and timeless — soft blossom against crisp geometry.\n\nA distinctive choice for someone who prefers jewellery that feels a little unexpected.',
    bullets: bullets(['Authentic 925 Sterling Silver', 'Nature-Inspired Design']),
    price: 3480,
    categoryHint: 'necklaces',
  },
];

export const COLLECTIONS = [
  { slug: 'lotus-whispers', name: 'Lotus Whispers', line: 'Quiet lotus forms against natural stone.' },
  { slug: 'honey-atelier', name: 'Honey & Bee Series', line: 'Bees, honeycomb and the warmth of the hive.' },
  { slug: 'butterfly-meadow', name: 'Butterfly Series', line: 'Light silhouettes of transformation and flight.' },
  { slug: 'fauna', name: 'Fauna', line: 'Tiny winged visitors and garden meetings.' },
  { slug: 'soft-rain-garden', name: 'Flower In The Rain Series', line: 'Petals after a passing shower.' },
  { slug: 'garden-path', name: 'Flora', line: 'Botanical forms for everyday wear.' },
  { slug: 'birds-on-branch', name: 'Bird Jewelry Series', line: 'Swallow flight and quiet movement.' },
  { slug: 'lily-of-the-valley', name: 'Lily of the Valley', line: 'Bell blooms and soft crystal light.' },
  { slug: 'pencil-shavings', name: 'Pencil Shavings', line: 'Everyday objects turned wearable art.' },
  { slug: 'phalaenopsis', name: 'Phalaenopsis Orchid Collection', line: 'Orchid curves in silver and gold.' },
  { slug: 'gemstone-series', name: 'Gemstone Series', line: 'Natural stones as quiet centrepieces.' },
  { slug: 'calla-lily', name: 'Calla Lily Series', line: 'Elegant curves of a lasting bloom.' },
  { slug: 'soft-bloom', name: 'Soft Bloom Collection', line: 'Understated botanicals with quiet meaning.' },
  { slug: 'chain-necklace', name: 'Chain Necklace', line: 'Simple chains that let everything else shine.' },
  { slug: 'autumn-leaf', name: 'Autumn Leaf Series', line: 'Branches and leaves mid-season.' },
  { slug: 'dragonfly', name: 'Dragonfly Series', line: 'Airy wings and imperfect pearls.' },
  { slug: 'forget-me-not', name: 'Forget-Me-Not Series', line: 'Remembrance in a tiny floral form.' },
  { slug: 'iris-flower', name: 'Iris Flower Series', line: 'Regal petals with graceful drop.' },
  { slug: 'clover-lumen', name: 'Clover Jewellery Series', line: 'Four-leaf luck with pearl light.' },
  { slug: 'honeycomb', name: 'Honeycomb Series', line: 'Nature’s geometry in gold and silver.' },
  { slug: 'magnolia', name: 'Magnolia Series', line: 'Full blooms with quiet grandeur.' },
  { slug: 'peony', name: 'Peony Flower Series', line: 'Lush layered petals for romance.' },
  { slug: 'plum-blossom', name: 'Plum Blossom Series', line: 'Spring renewal on a silver branch.' },
  { slug: 'vintage', name: 'Vintage Collection', line: 'Old-world charm in clean silhouettes.' },
  { slug: 'tulip', name: 'Tulip Series', line: 'Cup blooms and botanical romance.' },
  { slug: 'feather-sky', name: 'Feather Collection', line: 'Freedom, movement and light forms.' },
  { slug: 'wild-rose', name: 'Wild Rose Series', line: 'Slightly untamed floral beauty.' },
  { slug: 'frost-bloom', name: 'Winter Blossom Series', line: 'Soft bloom against winter stillness.' },
  { slug: 'bamboo-grove', name: 'Bamboo Series', line: 'Quiet strength and organic growth.' },
  { slug: 'blooming-anemone', name: 'Blooming Anemone Flower Series', line: 'Layered blooms with gemstone centres.' },
  { slug: 'camellia', name: 'Camellia Series', line: 'Affection carried close to the heart.' },
  { slug: 'lotus-series', name: 'Lotus Series', line: 'Transformation worn close every day.' },
];

export function titleFromFolder(folderName) {
  return String(folderName)
    .replace(/[\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function fallbackDescription(name, category) {
  const kind =
    category === 'earrings'
      ? 'earrings'
      : category === 'rings'
        ? 'ring'
        : category === 'bracelets'
          ? 'bracelet'
          : category === 'cuffs'
            ? 'brooch'
            : 'necklace';
  return `${name} brings a nature-inspired form into a refined ${kind}.\n\nHandcrafted details and a thoughtful silhouette make it an easy everyday piece — or a gift with a quiet story of its own.`;
}

export function matchCopy(folderName, category) {
  const key = norm(folderName);
  const keyTokens = key.split(' ').filter(Boolean);

  let best = null;
  let bestScore = 0;

  for (const entry of COPY) {
    for (const alias of entry.aliases) {
      const a = norm(alias);
      if (!a) continue;
      const aTokens = a.split(' ').filter(Boolean);
      let score = 0;

      if (key === a) {
        score = 100;
      } else {
        const inter = keyTokens.filter((t) => aTokens.includes(t)).length;
        const union = new Set([...keyTokens, ...aTokens]).size;
        const jaccard = union ? inter / union : 0;
        const coverage = keyTokens.length ? inter / keyTokens.length : 0;
        // Prefer aliases that cover most of the folder name (avoids "flower stud" → "begonia flower stud")
        score = jaccard * 70 + coverage * 30;
        if (a.includes(key) && keyTokens.length >= 3) score = Math.max(score, 92);
        if (key.includes(a) && aTokens.length / keyTokens.length >= 0.75) {
          score = Math.max(score, 85);
        }
      }

      if (entry.categoryHint) {
        if (entry.categoryHint === category) score += 12;
        else score -= 35;
      }

      // Penalize necklace-titled copy for earrings folders and vice versa
      const nameL = norm(entry.name);
      if (category === 'earrings' && /\b(necklace|pendant|bracelet|bangle|brooch|ring)\b/.test(nameL)) {
        score -= 40;
      }
      if (category === 'necklaces' && /\b(earring|stud|hoop|bracelet|bangle|brooch|ring)\b/.test(nameL)) {
        score -= 40;
      }
      if (category === 'bracelets' && /\b(earring|necklace|pendant|brooch|ring)\b/.test(nameL)) {
        score -= 40;
      }
      if (category === 'rings' && /\b(earring|necklace|pendant|bracelet|brooch)\b/.test(nameL)) {
        score -= 40;
      }
      if (category === 'cuffs' && /\b(earring|necklace|pendant|bracelet|ring)\b/.test(nameL)) {
        score -= 40;
      }

      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
  }

  if (bestScore < 55) return null;
  return best;
}
