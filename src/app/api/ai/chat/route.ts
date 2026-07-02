import { NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/ai/gemini';
import { createServerClient } from '@/lib/supabase/server';
import type { ChatMessage, PlaceContext } from '@/types/route';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function POST(request: Request) {
  const supabase = createServerClient();
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 });
  }

  // Fetch available places for context
  const { data: places } = await supabaseTable(supabase, 'places')
    .select('id, name, latitude, longitude, avg_cost, avg_visit_time, is_free, rating_avg, place_categories(name)')
    .eq('is_active', true);

  const placesContext: PlaceContext[] = ((places as any[]) || []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.place_categories?.name || 'Sin categoría',
    latitude: p.latitude,
    longitude: p.longitude,
    avg_cost: p.avg_cost,
    avg_visit_time: p.avg_visit_time,
    is_free: p.is_free,
    rating_avg: p.rating_avg,
  }));

  try {
    const reply = await chatWithAI(messages, placesContext);
    
    // Try to extract JSON route from the reply
    let route = null;
    const jsonMatch = reply.match(/\{[\s\S]*"route"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        route = JSON.parse(jsonMatch[0]).route;
      } catch {
        // JSON parsing failed, that's ok
      }
    }

    return NextResponse.json({ reply, route });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}
