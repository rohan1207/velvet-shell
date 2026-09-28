import Hero3 from '@/components/Hero3';
import CategoryCircles from '@/components/CategoryCircles';
import ShopByLook from '@/components/ShopByLook';
import BannerShowcase from '@/components/BannerShowcase';
import ShopNow from '@/components/ShopNow';
import SpiralGallery from '@/components/SpiralGallery';
import TopPicks from '@/components/home/TopPicks';
import NacreFeature from '@/components/home/NacreFeature';
import NewCollection from '@/components/home/NewCollection';
import TrustStrip from '@/components/TrustStrip';

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
      <CategoryCircles />
      <ShopByLook />
      <BannerShowcase />
      <ShopNow />
      <SpiralGallery />
      <TopPicks />
      <NacreFeature />
      <NewCollection />
      <TrustStrip />
    </>
  );
}
