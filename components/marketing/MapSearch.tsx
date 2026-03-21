"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup, NavigationControl, ViewStateChangeEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Property } from "@/types";

export default function MapSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 34.0736,
    longitude: -118.4004,
    zoom: 10,
  });

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(p);

  return (
    <section className="bg-bg" id="map">
      <div className="max-w-[1160px] mx-auto px-6 py-16">
        <div className="eyebrow mb-3">Explore the Area</div>
        <h2 className="display text-4xl md:text-5xl text-text leading-none mb-3">
          Find on<br />
          <em className="text-gold italic font-light">the Map</em>
        </h2>
        <div className="gold-rule mb-8" />
      </div>

      <div style={{ height: "500px", width: "100%" }}>
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN.includes("your-") ? (
          <div className="h-full flex items-center justify-center bg-bg-deep border border-white/5 text-white/40 text-sm">
            Please configure NEXT_PUBLIC_MAPBOX_TOKEN inside .env.local
          </div>
        ) : (
          <Map
            {...viewport}
            onMove={(evt: ViewStateChangeEvent) => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
          <NavigationControl position="top-right" />
          {properties.map((prop) => (
            <Marker
              key={prop.id}
              latitude={34.0736 + (Math.random() - 0.5) * 0.2}
              longitude={-118.4004 + (Math.random() - 0.5) * 0.2}
              onClick={() => setSelected(prop)}
            >
              <div
                style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#C0A832",
                  border: "2px solid rgba(192,168,50,0.4)",
                  cursor: "pointer",
                  boxShadow: "0 0 8px rgba(192,168,50,0.6)",
                }}
              />
            </Marker>
          ))}
          {selected && (
            <Popup
              latitude={34.0736}
              longitude={-118.4004}
              onClose={() => setSelected(null)}
              closeButton
              anchor="bottom"
            >
              <div style={{ padding: "8px", minWidth: "200px", background: "#0A0A0A", color: "#fff" }}>
                <div style={{ fontSize: 11, color: "#C0A832", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                  {selected.tag}
                </div>
                <div style={{ fontSize: 20, fontFamily: "var(--font-cormorant)", fontWeight: 300, marginBottom: 2 }}>
                  {formatPrice(selected.price)}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                  {selected.city} · {selected.beds}bd {selected.baths}ba
                </div>
                <a
                  href="#book"
                  style={{
                    display: "block", textAlign: "center",
                    background: "#C0A832", color: "#fff",
                    padding: "6px 12px", borderRadius: 4,
                    fontSize: 10, textTransform: "uppercase",
                    letterSpacing: "0.1em", textDecoration: "none",
                  }}
                >
                  Book Viewing
                </a>
              </div>
            </Popup>
          )}
        </Map>
        )}
      </div>
    </section>
  );
}
