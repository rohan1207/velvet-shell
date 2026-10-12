import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';

export async function POST(request) {
  try {
    const { supabase, json } = createAuthRouteClient(request);
    await supabase.auth.signOut();
    return json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
