import NatureStoryHero from '@/components/NatureStoryHero';
import Hero3 from '@/components/Hero3';
import CategoryCircles from '@/components/CategoryCircles';
import BestOfVelvetShell from '@/components/BestOfVelvetShell';
import NewArrivals from '@/components/NewArrivals';
import ShopByLook from '@/components/ShopByLook';
import FullBleedVideo from '@/components/FullBleedVideo';
import ShopNow from '@/components/ShopNow';
// import ScrollFrameStory from '@/components/ScrollFrameStory';
import TheHouse from '@/components/TheHouse';
// import TrustStrip from '@/components/TrustStrip';
import BannerShowcase from '@/components/BannerShowcase';
import Testimonials from '@/components/Testimonials';
import { HomeProductNotes } from '@/components/ProductNotes';

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
      {/* <TrustStrip /> */}
      <Hero3 />
      <CategoryCircles />
      <NewArrivals />
      <BestOfVelvetShell />
      <ShopNow />
      <HomeProductNotes />
      <FullBleedVideo />
      <ShopByLook />
      <BannerShowcase />
      {/* <ScrollFrameStory /> */}
      <TheHouse />
      <Testimonials />
    </>
  );
}
