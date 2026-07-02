import type { Difficulty } from './database';

export interface RouteStop {
  place_id: string;
  name: string;
  order: number;
  arrival_time: string;
  stay_duration: number;
  walking_time_to_next: number;
  walking_distance_m: number;
  notes: string;
}

export interface GeneratedRoute {
  title: string;
  description: string;
  total_duration: number;
  total_cost: number;
  total_distance: number;
  difficulty: Difficulty;
  stops: RouteStop[];
}

export interface RouteStep {
  place: string;
  time: string;
  description: string;
  tip: string;
}

export interface StructuredRoute {
  introduction: string;
  steps: RouteStep[];
  mapsUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RouteRequest {
  messages: ChatMessage[];
  available_places: PlaceContext[];
  user_budget?: number;
  user_time?: number;
  user_location?: { lat: number; lng: number };
}

export interface PlaceContext {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  avg_cost: number;
  avg_visit_time: number;
  is_free: boolean;
  rating_avg: number;
}
