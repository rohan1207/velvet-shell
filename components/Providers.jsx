'use client';

import { Suspense } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import MobileBlock from './MobileBlock';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <MobileBlock />
      <div className="max-md:hidden">
        <SmoothScroll>
          <CustomCursor />
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <SearchModal />
          <main className="relative w-full overflow-x-hidden">{children}</main>
          <Footer />
        </SmoothScroll>
      </div>
    </StoreProvider>
  );
}
