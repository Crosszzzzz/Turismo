'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { PlaceContext } from '@/types/route';

interface LeafletPlaceMarkerProps {
  place: PlaceContext;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  'Museos': '#6366f1',
  'Iglesias': '#8b5cf6',
  'Restaurantes': '#f59e0b',
  'Mercados': '#10b981',
  'Parques': '#22c55e',
  'Miradores': '#ef4444',
  'Galerías': '#ec4899',
  'Hoteles': '#3b82f6',
};

function createCustomIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "><div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(45deg);
      color: white;
      font-size: 12px;
      font-weight: bold;
    "></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export function LeafletPlaceMarker({ place, onClick }: LeafletPlaceMarkerProps) {
  const color = categoryColors[place.category] || '#6366f1';
  const icon = createCustomIcon(color);

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="min-w-[180px] p-1">
          <h3 className="font-semibold text-gray-900">{place.name}</h3>
          <p className="text-xs text-gray-500">{place.category}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
            <span>⭐ {place.rating_avg}</span>
            <span>•</span>
            <span>{place.is_free ? 'Gratis' : `${place.avg_cost} BOB`}</span>
            <span>•</span>
            <span>{place.avg_visit_time}min</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
