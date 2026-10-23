'use client';

import { Suspense } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import SmoothScroll from './SmoothScroll';
import ScrollToTop from './ScrollToTop';
import SiteHeader from './SiteHeader';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import QuickViewDrawer from './QuickViewDrawer';
import SearchModal from './SearchModal';
import WhatsAppFloat from './WhatsAppFloat';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <SmoothScroll>
        <Suspense fallback={null}>
          <ScrollToTop />
          <SiteHeader />
        </Suspense>
        <CartDrawer />
        <QuickViewDrawer />
        <SearchModal />
        {/* min-h keeps footer below the fold while the next page / skeleton paints */}
        <main className="relative w-full min-h-[100svh] overflow-x-clip">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </SmoothScroll>
    </StoreProvider>
  );
}
