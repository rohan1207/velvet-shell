import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { fromDbAddress, toDbAddress, validateAddressInput } from '@/lib/addresses';

export async function GET(request) {
  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.', addresses: [] }, { status: 401 });
    }

    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return json({ addresses: (data || []).map(fromDbAddress) });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not load addresses.', addresses: [] },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = validateAddressInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const admin = createAdminSupabase();
    const row = toDbAddress(body, user.id);

    if (row.is_default) {
      await admin.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    } else {
      const { count } = await admin
        .from('addresses')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!count) row.is_default = true;
    }

    const { data, error } = await admin.from('addresses').insert(row).select('*').single();
    if (error) throw error;

    return json({ ok: true, address: fromDbAddress(data) }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not save address.' },
      { status: 500 },
    );
  }
}
