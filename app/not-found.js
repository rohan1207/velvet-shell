import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-5 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">404</p>
      <h1 className="font-display mt-4 text-5xl md:text-7xl">This chamber is empty.</h1>
      <Link href="/" className="mt-8 text-[11px] tracking-[0.28em] uppercase">
        Return to the house
      </Link>
    </div>
  );
}
