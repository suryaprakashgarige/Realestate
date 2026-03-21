export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  tag: string | null;
  images: string[];
  neighborhood_scores: {
    school: number;
    safety: number;
    transit: number;
    amenities: number;
    priceGrowth: number;
    daysOnMarket: number;
  };
  created_at?: string;
  walkScore?: number | null;
}

export interface Room {
  id: string;
  property_id: string;
  name: string;
  description: string;
  video_url: string | null;
  hotspot_x: string; // e.g., "27%"
  hotspot_y: string; // e.g., "31%"
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_interest: string | null;
  preferred_slot: string | null;
  created_at?: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  source: string;
  rating: number;
  created_at?: string;
}
