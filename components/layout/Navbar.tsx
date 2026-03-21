"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
 // Native scroll progress replaced HorizontalScrollContainer dependency

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      // Native progress calculation
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledProgress = height > 0 ? (winScroll / height) * 100 : 0;
      setProgress(scrolledProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] backdrop-blur-xl bg-nav-bg border-b ${scrolled ? "border-nav-border" : "border-transparent"} transition-all duration-300`}
      style={{
        height: scrolled ? "60px" : "72px",
      }}
    >
      {/* Gold scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-gold transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <div
        className="flex items-center justify-between max-w-[1160px] mx-auto px-6 h-full"
      >
        <Link
          href="/"
          className="font-serif text-xl tracking-wider text-white transition-all"
          style={{ fontSize: scrolled ? "1.1rem" : "1.25rem" }}
        >
          Luxe<span className="text-gold">Nest</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-7 list-none">
          {[
            { href: "/#tour", label: "Virtual Tour" },
            { href: "/properties", label: "Properties" },
            { href: "/#ai-match", label: "AI Match" },
            { href: "/#mortgage", label: "Calculator" },
            { href: "/#agent", label: "Agent" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative text-[11px] uppercase tracking-widest text-nav-link font-medium hover:text-white transition-all group"
              >
                {link.label}
                {/* Animated gold underline */}
                <span className="absolute -bottom-0.5 left-0 h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="https://wa.me/1234567890?text=Hi%2C%20I%20found%20LuxeNest%20and%20want%20to%20enquire"
            target="_blank"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd5c] text-white px-4 py-2 rounded-r font-sans text-[11px] uppercase tracking-wider font-medium transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </Link>
          <button className="bg-gold hover:bg-gold-dk text-white px-4 py-2 rounded-r font-sans text-[11px] uppercase tracking-widest font-medium transition-all">
            Book Viewing
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[72px] bg-bg z-[199] p-6 flex flex-col md:hidden animate-fadeIn border-b border-white/5">
          {[
            { href: "#tour", label: "Virtual Tour" },
            { href: "#listings", label: "Properties" },
            { href: "#ai-match", label: "AI Match" },
            { href: "#neighborhood", label: "Neighborhood" },
            { href: "#mortgage", label: "Calculator" },
            { href: "#agent", label: "Agent" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-4 text-base border-b border-white/10 text-white/80"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2.5 mt-6">
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              className="text-center bg-[#25D366] text-white py-3 rounded-rl font-medium"
            >
              WhatsApp the Agent
            </Link>
            <button className="text-center bg-bg-deep text-white border border-white/20 py-3 rounded-rl font-medium">
              Book a Viewing
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
