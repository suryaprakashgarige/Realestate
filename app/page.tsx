/**
 * app/page.tsx — LuxeNest Upgraded
 *
 * CHANGES FROM ORIGINAL:
 * 1. Replaced HorizontalScrollContainer + Hero with CinematicScrollHero (Draftly effect)
 * 2. Listings is now a normal vertical section (makes UX sense)
 * 3. Lenis smooth scroll initialized here (it was installed but unused)
 * 4. SmoothScrollProvider wraps everything
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CinematicScrollHero from "@/components/marketing/CinematicScrollHero";
import VirtualTour from "@/components/marketing/VirtualTour";
import Listings from "@/components/marketing/Listings";
import AiMatch from "@/components/marketing/AiMatch";
import Neighborhood from "@/components/marketing/Neighborhood";
import MortgageCalc from "@/components/marketing/MortgageCalc";
import Agent from "@/components/marketing/Agent";
import Reviews from "@/components/marketing/Reviews";
import Book from "@/components/marketing/Book";
import MapSearch from "@/components/marketing/MapSearch";
import LenisProvider from "@/components/layout/LenisProvider";

export default function Home() {
  return (
    <LenisProvider>
      <main className="min-h-screen bg-bg">
        {/* Navbar sits above the cinematic scroll hero */}
        <Navbar />

        {/* ── CINEMATIC SCROLL HERO ──
            This is the Draftly effect: a full-viewport scroll-driven video.
            The section is 300vh tall — user scrolls through the video,
            then naturally continues into the rest of the page.
        */}
        <CinematicScrollHero />

        {/* ── REST OF PAGE (normal vertical scroll) ── */}
        <Listings />
        <MapSearch />
        <VirtualTour propertyId="1" />
        <AiMatch />
        <Neighborhood />
        <MortgageCalc />
        <Agent />
        <Reviews />
        <Book />
        <Footer />
      </main>
    </LenisProvider>
  );
}
