import { supabase } from "./supabase";

const properties = [
  {
    title: "142 Ridgewood Ave",
    price: 2850000,
    address: "142 Ridgewood Ave",
    city: "Beverly Hills, CA",
    beds: 5,
    baths: 4,
    sqft: 4200,
    tag: "New",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ],
    neighborhood_scores: {
      school: 9.2, safety: 8.8, transit: 7.5,
      amenities: 9.0, priceGrowth: 18.4, daysOnMarket: 14
    }
  },
  {
    title: "88 Maple Canyon Dr",
    price: 1490000,
    address: "88 Maple Canyon Dr",
    city: "Scottsdale, AZ",
    beds: 4,
    baths: 3,
    sqft: 3100,
    tag: "Exclusive",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    ],
    neighborhood_scores: {
      school: 8.5, safety: 9.1, transit: 6.2,
      amenities: 8.3, priceGrowth: 12.1, daysOnMarket: 21
    }
  },
  {
    title: "7 Clover Hill Rd",
    price: 975000,
    address: "7 Clover Hill Rd",
    city: "Austin, TX",
    beds: 3,
    baths: 2,
    sqft: 2400,
    tag: "Price Drop",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80"
    ],
    neighborhood_scores: {
      school: 7.8, safety: 8.2, transit: 8.9,
      amenities: 9.4, priceGrowth: 22.3, daysOnMarket: 9
    }
  },
  {
    title: "29 Sunridge Blvd",
    price: 4200000,
    address: "29 Sunridge Blvd",
    city: "Malibu, CA",
    beds: 6,
    baths: 5,
    sqft: 6800,
    tag: "Luxury",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
    ],
    neighborhood_scores: {
      school: 9.5, safety: 9.3, transit: 5.1,
      amenities: 8.7, priceGrowth: 31.2, daysOnMarket: 42
    }
  },
  {
    title: "55 Lakeview Terrace",
    price: 1875000,
    address: "55 Lakeview Terrace",
    city: "Miami, FL",
    beds: 4,
    baths: 3,
    sqft: 3750,
    tag: "Waterfront",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    neighborhood_scores: {
      school: 8.1, safety: 7.6, transit: 8.4,
      amenities: 9.6, priceGrowth: 19.8, daysOnMarket: 17
    }
  }
];

export async function seedDatabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Check your environment variables.");
  }

  // 1. Insert properties
  const { data: insertedProperties, error: pError } = await supabase
    .from("properties")
    .insert(properties)
    .select();

  if (pError) throw pError;

  // 2. Map rooms for Ridgewood Ave
  const ridgewood = insertedProperties.find(p => p.title === "142 Ridgewood Ave");
  
  if (ridgewood) {
    const rooms = [
      {
        property_id: ridgewood.id,
        name: "Grand Living Room",
        description: "Expansive layout with floor-to-ceiling panoramic glass windows.",
        hotspot_x: "30%",
        hotspot_y: "45%",
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-luxury-mansion-interior-living-room-pan-view-40013-large.mp4"
      },
      {
        property_id: ridgewood.id,
        name: "Chef's Kitchen",
        description: "State-of-the-art marble island and premium fixtures layout.",
        hotspot_x: "62%",
        hotspot_y: "35%",
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-design-40112-large.mp4"
      },
      {
        property_id: ridgewood.id,
        name: "Master Suite",
        description: "Overlooking the courtyard with a private wrap-around terrace.",
        hotspot_x: "48%",
        hotspot_y: "65%",
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-luxury-bedroom-interior-with-warm-lighting-40014-large.mp4"
      }
    ];

    const { error: rError } = await supabase.from("rooms").insert(rooms);
    if (rError) throw rError;
  }

  return { message: "Seeded successfully", count: insertedProperties.length };
}
