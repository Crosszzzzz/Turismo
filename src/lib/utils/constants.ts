export const SUCRE_CENTER = {
  lat: -19.0196,
  lng: -65.2619,
} as const;

export const SUCRE_BOUNDS = {
  north: -19.0050,
  south: -19.0350,
  east: -65.2450,
  west: -65.2800,
} as const;

export const DEFAULT_MAP_ZOOM = 14;

export const PLACE_CATEGORIES = [
  { name: 'Museos', icon: 'landmark', color: '#6366f1' },
  { name: 'Iglesias', icon: 'church', color: '#8b5cf6' },
  { name: 'Restaurantes', icon: 'utensils', color: '#f59e0b' },
  { name: 'Mercados', icon: 'store', color: '#10b981' },
  { name: 'Parques', icon: 'trees', color: '#22c55e' },
  { name: 'Miradores', icon: 'mountain', color: '#ef4444' },
  { name: 'Galerías', icon: 'palette', color: '#ec4899' },
  { name: 'Hoteles', icon: 'bed', color: '#3b82f6' },
] as const;

export const BUDGET_OPTIONS = [
  { value: 'budget' as const, label: 'Económico', maxPerDay: 100 },
  { value: 'moderate' as const, label: 'Moderado', maxPerDay: 250 },
  { value: 'premium' as const, label: 'Premium', maxPerDay: 500 },
];
