import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-deep text-white py-14">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-11">
          <div>
            <div className="font-serif text-xl tracking-wider text-white mb-3">
              Luxe<span className="text-gold">Nest</span> Realty
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-[260px]">
              Luxury real estate in Beverly Hills, Scottsdale, and Austin. We match buyers with homes — not just listings.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-3.5 font-medium">Navigate</div>
            <div className="flex flex-col gap-2">
              <Link href="/#tour" className="text-sm text-white/60 hover:text-gold transition-all">Virtual Tour</Link>
              <Link href="/properties" className="text-sm text-white/60 hover:text-gold transition-all">Properties</Link>
              <Link href="/#ai-match" className="text-sm text-white/60 hover:text-gold transition-all">AI Match</Link>
              <Link href="/#mortgage" className="text-sm text-white/60 hover:text-gold transition-all">Calculator</Link>
              <Link href="/#agent" className="text-sm text-white/60 hover:text-gold transition-all">Agent</Link>
            </div>

          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-3.5 font-medium">Contact</div>
            <div className="flex flex-col gap-2">
              <Link href="https://wa.me/1234567890" target="_blank" className="text-sm text-white/60 hover:text-gold transition-all">WhatsApp James</Link>
              <Link href="mailto:james@luxenest.com" className="text-sm text-white/60 hover:text-gold transition-all">Email Agent</Link>
              <Link href="#book" className="text-sm text-white/60 hover:text-gold transition-all">Book Viewing</Link>
              <Link href="#" className="text-sm text-white/60 hover:text-gold transition-all">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-2">
          <span className="text-xs text-white/30">© 2026 LuxeNest Realty. All rights reserved.</span>
          <span className="text-[11px] text-gold tracking-wider">Built by GOLMEDIA ✦</span>
        </div>
      </div>
    </footer>
  );
}
