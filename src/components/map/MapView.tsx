'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SUCRE_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/utils/constants';
import { LeafletPlaceMarker } from './LeafletPlaceMarker';
import { RoutePolyline } from './RoutePolyline';
import type { PlaceContext } from '@/types/route';
import type { RouteStop } from '@/types/route';

// Fix default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  places?: PlaceContext[];
  routeStops?: RouteStop[];
  onPlaceClick?: (placeId: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

function MapEvents({ onPlaceClick }: { onPlaceClick?: (id: string) => void }) {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
}

export function MapView({
  places = [],
  routeStops,
  onPlaceClick,
  center = SUCRE_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  className = '',
}: MapViewProps) {
  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full w-full rounded-xl"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onPlaceClick={onPlaceClick} />
        
        {places.map((place) => (
          <LeafletPlaceMarker
            key={place.id}
            place={place}
            onClick={() => onPlaceClick?.(place.id)}
          />
        ))}
        
        {routeStops && routeStops.length > 0 && (
          <RoutePolyline stops={routeStops} places={places} />
        )}
      </MapContainer>
    </div>
  );
}
