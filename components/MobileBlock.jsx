import Image from 'next/image';

export default function MobileBlock() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-burgundy px-8 text-center md:hidden">
      <span className="relative mb-8 block h-20 w-20">
        <Image
          src="/logo-splash.png"
          alt="Velvet Shell"
          fill
          priority
          className="object-contain"
          sizes="80px"
          style={{ mixBlendMode: 'screen' }}
        />
      </span>
      <p className="font-label text-gold">Velvet Shell</p>
      <h1 className="font-display mt-4 max-w-xs text-3xl leading-tight text-ivory">
        Please visit us on desktop.
      </h1>
      <p className="mt-4 max-w-[16rem] text-sm font-light leading-relaxed text-ivory/60">
        Phone screen is in progress. The full experience is ready on a larger display.
      </p>
    </div>
  );
}
