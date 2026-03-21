import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockProperties } from "@/lib/mockData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {

    if (supabase) {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (data) return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Supabase single fetch error:", error);
  }

  const found = mockProperties.find((p) => p.id === id);
  if (found) return NextResponse.json(found);
  return NextResponse.json({ error: "Property not found" }, { status: 404 });
}
