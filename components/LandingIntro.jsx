'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BG = '#5E062A';

export default function LandingIntro() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      <Image
        src="/logo.png"
        alt="Velvet Shell"
        width={280}
        height={280}
        priority
        className="h-auto w-[42vw] max-w-[220px] object-contain md:max-w-[280px]"
      />
    </div>
  );
}
