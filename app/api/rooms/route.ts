import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockRooms } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("property_id", propertyId);
      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Rooms fetch error:", error);
  }

  const filtered = mockRooms.filter((r) => r.property_id === propertyId);
  return NextResponse.json(filtered);
}
