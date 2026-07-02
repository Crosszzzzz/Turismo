import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function POST(request: Request) {
  const supabase = createServerClient();
  const { user_id, place_id } = await request.json();

  const { data, error } = await supabaseTable(supabase, 'favorites')
    .upsert({ user_id, place_id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorite: data });
}

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const { data, error } = await supabaseTable(supabase, 'favorites')
    .select('place_id, places(*)')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: data });
}
