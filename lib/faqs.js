export const faqCategories = [
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    items: [
      {
        question: 'When will my order be shipped?',
        answer:
          'Once your order and payment are confirmed, we begin preparing it for dispatch. Processing time may vary depending on the product and order volume.',
      },
      {
        question: 'How long will my order take to arrive?',
        answer:
          'Delivery timelines depend on your location and the shipping method selected. Your estimated delivery details will be shared with your order confirmation.',
      },
      {
        question: 'Can I track my order?',
        answer:
          'Yes. Once your order has been dispatched, tracking details will be shared with you.',
      },
      {
        question: 'Do you offer express delivery?',
        answer:
          'Express delivery may be available for selected locations. Please check the available options at checkout or contact us for assistance.',
      },
      {
        question: 'Do you ship across India?',
        answer: 'Yes, Velvet Shell delivers across India.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    items: [
      {
        question: 'Can I change or cancel my order?',
        answer:
          'If you need to change or cancel your order, please contact us as soon as possible. Once an order has been processed or dispatched, changes may not be possible.',
      },
      {
        question: 'Can I request a refund?',
        answer:
          'Refunds and returns are subject to our Returns & Exchanges Policy. Please refer to the policy for eligibility and applicable conditions.',
      },
      {
        question: 'What if I receive a damaged or incorrect product?',
        answer:
          'Please contact us with your order number and clear photographs of the product and packaging. Our team will review the issue and guide you through the next steps.',
      },
      {
        question: 'Can I exchange my jewellery?',
        answer:
          'Exchange eligibility depends on the product and reason for exchange. Please contact us before sending an item back.',
      },
      {
        question: 'What condition should a returned product be in?',
        answer:
          'Returned products must meet the conditions specified in our Returns & Exchanges Policy.',
      },
    ],
  },
  {
    id: 'materials',
    title: 'Jewellery & Materials',
    items: [
      {
        question: 'What materials does Velvet Shell use?',
        answer:
          'Our jewellery collection includes 925 sterling silver, 18K gold-plated finishes and freshwater pearls. Material details are also mentioned on individual product pages.',
      },
      {
        question: 'What does 18K gold-plated mean?',
        answer:
          'It refers to a layer of 18K gold applied over the base material, giving the piece its warm gold finish.',
      },
      {
        question: 'Are your silver pieces sterling silver?',
        answer: 'Yes. Our sterling silver jewellery is crafted using 925 sterling silver.',
      },
      {
        question: 'Are the pearls natural?',
        answer:
          'Our pearl jewellery features freshwater pearls. As a natural material, each pearl may have subtle variations in shape, tone and surface.',
      },
    ],
  },
  {
    id: 'care',
    title: 'Jewellery Care',
    items: [
      {
        question: 'How should I care for my Velvet Shell jewellery?',
        answer:
          'Keep your jewellery away from perfumes, cosmetics, lotions, chemicals and prolonged exposure to water. We recommend removing jewellery before swimming, bathing or exercising.',
      },
      {
        question: 'How should I store my jewellery?',
        answer:
          'Store each piece separately in a clean, dry place, preferably in its original pouch or jewellery box, to help protect the finish and prevent scratches.',
      },
      {
        question: 'How should I care for gold-plated jewellery?',
        answer:
          'Avoid perfumes, chemicals, moisture and excessive friction. Store the piece separately when not in use to help preserve its finish.',
      },
      {
        question: 'How should I care for freshwater pearls?',
        answer:
          'Pearls are delicate. Keep them away from perfumes, cosmetics and chemicals, and gently wipe them with a soft, dry cloth after wearing.',
      },
      {
        question: 'Can I polish my jewellery?',
        answer:
          'Avoid abrasive polishing, particularly on gold-plated or intentionally finished pieces, as it may affect the surface. Follow the care instructions provided with your product.',
      },
    ],
  },
  {
    id: 'gifting',
    title: 'Gifting',
    items: [
      {
        question: 'Does Velvet Shell offer gifting?',
        answer:
          'Yes. Our gifting edit includes jewellery and considered creations for celebrations, weddings, festive occasions and meaningful personal moments.',
      },
      {
        question: 'Do you offer corporate gifting?',
        answer:
          'Yes. We curate corporate gifting for clients, employees, partners, leadership and milestone occasions.',
      },
      {
        question: 'Can I place a bulk gifting order?',
        answer:
          'Yes. Please contact us with your requirements, quantity, occasion and preferred timeline, and our team will help curate the appropriate options.',
      },
      {
        question: 'Can I personalise my gift?',
        answer:
          'Personalisation may be available for selected gifting requirements. Please contact us with your brief and our team will guide you through the possibilities.',
      },
    ],
  },
  {
    id: 'other',
    title: 'Other',
    items: [
      {
        question: 'How can I contact Velvet Shell?',
        answer:
          'For product, order or gifting enquiries, please reach out to us through our Contact Us page.',
      },
      {
        question: 'I have another question. How can I reach you?',
        answer:
          'We’d be happy to help. Send us your query through the Contact Us form and our team will get back to you.',
      },
    ],
  },
];

/** A short selection for compact FAQ sections elsewhere on the site. */
export const faqHighlights = [
  { categoryId: 'shipping', index: 4 },
  { categoryId: 'shipping', index: 2 },
  { categoryId: 'materials', index: 0 },
  { categoryId: 'care', index: 0 },
  { categoryId: 'gifting', index: 0 },
  { categoryId: 'other', index: 0 },
].map(({ categoryId, index }) => {
  const category = faqCategories.find((item) => item.id === categoryId);
  const item = category.items[index];
  return {
    ...item,
    categoryTitle: category.title,
    categoryId,
  };
});
