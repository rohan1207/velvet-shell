'use client';

import { Suspense } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import SmoothScroll from './SmoothScroll';
import SiteHeader from './SiteHeader';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import QuickViewDrawer from './QuickViewDrawer';
import SearchModal from './SearchModal';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <SmoothScroll>
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <CartDrawer />
        <QuickViewDrawer />
        <SearchModal />
        <main className="relative w-full overflow-x-clip">{children}</main>
        <Footer />
      </SmoothScroll>
    </StoreProvider>
  );
}
