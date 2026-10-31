import { NextResponse } from 'next/server';
import { loadGiftOptions } from '@/lib/gift-options';

export async function GET() {
  try {
    const options = await loadGiftOptions();
    return NextResponse.json({ options });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not load gift options.', options: null },
      { status: 500 },
    );
  }
}
