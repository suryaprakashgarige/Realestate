import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockBookings } from "@/lib/mockData";

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Fetch bookings error:", error);
  }
  return NextResponse.json(mockBookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, property_interest, preferred_slot } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Basic phone validation — must contain at least 7 digits
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .insert([{ name, email, phone, property_interest, preferred_slot }])
        .select();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    console.log("Mock Booking:", { name, email, phone, property_interest, preferred_slot });
    return NextResponse.json({ success: true, message: "Booking received (Mock Mode)" });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
