"use client";

import { useState, useEffect } from "react";
import { Play, Home, Bed, Coffee, Trees, Briefcase, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Room } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  living_room: Home,
  master_suite: Bed,
  kitchen: Coffee,
  garden_pool: Trees,
  home_office: Briefcase,
};

function getRoomIcon(name: string): any {
  const key = name.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "");
  return iconMap[key] ?? Home;
}

interface VirtualTourProps {
  propertyId: string;
}

export default function VirtualTour({ propertyId }: VirtualTourProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("All Rooms");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rooms?propertyId=${propertyId}`);
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Room fetch error:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [propertyId]);

  const chips = ["All Rooms", ...rooms.map((r) => r.name)];

  const visibleRooms =
    activeChip === "All Rooms"
      ? rooms
      : rooms.filter((r) => r.name === activeChip);

  return (
    <section className="bg-dark-bg py-22" id="tour">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-18 items-center">

          {/* Left: Info */}
          <div>
            <div className="eyebrow mb-3">Unique Feature</div>
            <h2 className="display text-4xl md:text-5xl text-dark-text leading-none mb-4">
              Walk This<br />
              <em className="text-gold italic font-light">Home</em>
            </h2>
            <div className="gold-rule" />
            <p className="body-muted mb-8 text-dark-sub leading-relaxed">
              Our agents record every property. You experience it as a room-by-room
              interactive floor plan — click any hotspot to step inside, see dimensions,
              and book a visit instantly.
            </p>
            <div className="flex flex-col gap-4 mt-7">
              {[
                { icon: Play, title: "Agent-recorded, no 360° camera", desc: "Shot on any smartphone — mapped to an interactive floor plan." },
                { icon: Home, title: "Click any room to step inside", desc: "See dimensions, features, and a direct video segment per room." },
                { icon: Briefcase, title: "Tour at midnight from your phone", desc: "Full mobile-first — walk homes without leaving your couch." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 border border-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-dark-h4 mb-0.5">{title}</h4>
                    <p className="text-xs text-dark-featP leading-normal">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Viewer */}
          <div>
            <div className="bg-card-bg border border-card-border rounded-rxl overflow-hidden shadow-shl">
              <div className="px-4 py-3 border-b border-card-border2 flex items-center justify-between">
                <span className="text-xs font-medium text-white/80">Floor Plan — Interactive</span>
                <span className="flex items-center gap-1 text-[10px] text-gold uppercase tracking-wider font-medium">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
                  Live
                </span>
              </div>

              <div className="relative h-[320px] overflow-hidden cursor-crosshair">
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=70"
                  alt="Floor Plan"
                />
                <div className="absolute top-4 left-4 bg-bg-surf border border-card-border rounded-full px-3 py-1 text-[10px] tracking-wider uppercase text-white/40">
                  Ground Floor
                </div>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  </div>
                )}

                {!loading && visibleRooms.map((room) => {
                  const Icon = getRoomIcon(room.name);
                  const isActive = selectedRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border-2 border-gold flex items-center justify-center cursor-pointer transition-all shadow-[0_0_0_6px_rgba(192,192,192,0.15)] ${isActive ? "bg-gold scale-110" : "bg-bg-surf hover:scale-105"}`}
                      style={{ left: room.hotspot_x, top: room.hotspot_y }}
                      onClick={() => { setSelectedRoom(room); setVideoError(false); }}
                      aria-label={room.name}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-bg-deep" : "text-gold"}`} strokeWidth={1.8} />
                    </button>
                  );
                })}

                <AnimatePresence>
                  {selectedRoom && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute bottom-4 left-4 right-4 bg-bg-surf/95 border border-card-border rounded-rl p-5 shadow-shl z-10 backdrop-blur-md"
                    >
                      <button
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-muted hover:text-white cursor-pointer transition-colors"
                        onClick={() => setSelectedRoom(null)}
                        aria-label="Close"
                      >
                        <X size={14} />
                      </button>
                      <h4 className="text-sm font-medium text-white mb-2">{selectedRoom.name}</h4>
                      <p className="text-[12px] text-white/50 leading-relaxed mb-4">{selectedRoom.description}</p>

                      {/* Video player — shown only if video_url exists */}
                      {selectedRoom.video_url && !videoError && (
                        <video
                          src={selectedRoom.video_url}
                          className="w-full rounded-lg mb-4 max-h-[140px] object-cover shadow-lg"
                          autoPlay
                          muted
                          playsInline
                          controls
                          onError={() => setVideoError(true)}
                        />
                      )}

                      <div className="flex gap-3 mt-2">
                        <button
                          className="bg-gold text-bg-deep px-4 py-2 rounded font-sans font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-white transition-all shadow-sh"
                          onClick={() => {
                            if (selectedRoom.video_url) {
                              window.open(selectedRoom.video_url, "_blank");
                            }
                          }}
                        >
                          <Play size={11} fill="currentColor" /> Play Video
                        </button>
                        <a
                          href="#book"
                          className="border border-white/20 text-white px-4 py-2 rounded font-sans text-[11px] uppercase tracking-wider hover:bg-white/10 transition-all font-medium"
                        >
                          Book Visit
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Room chips — built from live data */}
              <div className="p-4 border-t border-card-border2 flex gap-2 overflow-x-auto bg-bg-surf scrollbar-none">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border text-[11px] cursor-pointer transition-all font-medium tracking-wide ${activeChip === chip ? "border-gold text-bg-deep bg-gold" : "border-white/10 text-white/40 hover:border-gold/50 hover:text-white"}`}
                    onClick={() => { setActiveChip(chip); setSelectedRoom(null); }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
