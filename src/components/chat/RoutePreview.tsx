'use client';

import { Clock, DollarSign, MapPin, Footprints } from 'lucide-react';
import type { GeneratedRoute } from '@/types/route';

interface RoutePreviewProps {
  route: GeneratedRoute;
  onViewOnMap?: () => void;
}

export function RoutePreview({ route, onViewOnMap }: RoutePreviewProps) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-indigo-900">{route.title}</h3>
      </div>
      
      <p className="mb-3 text-sm text-indigo-700">{route.description}</p>
      
      <div className="mb-3 flex flex-wrap gap-3 text-xs text-indigo-600">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {route.total_duration}min
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" /> {route.total_cost} BOB
        </span>
        <span className="flex items-center gap-1">
          <Footprints className="h-3 w-3" /> {route.total_distance}km
        </span>
      </div>

      <div className="space-y-2">
        {route.stops.map((stop) => (
          <div
            key={stop.place_id}
            className="flex items-start gap-2 rounded-lg bg-white p-2"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {stop.order}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{stop.name}</p>
              <p className="text-xs text-gray-500">
                ⏱️ {stop.stay_duration}min • 🚶 {stop.walking_time_to_next}min
              </p>
            </div>
          </div>
        ))}
      </div>

      {onViewOnMap && (
        <button
          onClick={onViewOnMap}
          className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Ver en mapa
        </button>
      )}
    </div>
  );
}
