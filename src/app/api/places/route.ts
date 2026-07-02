import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabaseTable(supabase, 'places')
    .select('*, place_categories(name, icon, color)')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ places: data });
}
