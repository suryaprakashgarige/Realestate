"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export let scrollProgress = 0;

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
}

export default function HorizontalScrollContainer({ children }: HorizontalScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(() => {
    if (isMobile) return;
    const slides = slidesRef.current;
    if (!slides) return;

    const totalWidth = slides.scrollWidth;
    const viewportWidth = window.innerWidth;
    const amountToScroll = totalWidth - viewportWidth;

    gsap.to(slides, {
      x: -amountToScroll,
      ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgress = self.progress;
          },
        },
      });
  }, { scope: containerRef });

  if (isMobile) {
    return (
      <div className="flex flex-col gap-0 overflow-hidden bg-bg w-full">
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-bg">
      <div 
        ref={slidesRef} 
        className="flex w-fit h-screen items-center"
      >
        {children}
      </div>
    </div>
  );
}
