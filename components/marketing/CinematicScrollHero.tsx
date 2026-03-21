"use client";

/**
 * CinematicScrollHero — Draftly-style scroll-driven video playback
 *
 * HOW IT WORKS:
 *  1. A <video> element loads a cinematic property clip (muted, no autoplay).
 *  2. GSAP ScrollTrigger maps scroll progress (0 → 1) to video.currentTime.
 *  3. As the user scrolls, the video plays frame-by-frame — the Draftly effect.
 *  4. Text/UI overlays animate in on entry, pin during the scroll sequence.
 *
 * TO SWAP THE VIDEO:
 *  Replace VIDEO_SRC with your own Kling/Runway generated clip URL,
 *  or drop the file in /public/hero.mp4 and use src="/hero.mp4".
 *
 * TO USE EXTRACTED FRAMES INSTEAD:
 *  Set USE_FRAMES = true and point FRAMES_DIR to your /public/frames/ folder.
 *  The component will preload all frames and draw them to a <canvas>.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-mansion-34571-large.mp4";

// Frame-based mode (set true if you extracted frames with FFmpeg)
const USE_FRAMES = false;
const FRAMES_DIR = "/frames"; // /public/frames/frame0001.webp …
const FRAME_COUNT = 120;
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 2000, suffix = "", prefix = "") {
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

// ─── CANVAS FRAME PLAYER ─────────────────────────────────────────────────────
function CanvasFramePlayer({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const loaded = useRef(0);

  useEffect(() => {
    frames.current = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const pad = String(i).padStart(4, "0");
      img.src = `${FRAMES_DIR}/frame${pad}.webp`;
      img.onload = () => { loaded.current++; };
      frames.current.push(img);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const idx = Math.floor(progress * (FRAME_COUNT - 1));
    const img = frames.current[idx];
    if (img?.complete && img.naturalWidth > 0) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ objectFit: "cover" }}
    />
  );
}

// ─── VIDEO SCROLL PLAYER ──────────────────────────────────────────────────────
function VideoScrollPlayer({ onProgress }: { onProgress: (p: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = videoRef.current;
    if (!video) return;

    // Wait for metadata so we know duration
    const init = () => {
      ScrollTrigger.create({
        trigger: "#cinematic-scroll-pin",
        start: "top top",
        end: "+=300%",
        scrub: 0.5,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
          onProgress(self.progress);
        },
      });
    };

    if (video.readyState >= 1) init();
    else video.addEventListener("loadedmetadata", init, { once: true });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [onProgress]);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CinematicScrollHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const homes = useCountUp(340, 1800, "+");
  const volume = useCountUp(340, 2000, "M", "$");

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Scroll-driven text parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!textRef.current || !cardRef.current) return;

    gsap.to(textRef.current, {
      y: -80,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: "#cinematic-scroll-pin",
        start: "top top",
        end: "+=200%",
        scrub: 1,
      },
    });

    gsap.to(cardRef.current, {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: "#cinematic-scroll-pin",
        start: "top top",
        end: "+=150%",
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Scroll progress → color overlay opacity
  const overlayOpacity = Math.min(scrollProgress * 1.2, 0.65);
  const darkenOpacity = scrollProgress * 0.4;

  return (
    /*
     * PINNED WRAPPER — the outer div is the ScrollTrigger "trigger".
     * Its height (300vh) determines how long the scroll sequence lasts.
     * Increase to 400vh for a slower, more cinematic feel.
     */
    <div id="cinematic-scroll-pin" style={{ height: "300vh", position: "relative" }}>
      {/* STICKY CANVAS — stays fixed while parent scrolls */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* ── VIDEO / FRAME LAYER ── */}
        <div className="absolute inset-0">
          {USE_FRAMES ? (
            <CanvasFramePlayer progress={scrollProgress} />
          ) : (
            <VideoScrollPlayer onProgress={setScrollProgress} />
          )}
        </div>

        {/* ── DARKENING OVERLAY (deepens on scroll) ── */}
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.35 + darkenOpacity, transition: "opacity 0.1s linear" }}
        />

        {/* ── GOLD VIGNETTE (top + bottom) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, transparent 35%, transparent 65%, rgba(10,10,10,0.9) 100%)",
          }}
        />

        {/* ── GRAIN TEXTURE OVERLAY ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* ── DOT GRID TEXTURE ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--gold) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── SCROLL PROGRESS BAR ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-30">
          <div
            className="h-full bg-gold"
            style={{
              width: `${scrollProgress * 100}%`,
              transition: "width 0.05s linear",
              boxShadow: "0 0 8px var(--gold)",
            }}
          />
        </div>

        {/* ── SCROLL INDICATOR (fades out after scroll starts) ── */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          style={{
            opacity: entered ? Math.max(1 - scrollProgress * 6, 0) : 0,
            transition: "opacity 0.3s",
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-light">
            Scroll to explore
          </span>
          <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 bg-gold"
              style={{
                animation: "scrollLine 1.6s ease-in-out infinite",
                height: "40%",
              }}
            />
          </div>
        </div>

        {/* ── MAIN TEXT OVERLAY ── */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10 max-w-[700px]"
        >
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            <span className="w-8 h-[1px] bg-gold flex-shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
              Beverly Hills · Exclusive
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-light leading-[0.95] mb-6"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
            }}
          >
            <span className="text-white block">Find Where</span>
            <em className="text-gold italic font-extralight block">Life Begins</em>
          </h1>

          {/* Sub */}
          <p
            className="text-base text-white/55 font-light leading-relaxed max-w-[420px] mb-10"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
            }}
          >
            Walk through every home from your phone. AI-matched listings.
            One-click booking. Real estate, reimagined.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 mb-14"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
            }}
          >
            <Link
              href="/#tour"
              className="group flex items-center gap-2.5 bg-gold hover:bg-gold-dk text-bg-deep px-8 py-3.5 rounded font-sans text-[11px] uppercase tracking-widest font-semibold transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Walk This Home
            </Link>
            <Link
              href="/properties"
              className="flex items-center border border-white/30 hover:border-white/60 hover:bg-white/[0.06] text-white px-8 py-3.5 rounded font-sans text-[11px] uppercase tracking-widest font-medium transition-all"
            >
              Browse Properties
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.75s, transform 0.8s ease 0.75s",
            }}
          >
            {[
              { ref: homes.ref, value: homes.display, label: "Homes Sold" },
              { ref: volume.ref, value: volume.display, label: "Volume" },
              { ref: null, value: "4.9★", label: "Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-8">
                <div>
                  <span
                    ref={stat.ref ?? undefined}
                    className="font-serif text-3xl font-light text-white block leading-none"
                  >
                    {stat.value}
                  </span>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/40 mt-1.5 block">
                    {stat.label}
                  </span>
                </div>
                {i < 2 && <div className="w-[1px] h-8 bg-white/15" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── FLOATING PROPERTY CARD (bottom right) ── */}
        <div
          ref={cardRef}
          className="absolute bottom-10 right-8 md:right-12 z-20"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 1s ease 1.1s, transform 1s cubic-bezier(0.23, 1, 0.32, 1) 1.1s",
          }}
        >
          {/* Virtual tour badge */}
          <Link
            href="/#tour"
            className="absolute -top-4 left-0 bg-gold text-bg-deep px-4 py-1.5 rounded-full font-sans text-[9px] uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-shl z-10"
          >
            <span className="w-1.5 h-1.5 bg-bg-deep rounded-full animate-pulse" />
            Virtual Tour Live
          </Link>

          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-rl p-5 min-w-[220px] shadow-shl">
            <div className="text-[9px] uppercase tracking-[0.25em] text-gold mb-2 font-semibold">
              Featured Listing
            </div>
            <div className="font-serif text-3xl text-white font-light tracking-tight mb-1">
              $2,850,000
            </div>
            <div className="text-[10px] text-white/45 font-light uppercase tracking-widest">
              142 Ridgewood Ave · Beverly Hills
            </div>

            {/* Specs row */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.08]">
              {["5 Beds", "4 Baths", "4,200 sqft"].map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCROLL DEPTH INDICATOR (right edge) ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20 opacity-40">
          <div className="w-[1px] h-16 bg-white/20">
            <div
              className="w-full bg-gold"
              style={{
                height: `${scrollProgress * 100}%`,
                transition: "height 0.05s linear",
              }}
            />
          </div>
          <span
            className="text-[9px] tracking-widest text-white/40 uppercase"
            style={{ writingMode: "vertical-lr" }}
          >
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
