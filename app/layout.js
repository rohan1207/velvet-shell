import { Playfair_Display, Poppins, Montserrat, Bodoni_Moda, Great_Vibes } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

/** Brand Book 2026 — Main Heading 1 (trim weights for faster first paint) */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

/** Brand Book 2026 — Heading 2 + Body */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

/** Brand Book 2026 — Labels */
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

/** Hero bento — Didot / Bodoni wordmark */
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-bodoni-face',
  display: 'swap',
});

/** Hero bento — script accent */
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script-face',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Velvet Shell — A treasure in every reveal',
    template: '%s — Velvet Shell',
  },
  description:
    'Velvet Shell is where beautiful things become meaningful discoveries. A premium house of jewellery, gifting, fragrances, home and lifestyle creations.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${montserrat.variable} ${bodoni.variable} ${greatVibes.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/logo-splash.png" fetchPriority="high" />
      </head>
      <body className={`${poppins.className} bg-white font-sans text-ink antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
