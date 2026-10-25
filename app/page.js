import dynamic from 'next/dynamic';
import NatureStoryHero from '@/components/NatureStoryHero';
import CategoryCircles from '@/components/CategoryCircles';
import { HomeProductNotes } from '@/components/ProductNotes';

/** Below-the-fold / heavy client sections — load after first paint. */
const Hero3 = dynamic(() => import('@/components/Hero3'), {
  loading: () => <div className="min-h-[70vh] animate-pulse bg-cream/40" aria-hidden />,
});
const NewArrivals = dynamic(() => import('@/components/NewArrivals'));
const BestOfVelvetShell = dynamic(() => import('@/components/BestOfVelvetShell'));
const ShopNow = dynamic(() => import('@/components/ShopNow'));
const FullBleedVideo = dynamic(() => import('@/components/FullBleedVideo'), {
  loading: () => <div className="aspect-video w-full animate-pulse bg-cream/50" aria-hidden />,
});
const ShopByLook = dynamic(() => import('@/components/ShopByLook'));
const BannerShowcase = dynamic(() => import('@/components/BannerShowcase'));
const TheHouse = dynamic(() => import('@/components/TheHouse'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));

export const metadata = {
  title: 'Velvet Shell — A treasure in every reveal',
  description:
    'Velvet Shell is where beautiful things become meaningful discoveries. A premium house of jewellery, gifting, fragrances, home and lifestyle creations.',
};

/**
 * Home route (`/`) — App Router page that composes section components.
 * Layout chrome (navbar, footer, cart) lives in `app/layout.js` via Providers.
 */
export default function HomePage() {
  return (
    <>
      <NatureStoryHero />
      <Hero3 />
      <CategoryCircles />
      <NewArrivals />
      <BestOfVelvetShell />
      <ShopNow />
      <HomeProductNotes />
      <FullBleedVideo />
      <ShopByLook />
      <BannerShowcase />
      <TheHouse />
      <Testimonials />
    </>
  );
}
