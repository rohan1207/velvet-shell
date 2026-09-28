import { Playfair_Display, Poppins, Montserrat, Bodoni_Moda, Great_Vibes } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

/** Brand Book 2026 — Main Heading 1 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

/** Brand Book 2026 — Heading 2 + Body */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

/** Brand Book 2026 — Labels */
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
});

/** Hero bento — Didot / Bodoni wordmark */
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bodoni-face',
});

/** Hero bento — script accent */
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script-face',
});

export const metadata = {
  title: {
    default: 'Velvet Shell — A treasure in every reveal',
    template: '%s — Velvet Shell',
  },
  description:
    'Velvet Shell is where beautiful things become meaningful discoveries. A premium house of jewellery, gifting, fragrances, home and lifestyle creations.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${montserrat.variable} ${bodoni.variable} ${greatVibes.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/logo-splash.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/landing-bg.png" />
      </head>
      <body className={`${poppins.className} bg-ivory font-sans text-ink antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
