import Legal from '@/components/Legal';

export const metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  return (
    <Legal title="Privacy">
      <p>We keep only what we need: your name, your notes, the pieces you ask for. We do not sell lists. We do not follow you around the internet with a collar you already considered.</p>
      <p>Payment details are never stored by Velvet Shell. The local bag on this preview lives in your browser alone.</p>
      <p>Write to atelier@velvetshell.com to see or erase what we hold.</p>
    </Legal>
  );
}
