import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { GeneratedRoute } from '@/types/route';

// Type assertion helper for Supabase before migration
const supabaseTable = (supabase: ReturnType<typeof createServerClient>, table: string) => {
  return supabase.from(table as any) as any;
};

export async function POST(request: Request) {
  const supabase = createServerClient();
  const { route: generatedRoute, user_id } = (await request.json()) as {
    route: GeneratedRoute;
    user_id: string;
  };

  if (!generatedRoute || !user_id) {
    return NextResponse.json({ error: 'Route and user_id required' }, { status: 400 });
  }

  // Save route to database
  const { data: route, error: routeError } = await supabaseTable(supabase, 'routes')
    .insert({
      user_id,
      title: generatedRoute.title,
      description: generatedRoute.description,
      total_duration: generatedRoute.total_duration,
      total_cost: generatedRoute.total_cost,
      total_distance: generatedRoute.total_distance,
      difficulty: generatedRoute.difficulty,
      is_dynamic: true,
      context_snapshot: {},
    })
    .select()
    .single();

  if (routeError) {
    return NextResponse.json({ error: routeError.message }, { status: 500 });
  }

  // Save route stops
  const stops = generatedRoute.stops.map((stop) => ({
    route_id: route.id,
    place_id: stop.place_id,
    stop_order: stop.order,
    stay_duration: stop.stay_duration,
    notes: stop.notes,
  }));

  const { error: stopsError } = await supabaseTable(supabase, 'route_stops').insert(stops);

  if (stopsError) {
    return NextResponse.json({ error: stopsError.message }, { status: 500 });
  }

  return NextResponse.json({ route_id: route.id, route });
}
