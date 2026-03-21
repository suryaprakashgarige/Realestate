"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  {
    id: 1,
    stars: 5,
    text: "The virtual tour alone saved us three weekend trips. We walked through seven homes from our couch and shortlisted two before making a single call.",
    author: "Sarah & David M.",
    initials: "SD",
    source: "Google Review",
    accentColor: "#4285F4",
  },
  {
    id: 2,
    stars: 5,
    text: "James understood exactly what we needed after one conversation. The AI match quiz found us a home we'd have never found ourselves. Closed in 28 days.",
    author: "Marcus T.",
    initials: "MT",
    source: "Google Review",
    accentColor: "#C9A96E",
  },
  {
    id: 3,
    stars: 5,
    text: "The neighborhood intelligence section was a game-changer. School ratings and commute times right on the listing — we arrived at viewings already confident.",
    author: "Priya K.",
    initials: "PK",
    source: "Zillow Review",
    accentColor: "#006AFF",
  },
];

function ReviewCard({ review, delay }: { review: typeof reviews[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16,
        padding: "28px",
        position: "relative",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Decorative large quote mark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontFamily: "Georgia, serif",
          fontSize: "80px",
          lineHeight: 1,
          color: "rgba(192,192,192,0.12)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: review.stars }).map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C0C0C0">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <p className="font-serif text-[15px] font-light text-white/75 italic leading-relaxed mb-6">
        "{review.text}"
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-sans font-medium text-[11px] tracking-wider flex-shrink-0"
          style={{ background: review.accentColor }}
        >
          {review.initials}
        </div>
        <div>
          <div className="text-[13px] font-medium text-white">{review.author}</div>
          <div className="text-[11px] text-white/40 mt-0.5">Verified · {review.source}</div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      style={{
        padding: "88px 0",
        background: "linear-gradient(160deg, #0A0A0A 0%, #0F0F0F 60%, #000000 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.03,
          pointerEvents: "none",
        }}
      />

      <div className="max-w-[1160px] mx-auto px-6 relative z-10">
        <div className="section-header mb-11">
          <div className="eyebrow mb-3">Client Reviews</div>
          <h2 className="display text-4xl md:text-5xl text-white leading-none mb-3">
            What Clients
            <br />
            <em className="text-gold italic font-light">Say</em>
          </h2>
          <div className="gold-rule" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev, i) => (
            <ReviewCard key={rev.id} review={rev} delay={i * 130} />
          ))}
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/08">
          {[
            { label: "286 Google Reviews", icon: "G", color: "#FFFFFF" },
            { label: "4.9 / 5.0 Zillow", icon: "Z", color: "#FFFFFF" },
            { label: "Top 1% Agent 2024", icon: "★", color: "#C0C0C0" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
                style={{ background: badge.color }}
              >
                {badge.icon}
              </div>
              <span className="text-[12px] text-white/50 tracking-wide">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
