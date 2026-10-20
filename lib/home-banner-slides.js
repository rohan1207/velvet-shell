import { giftingHref, shopCategoryHref, shopHref } from '@/lib/shop-links';

/** Shared homepage BannerShowcase slides — also used in Hero3 rings card. */
export const HOME_BANNER_SLIDES = [
  {
    id: 'bracelets',
    image: '/images/category-banner-bracelets.jpg',
    alt: 'Nature-inspired bracelets — clover leaves in soft forest light',
    href: shopCategoryHref('bracelets'),
    label: 'Bracelets',
  },
  {
    id: 'necklaces',
    image: '/images/category-banner-necklaces.jpg',
    alt: 'Nature-inspired necklaces — silver floral pendant on a white lily',
    href: shopCategoryHref('necklaces'),
    label: 'Necklaces',
  },
  {
    id: 'brooches',
    image: '/images/category-banner-brooches.jpg',
    alt: 'Nature-inspired brooches — clover leaves with morning dew',
    href: shopCategoryHref('cuffs'),
    label: 'Brooches',
  },
  {
    id: 'bee',
    image: '/images/home-slide-bee.jpg',
    alt: 'Nature storytelling — honeybee on a golden wildflower',
    href: shopCategoryHref('earrings'),
    label: 'Earrings',
  },
  {
    id: 'calla',
    image: '/images/home-slide-calla.jpg',
    alt: 'Nature storytelling — white calla lily in soft light',
    href: shopCategoryHref('cuffs'),
    label: 'Brooches',
  },
  {
    id: 'meadow',
    image: '/images/home-slide-meadow.jpg',
    alt: 'Nature storytelling — pink wildflowers in a soft meadow',
    href: shopCategoryHref('rings'),
    label: 'Rings',
  },
  {
    id: 'moss',
    image: '/images/home-slide-moss.jpg',
    alt: 'Nature storytelling — dewy moss and forest flowers',
    href: shopCategoryHref('bracelets'),
    label: 'Bracelets',
  },
  {
    id: 'shop',
    image: '/images/category-banner-shop.jpg',
    alt: 'Nature storytelling — lotus blooms rising through morning mist',
    href: shopHref(),
    label: 'Shop',
  },
  {
    id: 'gifting',
    image: '/images/category-banner-gifting.jpg',
    alt: 'Gifting — white orchids in soft natural light',
    href: giftingHref(),
    label: 'Gifting',
  },
];
