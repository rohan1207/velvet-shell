import PromoMarquee from '@/components/PromoMarquee';
import Navbar from '@/components/Navbar';

export default function SiteHeader() {
  return (
    <div data-site-header className="fixed inset-x-0 top-0 z-50">
      <PromoMarquee />
      <Navbar />
    </div>
  );
}
