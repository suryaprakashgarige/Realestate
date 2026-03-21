"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplineHero from "./SplineHero";

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

export default function Hero() {
  const homes = useCountUp(340, 1800, "+");
  const volume = useCountUp(340, 2000, "M", "$");
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const t = setTimeout(() => setLoaded(true), 80);

    // Parallax effect on the image
    if (imageRef.current && containerRef.current) {
      gsap.fromTo(
        imageRef.current,
        {
          yPercent: -15,
          scale: 1.05,
        },
        {
          yPercent: 15,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    return () => {
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-16 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex flex-col justify-center bg-transparent px-6 py-18 md:p-18 md:pl-14 relative overflow-hidden">
        <SplineHero />
        
        {/* Dot-grid background texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--gold) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Eyebrow — slides in */}
        <div
          className="flex items-center gap-3 mb-5 relative z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          <span className="w-7 h-[1.5px] bg-gold flex-shrink-0" />
          <span className="eyebrow">Beverly Hills · Exclusive</span>
        </div>

        {/* Headline — reveals word by word */}
        <h1
          className="font-serif font-light text-6xl md:text-8xl tracking-tight text-white leading-[1.05] mb-5 relative z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}
        >
          Find Where
          <br />
          <em className="text-gold italic font-light">Life Begins</em>
        </h1>

        {/* Sub */}
        <p
          className="text-base text-white/60 font-light leading-relaxed max-w-[400px] mb-9 relative z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          Walk through every home from your phone. AI-matched listings. One-click
          booking. Real estate, reimagined.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-2.5 mb-12 relative z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
          }}
        >
          <Link
            href="/#tour"
            className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dk text-white px-9 py-4 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Walk This Home
          </Link>
          <Link
            href="/properties"
            className="flex items-center justify-center border border-white/50 hover:bg-white/10 text-white px-9 py-4 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all"
          >
            Browse Properties
          </Link>
        </div>

        {/* Animated stats */}
        <div
          className="flex gap-8 relative z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s",
          }}
        >
          <div>
            <span
              ref={homes.ref}
              className="font-serif text-3xl font-light text-white block"
            >
              {homes.display}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-white/45 mt-1 block">
              Homes Sold
            </span>
          </div>
          <div className="w-[1px] bg-white/15 self-stretch" />
          <div>
            <span
              ref={volume.ref}
              className="font-serif text-3xl font-light text-white block"
            >
              {volume.display}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-white/45 mt-1 block">
              Volume
            </span>
          </div>
          <div className="w-[1px] bg-white/15 self-stretch" />
          <div>
            <span className="font-serif text-3xl font-light text-white block">
              4.9★
            </span>
            <span className="text-[10px] tracking-wider uppercase text-white/45 mt-1 block">
              Rating
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Property photo */}
      <div
        ref={containerRef}
        className="relative overflow-hidden h-[58vw] md:h-auto min-h-[320px] bg-bg-surf"
        style={{
          opacity: loaded ? 1 : 0,
          clipPath: loaded ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
          transition: "opacity 1.2s ease 0.4s, clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1) 0.4s",
        }}
      >
        <Image
          ref={imageRef as any}
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90"
          alt="Luxury property"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Silver shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(192,192,192,0.12) 0%, transparent 60%)",
          }}
        />

        <Link
          href="/#tour"
          className="absolute top-8 right-8 bg-gold hover:bg-gold-dk text-bg-deep px-5 py-2.5 rounded-full font-sans text-[10px] uppercase tracking-wider font-semibold flex items-center gap-2 transition-all z-10 shadow-shl"
        >
          <span className="w-1.5 h-1.5 bg-bg-deep rounded-full animate-pulse" />
          Virtual Tour Live
        </Link>

        {/* Floating card — entrance from left */}
        <div
          className="absolute bottom-10 left-0 md:left-[-30px] bg-card-bg border border-card-border rounded-rl p-6 shadow-shl min-w-[240px] mx-6 md:mx-0 z-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 1s ease 1.1s, transform 1s cubic-bezier(0.23, 1, 0.32, 1) 1.1s",
          }}
        >
          <div className="text-[10px] uppercase tracking-widest text-gold mb-2 font-semibold">
            Featured Listing
          </div>
          <div className="font-serif text-3xl text-white font-light tracking-tight mb-1">
            $2,850,000
          </div>
          <div className="text-[11px] text-white/50 font-light mt-1 uppercase tracking-widest">
            142 Ridgewood Ave · Beverly Hills
          </div>
        </div>
      </div>
    </section>
  );
}
