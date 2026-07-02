import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  const { data, error } = await supabaseTable(supabase, 'reviews')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'placeId required' }, { status: 400 });
  }

  const { data, error } = await supabaseTable(supabase, 'reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}
