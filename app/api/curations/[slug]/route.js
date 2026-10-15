import { NextResponse } from 'next/server';
import { fetchCuration } from '@/lib/catalog/curations';

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (!slug || !['festive-edit', 'best-sellers'].includes(slug)) {
    return NextResponse.json({ error: 'Unknown curation' }, { status: 404 });
  }
  const curation = await fetchCuration(slug);
  return NextResponse.json({ curation });
}
