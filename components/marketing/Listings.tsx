"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LiquidImage from "./LiquidImage";
import VanillaTilt from "vanilla-tilt";
import { Property } from "@/types";

function PropertyCard({ prop, delay }: { prop: Property; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialize 3D VanillaTilt
    VanillaTilt.init(el, { max: 8, speed: 400, glare: true, "max-glare": 0.15 });

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      // Cleanup Tilt
      if ((el as any).vanillaTilt) {
        (el as any).vanillaTilt.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card-bg border border-white/5 rounded-rl overflow-hidden cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        boxShadow: hovered ? "0 25px 80px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.2)",
        borderColor: hovered ? "rgba(255,255,255,0.15)" : undefined,
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-surf">
        <LiquidImage 
          src={prop.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"} 
          className="w-full h-full absolute inset-0"
        />

        {/* Dark gradient on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: "linear-gradient(to top, rgba(10,20,40,0.7) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium text-white ${
            prop.tag === "Price Drop" ? "bg-text" : "bg-gold"
          }`}
        >
          {prop.tag}
        </div>

        {/* Tour button — slides up from bottom on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <button className="bg-white text-bg-deep px-5 py-2.5 rounded-full text-[10px] tracking-wider uppercase font-medium flex items-center gap-1.5 border border-white/20 hover:bg-gold hover:text-white transition-all shadow-xl">
            <Play size={10} fill="currentColor" strokeWidth={0} /> Walk This Home
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="font-serif text-2xl text-white mb-0.5 tracking-tight">{formatPrice(prop.price)}</div>
        <div className="text-xs text-white/50 mb-4 font-light">
          {prop.title} · {prop.city}
        </div>
        <div className="flex gap-4 pt-4 border-t border-white/5">
          {[
            { label: `${prop.beds} Beds` },
            { label: `${prop.baths} Baths` },
            { label: `${prop.sqft.toLocaleString()} sqft` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-1.5 text-xs text-white/40 before:content-[''] before:w-1 before:h-1 before:bg-gold before:rounded-full"
            >
              {stat.label}
            </div>
          ))}
        </div>

        {prop.walkScore && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Walk Score</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: prop.walkScore >= 70 ? "rgba(192,168,50,0.15)" : "rgba(255,255,255,0.05)",
                color: prop.walkScore >= 70 ? "#C0A832" : "rgba(255,255,255,0.4)",
                border: "1px solid",
                borderColor: prop.walkScore >= 70 ? "rgba(192,168,50,0.3)" : "rgba(255,255,255,0.1)",
              }}
            >
              {prop.walkScore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Listings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-bg" id="listings">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="section-header mb-11">
          <div className="eyebrow mb-3">Current Portfolio</div>
          <h2 className="display text-4xl md:text-5xl text-text leading-none mb-3">
            Featured
            <br />
            <em className="text-gold italic font-light">Properties</em>
          </h2>
          <div className="gold-rule" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5.5">
          {loading ? (
            <div className="text-white/40 text-sm">Loading properties...</div>
          ) : properties.map((prop, i) => (
            <PropertyCard key={prop.id} prop={prop} delay={i * 120} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="flex items-center justify-center border border-white/10 hover:bg-white/5 text-white px-9 py-4 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all mx-auto">
            Request Private Showing
          </button>
        </div>
      </div>
    </section>
  );
}
