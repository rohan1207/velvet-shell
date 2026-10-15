import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { fromDbAddress, toDbAddress, validateAddressInput } from '@/lib/addresses';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
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
    const { data: existing } = await admin
      .from('addresses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
    }

    const row = toDbAddress(body, user.id);
    delete row.user_id;

    if (row.is_default) {
      await admin.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    }

    const { data, error } = await admin
      .from('addresses')
      .update(row)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    return json({ ok: true, address: fromDbAddress(data) });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not update address.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    }

    const admin = createAdminSupabase();
    const { error } = await admin
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not delete address.' },
      { status: 500 },
    );
  }
}
