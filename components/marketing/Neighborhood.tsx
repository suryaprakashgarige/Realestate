"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ShieldCheck,
  Train,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react";

const highlights = [
  { icon: GraduationCap, label: "School Rating", score: "9.2 / 10", width: "92%", color: "#C0C0C0" },
  { icon: ShieldCheck, label: "Safety Score", score: "8.8 / 10", width: "88%", color: "#C0C0C0" },
  { icon: Train, label: "Transit Access", score: "7.5 / 10", width: "75%", color: "#C0C0C0" },
  { icon: ShoppingBag, label: "Amenities", score: "9.0 / 10", width: "90%", color: "#C0C0C0" },
  { icon: TrendingUp, label: "Price Growth (2yr)", score: "+18.4%", width: "68%", color: "#C0C0C0" },
  { icon: Clock, label: "Avg Days on Market", score: "14 days", width: "82%", color: "#C0C0C0" },
];

function HighlightCard({
  item,
  delay,
}: {
  item: typeof highlights[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card-bg border rounded-rl p-5.5 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        borderColor: hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
        style={{
          background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        }}
      >
        <Icon size={18} className="text-gold" strokeWidth={1.5} />
      </div>

      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
        {item.label}
      </div>
      <div className="font-serif text-3xl text-text font-light leading-none mb-3">
        {item.score}
      </div>

      {/* Animated progress bar */}
      <div className="h-[3px] bg-card-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: item.width }}
          transition={{ duration: 1.3, ease: "easeOut", delay: delay / 1000 + 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
          className="h-full rounded-full"
          style={{ background: item.color }}
        />
      </div>
    </div>
  );
}

export default function Neighborhood() {
  return (
    <section className="section bg-bg" id="neighborhood">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="section-header mb-11">
          <div className="eyebrow mb-3">Data-Driven Insight</div>
          <h2 className="display text-4xl md:text-5xl text-text leading-none mb-3">
            Neighborhood
            <br />
            <em className="text-gold italic font-light">Intelligence</em>
          </h2>
          <div className="gold-rule" />
          <p className="body-muted max-w-[480px]">
            Every listing shows live local data — schools, safety, commute, price
            trends — so you arrive at viewings already informed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((item, i) => (
            <HighlightCard key={item.label} item={item} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
