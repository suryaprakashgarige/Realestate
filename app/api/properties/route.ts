import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockProperties } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const beds = searchParams.get("beds") ? Number(searchParams.get("beds")) : null;

  try {
    if (supabase) {
      let query = supabase.from("properties").select("*");
      if (city) query = query.ilike("city", `%${city}%`);
      if (minPrice !== null) query = query.gte("price", minPrice);
      if (maxPrice !== null) query = query.lte("price", maxPrice);
      if (beds !== null) query = query.gte("beds", beds);
      const { data, error } = await query;
      if (error) throw error;

      // Fetch Walk Score for each property
      const withWalkScore = await Promise.all(
        data.map(async (p: any) => {
          try {
            const wsApiKey = process.env.WALK_SCORE_API_KEY;
            if (!wsApiKey) return { ...p, walkScore: null };
            
            const wsRes = await fetch(
              `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(p.address)}&city=${encodeURIComponent(p.city)}&wsapikey=${wsApiKey}`
            );
            const wsData = await wsRes.json();
            return { ...p, walkScore: wsData.status === 1 ? wsData.walkscore : null };
          } catch (e) {
            return { ...p, walkScore: null };
          }
        })
      );
      
      return NextResponse.json(withWalkScore);
    }
  } catch (error) {
    console.error("Supabase query error:", error);
  }

  // Fallback with mock data
  let filtered = [...mockProperties];
  if (city) filtered = filtered.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
  if (minPrice !== null) filtered = filtered.filter((p) => p.price >= minPrice);
  if (maxPrice !== null) filtered = filtered.filter((p) => p.price <= maxPrice);
  if (beds !== null) filtered = filtered.filter((p) => p.beds >= beds);

  const withWalkScore = await Promise.all(
    filtered.map(async (p: any) => {
      try {
        const wsApiKey = process.env.WALK_SCORE_API_KEY;
        if (!wsApiKey) return { ...p, walkScore: null };
        const wsRes = await fetch(`https://api.walkscore.com/score?format=json&address=${encodeURIComponent(p.address)}&city=${encodeURIComponent(p.city)}&wsapikey=${wsApiKey}`);
        const wsData = await wsRes.json();
        return { ...p, walkScore: wsData.status === 1 ? wsData.walkscore : null };
      } catch (e) {
        return { ...p, walkScore: null };
      }
    })
  );

  return NextResponse.json(withWalkScore);
}
