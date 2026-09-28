import { Suspense } from 'react';
import ShopExperience from '@/components/ShopExperience';

export const metadata = {
  title: 'Shop',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <ShopExperience />
    </Suspense>
  );
}
