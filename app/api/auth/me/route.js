import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getPublicUser } from '@/lib/auth/profile';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const profile = await getPublicUser(user);
    return NextResponse.json({ user: profile });
  } catch (err) {
    console.error('[auth/me]', err);
    return NextResponse.json({ user: null });
  }
}
