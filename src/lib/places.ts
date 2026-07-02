import * as THREE from 'three';

export interface Place {
  id: string;
  name: string;
  type: string;
  category: string;
  lat: number;
  lon: number; // mapped from lng
  info: string;
  time: string;
  cost: string;
  rating: string;
  schedule: string;
  difficulty: string;
  emoji: string;
  image?: string;
  position?: THREE.Vector3;
}

export const GLOBE_RADIUS = 2;

// Convert lat/lon to 3D Cartesian coordinates on a sphere
export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

const rawPlaces = [
  { id: 1, name: "Catedral Metropolitana", lat: -19.0486, lng: -65.2603, type: "church", image: "https://picsum.photos/seed/sucre1/400/200" },
  { id: 2, name: "Casa de la Libertad", lat: -19.0481, lng: -65.2600, type: "museum", image: "https://picsum.photos/seed/sucre2/400/200" },
  { id: 3, name: "Mercado Central", lat: -19.0456, lng: -65.2586, type: "market", image: "https://picsum.photos/seed/sucre3/400/200" },
  { id: 4, name: "Castillo de la Glorieta", lat: -19.0847, lng: -65.2686, type: "castle", image: "https://picsum.photos/seed/sucre4/400/200" },
  { id: 5, name: "Iglesia de San Francisco", lat: -19.0481, lng: -65.2631, type: "church", image: "https://picsum.photos/seed/sucre5/400/200" },
  { id: 6, name: "Universidad USFX", lat: -19.0461, lng: -65.2614, type: "museum", image: "https://picsum.photos/seed/sucre6/400/200" },
  { id: 7, name: "Parque Bolívar", lat: -19.0436, lng: -65.2644, type: "park", image: "https://picsum.photos/seed/sucre7/400/200" },
  { id: 8, name: "Museo ASUR", lat: -19.0542, lng: -65.2539, type: "museum", image: "https://picsum.photos/seed/sucre8/400/200" },
  { id: 9, name: "Oratorio de San Felipe Neri", lat: -19.0478, lng: -65.2606, type: "church", image: "https://picsum.photos/seed/sucre9/400/200" },
  { id: 10, name: "Museo del Tesoro", lat: -19.0497, lng: -65.2631, type: "museum", image: "https://picsum.photos/seed/sucre10/400/200" },
  { id: 11, name: "Templo de San Lázaro", lat: -19.0519, lng: -65.2617, type: "church", image: "https://picsum.photos/seed/sucre11/400/200" },
  { id: 12, name: "Teatro Gran Mariscal", lat: -19.0450, lng: -65.2633, type: "museum", image: "https://picsum.photos/seed/sucre12/400/200" },
  { id: 13, name: "Convento de Santa Clara", lat: -19.0456, lng: -65.2625, type: "museum", image: "https://picsum.photos/seed/sucre13/400/200" },
  { id: 14, name: "Cementerio General", lat: -19.0481, lng: -65.2625, type: "park", image: "https://picsum.photos/seed/sucre14/400/200" },
  { id: 15, name: "Parque Cretácico", lat: -19.0067, lng: -65.2361, type: "dino", image: "https://picsum.photos/seed/sucre15/400/200" },
  { id: 16, name: "Plaza de la Recoleta", lat: -19.0547, lng: -65.2533, type: "park", image: "https://picsum.photos/seed/sucre16/400/200" }
];

const minLat = Math.min(...rawPlaces.map(p => p.lat));
const maxLat = Math.max(...rawPlaces.map(p => p.lat));
const minLng = Math.min(...rawPlaces.map(p => p.lng));
const maxLng = Math.max(...rawPlaces.map(p => p.lng));

// Normalize coordinates and apply repulsion so they NEVER overlap
const mappedPlaces = rawPlaces.map(p => {
  const normLat = ((p.lat - minLat) / (maxLat - minLat)) * 2 - 1;
  const normLng = ((p.lng - minLng) / (maxLng - minLng)) * 2 - 1;

  // Map to full sphere degrees initially
  return {
    ...p,
    mappedLat: normLat * 85,
    mappedLng: normLng * 170
  };
});

// Repulsion algorithm to push overlapping places apart
const MIN_DIST = 40; // Minimum separation in degrees
for (let iter = 0; iter < 100; iter++) {
  for (let i = 0; i < mappedPlaces.length; i++) {
    for (let j = i + 1; j < mappedPlaces.length; j++) {
      const p1 = mappedPlaces[i];
      const p2 = mappedPlaces[j];
      const dLat = p1.mappedLat - p2.mappedLat;
      let dLng = p1.mappedLng - p2.mappedLng;
      
      // Handle wraparound for longitude (shortest distance around sphere)
      if (dLng > 180) dLng -= 360;
      if (dLng < -180) dLng += 360;

      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < MIN_DIST && dist > 0.01) {
        const pushForce = ((MIN_DIST - dist) / dist) * 0.5; // push them apart gently
        p1.mappedLat += dLat * pushForce;
        p1.mappedLng += dLng * pushForce;
        p2.mappedLat -= dLat * pushForce;
        p2.mappedLng -= dLng * pushForce;
        
        // Keep within bounds
        p1.mappedLat = Math.max(-85, Math.min(85, p1.mappedLat));
        p2.mappedLat = Math.max(-85, Math.min(85, p2.mappedLat));
      }
    }
  }
}

const emojiMap: Record<string, string> = {
  church: "⛪",
  museum: "🏛️",
  market: "🛒",
  castle: "🏰",
  park: "🌳",
  restaurant: "☕",
  gallery: "🖼️",
  dino: "🦖",
};

const catMap: Record<string, string> = {
  church: "Iglesia",
  museum: "Museo",
  market: "Mercado",
  castle: "Castillo",
  park: "Parque",
  restaurant: "Restaurante",
  gallery: "Galería",
  dino: "Parque",
};

export const SUCRE_PLACES: Place[] = mappedPlaces.map(p => {
  return {
    id: p.id.toString(),
    name: p.name,
    type: p.type,
    category: catMap[p.type] || "Lugar",
    lat: p.mappedLat,
    lon: p.mappedLng,
    info: `Un imperdible en Sucre: ${p.name}. Explora su historia y encanto.`,
    time: '1 - 2 hrs',
    cost: 'Variable',
    rating: (4.0 + Math.random() * 0.9).toFixed(1),
    schedule: '09:00 - 18:00',
    difficulty: 'Fácil',
    emoji: emojiMap[p.type] || "📍",
    image: p.image,
    position: latLongToVector3(p.mappedLat, p.mappedLng, GLOBE_RADIUS)
  };
});

// Alias for backwards compatibility
export const PLACES_WITH_POS = SUCRE_PLACES;
