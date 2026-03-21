-- Properties Table
CREATE TABLE properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  price numeric NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  beds integer NOT NULL,
  baths integer NOT NULL,
  sqft integer NOT NULL,
  tag text, -- e.g., 'New', 'Exclusive'
  images text[], -- Array of URLs
  neighborhood_scores jsonb, -- {school: 9.2, safety: 8.8, etc}
  created_at timestamp DEFAULT now()
);

-- Rooms (for Virtual Tour hotspots)
CREATE TABLE rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  video_url text, -- Storage URL
  hotspot_x text NOT NULL, -- percentage
  hotspot_y text NOT NULL  -- percentage
);

-- Bookings Table
CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  property_interest text,
  preferred_slot text,
  created_at timestamp DEFAULT now()
);

-- Reviews Table
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author text NOT NULL,
  text text NOT NULL,
  source text NOT NULL, -- 'Google', 'Zillow'
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public READ for Listings & Reviews
CREATE POLICY "Public Read Properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public Read Rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);

-- Public INSERT for Bookings
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Admin restrictions handled via Supabase Auth or policies as needed
