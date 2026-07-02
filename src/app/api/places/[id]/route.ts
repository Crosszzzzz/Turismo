import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabaseTable(supabase, 'places')
    .select('*, place_categories(name, icon, color), place_images(*)')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ place: data });
}
