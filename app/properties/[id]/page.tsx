import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { mockProperties } from "@/lib/mockData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Property } from "@/types";
import Book from "@/components/marketing/Book";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Property ${id} | LuxeNest Realty`,
    description: `View luxury property details, virtual tour, and book a private viewing.`,
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let property: Property | null = null;

  try {
    if (supabase) {
      const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
      if (!error) property = data;
    }
  } catch (error) {
    console.error("Fetch property error:", error);
  }

  if (!property) {
    const mock = mockProperties.find((p) => String(p.id) === id);
    if (mock) property = mock as any;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted">
        Property not found.
      </div>
    );
  }

  const mainImage = property.images?.[0] || (property as any).image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";
  const otherImages = property.images?.slice(1) || [];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Gallery / Hero */}
      <section className="pt-24 bg-bg-deep">
        <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          <div className="aspect-[4/3] rounded-rl overflow-hidden">
            <img 
              src={mainImage} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {otherImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-r overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-14 bg-white border-b border-card-border">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            
            <div className="md:col-span-2">
              <div className="eyebrow mb-2">{property.city}</div>
              <h1 className="font-serif text-4xl font-light text-text mb-2 leading-none">
                {property.title}
              </h1>
              <div className="font-serif text-2xl text-gold mb-4">
                ${property.price.toLocaleString()}
              </div>
              <div className="gold-rule mb-6" />

              <div className="flex gap-8 py-5 border-t border-b border-card-border2 mb-7 text-text">
                <div>
                  <span className="font-serif text-2xl font-light">{property.beds}</span>
                  <span className="text-[10px] tracking-wider uppercase text-muted block">Bedrooms</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light">{property.baths}</span>
                  <span className="text-[10px] tracking-wider uppercase text-muted block">Bathrooms</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-light">{property.sqft.toLocaleString()}</span>
                  <span className="text-[10px] tracking-wider uppercase text-muted block">Sqft Area</span>
                </div>
              </div>

              <p className="body-muted leading-relaxed max-w-[580px] mb-8">
                Experience unparalleled luxury architecture nestled in {property.city}. This residence combines modern comfort with timeless craftsmanship, featuring expansive floor-to-ceiling windows and premium finishes layout.
              </p>
            </div>

            <div className="md:col-span-1 border border-card-border p-5 rounded-rxl bg-bg-off shadow-sh">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1 font-semibold">Listing Agent</div>
              <div className="flex items-center gap-3.5 mb-5.5">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" alt="Agent" className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-medium text-text">James Whitmore</div>
                  <div className="text-[11px] text-muted">Senior Specialist</div>
                </div>
              </div>
              <button className="w-full bg-gold hover:bg-gold-dk text-white py-3 rounded-r font-sans text-xs uppercase tracking-widest font-medium transition-all mb-2">
                Ask a Question
              </button>
              <button className="w-full border border-gold text-gold hover:bg-gold hover:text-white py-3 rounded-r font-sans text-xs uppercase tracking-widest font-medium transition-all">
                Book a Viewing
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Integration wrapper at detail bottom */}
      <Book />

      <Footer />
    </main>
  );
}
