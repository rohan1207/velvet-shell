export const journal = [
  {
    slug: 'sterling-silver-and-gold',
    title: '925 silver, gold plate, freshwater pearls',
    eyebrow: 'Materials',
    date: 'Velvet Shell',
    read: '2 min',
    image: '/images/banners/rings/daisy-ladybug.jpg',
    excerpt:
      'The collection is made in 925 sterling silver, 18K gold-plated finishes and freshwater pearls.',
    body: [
      'Each piece page lists the metal and stones used. Sterling silver is marked 925. Gold pieces in the collection are 18K gold-plated.',
      'Pearl jewellery uses freshwater pearls. As a natural material, each pearl can vary slightly in shape, tone and surface.',
      'If you want the material for a specific piece, it is on the product page. For anything else, write to sales@velvetshell.in.',
    ],
  },
  {
    slug: 'shipping-across-india',
    title: 'Shipping across India',
    eyebrow: 'Orders',
    date: 'Velvet Shell',
    read: '2 min',
    image: '/images/banners/sets/daisy-chain-set.jpg',
    excerpt:
      'Orders of ₹3,999 and above ship free. Below that, shipping is a flat ₹99. Tracking follows dispatch.',
    body: [
      'Velvet Shell delivers across India. Orders of ₹3,999 and above, after discounts, include complimentary shipping. Orders below ₹3,999 have a flat shipping charge of ₹99.',
      'Once payment is confirmed, the order is prepared for dispatch. Processing time depends on the piece and on order volume. Estimated delivery is shared with the order confirmation.',
      'After the order leaves, tracking details are sent to you. Delivery questions go to sales@velvetshell.in.',
    ],
  },
  {
    slug: 'caring-for-pearls',
    title: 'Caring for freshwater pearls',
    eyebrow: 'Care',
    date: 'Velvet Shell',
    read: '2 min',
    image: '/images/banners/necklaces/flower.jpg',
    excerpt:
      'Pearls prefer a soft cloth, a dry place, and to come off before water, perfume and lotion.',
    body: [
      'Wipe freshwater pearls with a soft, dry cloth after wear. Keep them away from perfume, lotion and water.',
      'Store pearl pieces separately so harder stones and metal do not scratch the surface.',
      'The same care notes appear on pearl product pages. If a piece arrives damaged, write to sales@velvetshell.in with the order number and photographs.',
    ],
  },
  {
    slug: 'gifting-an-order',
    title: 'Gifting an order',
    eyebrow: 'Gifting',
    date: 'Velvet Shell',
    read: '2 min',
    image: '/images/gifting/packaging/gift-bag-bento.jpg',
    excerpt:
      'Wedding favours, corporate gifts and personal notes are arranged from the gifting page.',
    body: [
      'Velvet Shell pieces can be gifted. The gifting page collects the occasion, quantity and a note, and sends that enquiry to the team.',
      'For a personal order, you can add a gift note at checkout when that option is offered.',
      'Collaborations and larger gifting briefs: use the form on the gifting page, or email sales@velvetshell.in and info.velvetshell@gmail.com.',
    ],
  },
];

export function getJournal(slug) {
  return journal.find((item) => item.slug === slug) ?? null;
}
