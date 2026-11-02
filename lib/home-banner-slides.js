import { shopCategoryHref } from '@/lib/shop-links';

/**
 * Homepage BannerShowcase (+ Hero3 category reel) — one slide per shop category.
 * Desktop paths map to /images/mobile/... via ResponsiveBannerImage.
 */
export const HOME_BANNER_SLIDES = [
  {
    id: 'rings',
    image: '/images/banners/rings/daisy-ladybug.jpg',
    alt: 'Silver daisy and leaf ring among white daisies',
    href: shopCategoryHref('rings'),
    label: 'Rings',
    line: 'Petals shaped for the hand',
  },
  {
    id: 'earrings',
    image: '/images/banners/earrings/honeybee.jpg',
    alt: 'Honeybee stud earrings on honeycomb among wildflowers',
    href: shopCategoryHref('earrings'),
    label: 'Earrings',
    line: 'Nature at the ear',
  },
  {
    id: 'bracelets',
    image: '/images/banners/bracelets/lotus.jpg',
    alt: 'Lotus whisper bracelet on a dewy lily pad',
    href: shopCategoryHref('bracelets'),
    label: 'Bracelets',
    line: 'Delicate branches for the wrist',
  },
  {
    id: 'necklaces',
    image: '/images/banners/necklaces/pinecone.jpg',
    alt: 'Silver pinecone pendant necklace at golden hour',
    href: shopCategoryHref('necklaces'),
    label: 'Necklaces',
    line: 'Worn close to the collarbone',
  },
  {
    id: 'pendants',
    image: '/images/banners/pendants/monstera-leaf.jpg',
    alt: 'Monstera leaf pendant on a tropical leaf',
    href: shopCategoryHref('pendants'),
    label: 'Pendants',
    line: 'A single quiet focus',
  },
  {
    id: 'accessories',
    image: '/images/banners/chains/gold-chain.jpg',
    alt: 'Fine gold chain — accessories, chains and chokers',
    href: shopCategoryHref('accessories'),
    label: 'Accessories',
    line: 'Chains, chokers and brooches',
  },
  {
    id: 'anklets',
    image: '/images/banners/anklets/ginkgo-chain.jpg',
    alt: 'Silver ginkgo leaf anklet among yellow leaves',
    href: shopCategoryHref('anklets'),
    label: 'Anklets',
    line: 'Light chains for warm days',
  },
  {
    id: 'sets',
    image: '/images/banners/sets/daisy-chain-set.jpg',
    alt: 'Daisy necklace, bracelet and ring set',
    href: shopCategoryHref('sets'),
    label: 'Sets',
    line: 'Pieces meant to be worn together',
  },
];
