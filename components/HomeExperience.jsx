import HeroBanners from '@/components/HeroBanners';
import Hero3 from '@/components/Hero3';
import AtelierRibbon from '@/components/AtelierRibbon';
import ShopByLook from '@/components/ShopByLook';
import TopPicks from '@/components/home/TopPicks';
import NacreFeature from '@/components/home/NacreFeature';
import NewCollection from '@/components/home/NewCollection';
import AtelierChapter from '@/components/AtelierChapter';
import PrivateClient from '@/components/PrivateClient';

/** @deprecated Prefer `app/page.js`. Kept for older imports. */
export default function HomeExperience() {
  return (
    <>
      {/* <HeroBanners /> */}
      <Hero3 />
      <ShopByLook />
      <AtelierRibbon />
      <TopPicks />
      <NacreFeature />
      <NewCollection />
      <AtelierChapter />
      <PrivateClient />
    </>
  );
}
