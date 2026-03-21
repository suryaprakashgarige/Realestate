"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Property } from "@/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [beds, setBeds] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let url = `/api/properties?maxPrice=${maxPrice}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;
      if (beds) url += `&beds=${beds}`;

      const res = await fetch(url);
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Fetch listings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [city, maxPrice, beds]);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      {/* Header */}
      <section className="pt-34 pb-14 bg-bg-deep text-white text-center">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="eyebrow mb-2">Our Collection</div>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-none mb-3">
            Explore <em className="text-gold italic">Listings</em>
          </h1>
          <p className="text-sm text-white/50 max-w-[400px] mx-auto font-light leading-relaxed">
            Filter by city, budget, and size to find your next home.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 border-r border-card-border pr-6">
              <div className="sticky top-24 flex flex-col gap-6">
                <div>
                  <label className="text-[10px] tracking-wider uppercase text-muted font-semibold mb-2 block">City Location</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-card-border rounded-r text-sm bg-white outline-none focus:border-gold transition-all"
                  >
                    <option value="">All Cities</option>
                    <option value="Beverly Hills">Beverly Hills</option>
                    <option value="Scottsdale">Scottsdale</option>
                    <option value="Austin">Austin</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-[10px] tracking-wider uppercase text-muted font-semibold block">Max Price</label>
                    <span className="font-serif text-sm text-text">${(maxPrice/1000).toFixed(0)}K</span>
                  </div>
                  <input 
                    type="range" 
                    min={200000} 
                    max={5000000} 
                    step={100000} 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(+e.target.value)}
                    className="w-full h-0.5 bg-card-border rounded-full appearance-none cursor-pointer accent-gold"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-wider uppercase text-muted font-semibold mb-2 block">Min Bedrooms</label>
                  <div className="flex gap-2">
                    {["", "3", "4", "5+"].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setBeds(cnt)}
                        className={`px-3 py-1.5 border border-card-border rounded-r text-xs cursor-pointer transition-all ${beds === cnt ? 'border-gold bg-gold text-white' : 'hover:border-gold/50 text-muted bg-white'}`}
                      >
                        {cnt === "" ? "Any" : cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-20 text-muted">Loading properties...</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 text-muted">No properties found matching filters.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
                  {properties.map((prop) => (
                    <Link 
                      key={prop.id} 
                      href={`/properties/${prop.id}`}
                      className="group border border-card-border rounded-rxl overflow-hidden hover:border-gold/30 hover:shadow-sh transition-all flex flex-col bg-white"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-bg-off">
                        <img 
                          src={prop.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=75"} 
                          alt={prop.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                        />
                        {prop.tag && (
                          <span className="absolute top-4 left-4 bg-gold text-white text-[10px] uppercase font-medium tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                            {prop.tag}
                          </span>
                        )}
                        <div className="absolute bottom-4 left-4 bg-bg-deep/80 backdrop-blur-md px-3 py-1.5 rounded-sm">
                          <span className="font-serif text-lg text-white font-light">
                            ${prop.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-4.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-balance text-[19px] text-text font-light group-hover:text-gold transition-colors leading-snug mb-0.5">
                            {prop.title}
                          </h3>
                          <p className="text-[11px] text-muted">{prop.city}</p>
                        </div>
                        
                        <div className="flex gap-4 border-t border-card-border pt-3 mt-4 text-[11px] text-muted">
                          <span>{prop.beds} Beds</span>
                          <span>{prop.baths} Baths</span>
                          <span>{prop.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
