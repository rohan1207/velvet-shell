import PromoMarquee from '@/components/PromoMarquee';
import Navbar from '@/components/Navbar';

export default function SiteHeader() {
  return (
    <div data-site-header className="fixed inset-x-0 top-0 z-50">
      {/* Paint into the iOS notch / status bar so Safari doesn’t leave a blank gap */}
      <div className="bg-[#f7f4ef] pt-[env(safe-area-inset-top,0px)]">
        <PromoMarquee />
      </div>
      <Navbar />
    </div>
  );
}
