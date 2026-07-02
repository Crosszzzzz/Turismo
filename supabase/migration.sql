-- ============================================
-- SUCRE TURISMO — Supabase Migration
-- ============================================
-- Run this in: Supabase Dashboard > SQL Editor
-- Or: supabase db push (if using CLI)

-- Enable PostGIS for geolocation (optional but recommended)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TYPE user_role AS ENUM ('tourist', 'admin');
CREATE TYPE budget_level AS ENUM ('budget', 'moderate', 'premium');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'tourist',
  preferred_language TEXT DEFAULT 'es',
  budget_level budget_level DEFAULT 'moderate',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. PLACE_CATEGORIES
-- ============================================
CREATE TABLE place_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Seed default categories
INSERT INTO place_categories (name, icon, color) VALUES
  ('Museos', 'landmark', '#6366f1'),
  ('Iglesias', 'church', '#8b5cf6'),
  ('Restaurantes', 'utensils', '#f59e0b'),
  ('Mercados', 'store', '#10b981'),
  ('Parques', 'trees', '#22c55e'),
  ('Miradores', 'mountain', '#ef4444'),
  ('Galerías', 'palette', '#ec4899'),
  ('Hoteles', 'bed', '#3b82f6');

-- ============================================
-- 3. PLACES
-- ============================================
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES place_categories(id),
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  address TEXT,
  avg_cost DECIMAL(10, 2) DEFAULT 0,
  avg_visit_time INT DEFAULT 30,
  opening_hours JSONB DEFAULT '{}',
  is_free BOOLEAN DEFAULT true,
  difficulty_access difficulty_level DEFAULT 'easy',
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for geographic queries
CREATE INDEX idx_places_location ON places (latitude, longitude);
CREATE INDEX idx_places_category ON places (category_id);
CREATE INDEX idx_places_active ON places (is_active);

-- ============================================
-- 4. PLACE_IMAGES
-- ============================================
CREATE TABLE place_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0
);

CREATE INDEX idx_place_images_place ON place_images (place_id);

-- ============================================
-- 5. ROUTES
-- ============================================
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_duration INT NOT NULL,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  total_distance DECIMAL(10, 3) DEFAULT 0,
  difficulty difficulty_level DEFAULT 'easy',
  start_time TIMESTAMPTZ,
  is_dynamic BOOLEAN DEFAULT true,
  context_snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_routes_user ON routes (user_id);

-- ============================================
-- 6. ROUTE_STOPS
-- ============================================
CREATE TABLE route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id),
  stop_order INT NOT NULL,
  arrival_time TIMESTAMPTZ,
  stay_duration INT DEFAULT 30,
  notes TEXT
);

CREATE INDEX idx_route_stops_route ON route_stops (route_id);

-- ============================================
-- 7. REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  visit_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_place ON reviews (place_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);

-- Auto-update place rating_avg
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE places
  SET rating_avg = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)
  )
  WHERE id = COALESCE(NEW.place_id, OLD.place_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_place_rating();

-- ============================================
-- 8. FAVORITES
-- ============================================
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, place_id)
);

-- ============================================
-- 9. ROUTE_FEEDBACK
-- ============================================
CREATE TABLE route_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  completed BOOLEAN DEFAULT false,
  comments TEXT
);

CREATE INDEX idx_route_feedback_route ON route_feedback (route_id);

-- ============================================
-- 10. AI_CONVERSATIONS
-- ============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  route_generated UUID REFERENCES routes(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations (user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles: public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: update own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Places: public read, admin write
CREATE POLICY "Places: public read" ON places FOR SELECT USING (is_active = true);
CREATE POLICY "Places: admin insert" ON places FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Places: admin update" ON places FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Places: admin delete" ON places FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories: public read
CREATE POLICY "Categories: public read" ON place_categories FOR SELECT USING (true);

-- Place images: public read
CREATE POLICY "Images: public read" ON place_images FOR SELECT USING (true);

-- Routes: users can read/write own
CREATE POLICY "Routes: read own" ON routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Routes: insert own" ON routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Routes: update own" ON routes FOR UPDATE USING (auth.uid() = user_id);

-- Route stops: users can read/write via parent route
CREATE POLICY "Route stops: read via route" ON route_stops FOR SELECT
  USING (EXISTS (SELECT 1 FROM routes WHERE id = route_id AND user_id = auth.uid()));
CREATE POLICY "Route stops: insert via route" ON route_stops FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM routes WHERE id = route_id AND user_id = auth.uid()));

-- Reviews: public read, authenticated write
CREATE POLICY "Reviews: public read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: insert auth" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews: update own" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Favorites: users can read/write own
CREATE POLICY "Favorites: read own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Favorites: insert own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Favorites: delete own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Route feedback: users can read/write own
CREATE POLICY "Feedback: read own" ON route_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Feedback: insert own" ON route_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI conversations: users can read/write own
CREATE POLICY "AI: read own" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "AI: insert own" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "AI: update own" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS (for images)
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('places', 'places', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Places: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'places');
CREATE POLICY "Places: admin upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'places' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Avatars: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatars: upload own" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
