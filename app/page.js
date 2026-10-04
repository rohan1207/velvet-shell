import Hero3 from '@/components/Hero3';
import PromoMarquee from '@/components/PromoMarquee';
import CategoryCircles from '@/components/CategoryCircles';
import BestOfVelvetShell from '@/components/BestOfVelvetShell';
import NewArrivals from '@/components/NewArrivals';
import ShopByLook from '@/components/ShopByLook';
import FullBleedVideo from '@/components/FullBleedVideo';
import ShopNow from '@/components/ShopNow';
import ScrollFrameStory from '@/components/ScrollFrameStory';
import TrustStrip from '@/components/TrustStrip';
import BannerShowcase from '@/components/BannerShowcase';
import Testimonials from '@/components/Testimonials';

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
      <Hero3 />
      <PromoMarquee />
      <CategoryCircles />
      <BestOfVelvetShell />
      <NewArrivals />
      <ScrollFrameStory />
      <ShopByLook />
      <FullBleedVideo />
      <ShopNow />
      <TrustStrip />
      <BannerShowcase />
      <Testimonials />
    </>
  );
}
