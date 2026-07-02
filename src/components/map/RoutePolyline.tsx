'use client';

import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { RouteStop, PlaceContext } from '@/types/route';

interface RoutePolylineProps {
  stops: RouteStop[];
  places: PlaceContext[];
}

function createNumberIcon(number: number, isStart: boolean, isEnd: boolean) {
  const bgColor = isStart ? '#22c55e' : isEnd ? '#ef4444' : '#4f46e5';
  return L.divIcon({
    className: 'route-number-marker',
    html: `<div style="
      background-color: ${bgColor};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function RoutePolyline({ stops, places }: RoutePolylineProps) {
  const positions: [number, number][] = [];
  
  for (const stop of stops) {
    const place = places.find((p) => p.id === stop.place_id);
    if (place) {
      positions.push([place.latitude, place.longitude]);
    }
  }

  if (positions.length < 2) return null;

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#4f46e5',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 6',
        }}
      />
      {stops.map((stop, index) => {
        const place = places.find((p) => p.id === stop.place_id);
        if (!place) return null;
        
        return (
          <Marker
            key={stop.place_id}
            position={[place.latitude, place.longitude]}
            icon={createNumberIcon(
              stop.order,
              index === 0,
              index === stops.length - 1
            )}
          >
            <Popup>
              <div className="min-w-[180px] p-1">
                <h3 className="font-semibold text-gray-900">
                  {stop.order}. {stop.name}
                </h3>
                <p className="text-xs text-gray-500">
                  ⏱️ {stop.stay_duration}min • 🚶 {stop.walking_time_to_next}min hasta siguiente
                </p>
                {stop.notes && (
                  <p className="mt-1 text-xs text-indigo-600 italic">{stop.notes}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
