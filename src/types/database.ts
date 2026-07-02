export type UserRole = 'tourist' | 'admin';
export type BudgetLevel = 'budget' | 'moderate' | 'premium';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          preferred_language: string;
          budget_level: BudgetLevel;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      place_categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
        };
        Insert: Omit<Database['public']['Tables']['place_categories']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['place_categories']['Insert']>;
      };
      places: {
        Row: {
          id: string;
          name: string;
          description: string;
          category_id: string;
          latitude: number;
          longitude: number;
          address: string;
          avg_cost: number;
          avg_visit_time: number;
          opening_hours: Record<string, { open: string; close: string }>;
          is_free: boolean;
          difficulty_access: Difficulty;
          rating_avg: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['places']['Row'], 'id' | 'created_at' | 'rating_avg'>;
        Update: Partial<Database['public']['Tables']['places']['Insert']>;
      };
      place_images: {
        Row: {
          id: string;
          place_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
        };
        Insert: Omit<Database['public']['Tables']['place_images']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['place_images']['Insert']>;
      };
      routes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          total_duration: number;
          total_cost: number;
          total_distance: number;
          difficulty: Difficulty;
          start_time: string | null;
          is_dynamic: boolean;
          context_snapshot: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['routes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['routes']['Insert']>;
      };
      route_stops: {
        Row: {
          id: string;
          route_id: string;
          place_id: string;
          stop_order: number;
          arrival_time: string | null;
          stay_duration: number;
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['route_stops']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['route_stops']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          rating: number;
          comment: string | null;
          visit_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      favorites: {
        Row: {
          user_id: string;
          place_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      route_feedback: {
        Row: {
          id: string;
          route_id: string;
          user_id: string;
          rating: number;
          completed: boolean;
          comments: string | null;
        };
        Insert: Omit<Database['public']['Tables']['route_feedback']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['route_feedback']['Insert']>;
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          messages: Array<{ role: 'user' | 'assistant'; content: string }>;
          route_generated: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>;
      };
    };
  };
}
