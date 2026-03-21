"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function WebGLPortal() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setLoading(false);
      return;
    }

    // Fake loading progress
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[300] bg-bg flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Intense Glitch/Displacement Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#C0C0C0_0%,_transparent_70%)] animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scanline shadow-[0_0_20px_white]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="w-12 h-[1px] bg-gold" />
              <div className="font-serif text-sm tracking-[0.4em] uppercase text-white font-light">
                Initializing Luxury
              </div>
              <div className="w-12 h-[1px] bg-gold" />
            </motion.div>

            <div className="relative overflow-hidden mb-4">
              <motion.h1 
                className="font-serif text-7xl md:text-9xl text-white font-light leading-none tracking-tighter"
              >
                LUXENEST
              </motion.h1>
              <motion.div 
                initial={{ transform: "translateX(-100%)" }}
                animate={{ transform: "translateX(100%)" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>

            <div className="w-[300px] h-[2px] bg-white/5 relative overflow-hidden mt-8">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <div className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 font-bold">
               System Loading {percent}%
            </div>
          </div>
          
          <div className="absolute bottom-12 left-12 flex flex-col gap-2">
             <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Aeronautical Grade Design</div>
             <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">© 2026 SOLVREX AGENCY</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
