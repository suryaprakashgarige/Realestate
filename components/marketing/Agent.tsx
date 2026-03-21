"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, suffix = "", prefix = "", duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: `${prefix}${value}${suffix}` };
}

export default function Agent() {
  const volume = useCountUp(340, "M", "$");
  const homes = useCountUp(340, "+");

  return (
    <section className="section bg-bg" id="agent">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-18 items-center">
          {/* Photo with decorative gold offset frame */}
          <div className="md:col-span-5 relative max-w-[380px] mx-auto md:mx-0">
            {/* Gold frame — offset behind */}
            <div
              className="absolute rounded-rxl"
              style={{
                inset: 0,
                background: "transparent",
                border: "2px solid rgba(192,192,192,0.3)",
                borderRadius: 24,
                transform: "translate(14px, 14px)",
                zIndex: 0,
              }}
            />

            <img
              className="w-full aspect-[3/4] object-cover rounded-rxl relative z-10"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=85"
              alt="James Whitmore"
              style={{ position: "relative" }}
            />

            {/* Rating badge */}
            <div className="absolute bottom-[-16px] right-[-16px] bg-card-bg border border-white/5 rounded-rl p-4.5 shadow-shl z-20">
              <div className="text-gold text-xs mb-1">★★★★★</div>
              <div className="font-serif text-xl text-white leading-none">4.9 / 5.0</div>
              <div className="text-[11px] text-white/50 mt-0.5">286 Google reviews</div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-7">
            <div className="eyebrow mb-1">Your Agent</div>
            <div className="font-serif text-5xl md:text-6xl text-text font-light leading-none mb-2">
              James
              <br />
              Whitmore
            </div>
            <div className="text-[11px] tracking-wider uppercase text-gold font-medium mb-4.5">
              Senior Luxury Property Specialist
            </div>
            <div className="gold-rule" />
            <p className="text-[15px] text-muted font-light leading-relaxed mb-7 max-w-[480px]">
              With over 12 years in the luxury market, James has closed more than
              $340 million in sales. His philosophy is simple: listen first, sell
              second.
            </p>

            {/* Animated stats */}
            <div className="flex flex-wrap gap-8 py-5.5 border-t border-b border-card-border2 mb-7">
              <div>
                <span
                  ref={volume.ref}
                  className="font-serif text-3xl font-light text-text block leading-none tabular-nums"
                >
                  {volume.display}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-muted mt-1 block">
                  Volume Closed
                </span>
              </div>
              <div>
                <span
                  ref={homes.ref}
                  className="font-serif text-3xl font-light text-text block leading-none tabular-nums"
                >
                  {homes.display}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-muted mt-1 block">
                  Homes Sold
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl font-light text-text block leading-none">
                  12 yrs
                </span>
                <span className="text-[10px] tracking-wider uppercase text-muted mt-1 block">
                  Experience
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button className="bg-gold hover:bg-gold-dk text-white px-9 py-4 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all">
                Book a Meeting
              </button>
              <Link
                href="https://wa.me/1234567890"
                target="_blank"
                className="border border-white/20 text-white hover:bg-white/10 px-9 py-4 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all text-center flex items-center justify-center"
              >
                WhatsApp James
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
