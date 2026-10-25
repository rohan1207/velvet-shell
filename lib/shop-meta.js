/**
 * Lightweight shop chrome (heroes, collection labels) — safe for client bundles.
 * Keep heavy dummy product arrays out of this file.
 */

export const shopHero = {
  name: 'The collection',
  line: 'Floral, nature-inspired jewellery — made to be worn and kept.',
  banner: '/images/banners/necklaces/flower.jpg',
  banners: [
    {
      src: '/images/banners/necklaces/flower.jpg',
      alt: 'Flower in the rain necklace on a dewy leaf after rain',
    },
    {
      src: '/images/banners/earrings/honeybee.jpg',
      alt: 'Honeybee stud earrings on honeycomb among wildflowers',
    },
    {
      src: '/images/banners/rings/lotus.jpg',
      alt: 'Lotus stone ring resting on a real dewy lily pad',
    },
    {
      src: '/images/banners/bracelets/forget-me-not.jpg',
      alt: 'Forget-me-not bangles among real blue blossoms',
    },
  ],
};

export const collectionsMeta = [
  { slug: 'the-shell-edit', name: 'The Shell Edit' },
  { slug: 'pearls-of-nacre', name: 'Lumen Line' },
  { slug: 'gilded-tide', name: 'Gilded Tide' },
  { slug: 'private-atelier', name: 'Private Atelier' },
  { slug: 'lotus-whispers', name: 'Lotus Whispers' },
  { slug: 'honey-atelier', name: 'Honey Atelier' },
  { slug: 'soft-rain-garden', name: 'Soft Rain Garden' },
  { slug: 'garden-path', name: 'Garden Path' },
  { slug: 'butterfly-meadow', name: 'Butterfly Meadow' },
];

export function collectionName(slug) {
  return collectionsMeta.find((item) => item.slug === slug)?.name ?? slug;
}
