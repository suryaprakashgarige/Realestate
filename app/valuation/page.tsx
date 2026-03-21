"use client";

import { useState } from "react";
import { Calculator, ArrowRight, Home, TrendingUp, Shield } from "lucide-react";

export default function ValuationPage() {
  const [address, setAddress] = useState("");
  const [beds, setBeds] = useState("3");
  const [baths, setBaths] = useState("2");
  const [sqft, setSqft] = useState("");
  const [calculating, setCalculating] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setTimeout(() => {
      const base = 400 * (parseInt(sqft) || 2000);
      const bedValue = parseInt(beds) * 50000;
      setEstimate(base + bedValue + 150000); // Mock Algorithm
      setCalculating(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-bg-deep text-white font-sans selection:bg-gold selection:text-bg-deep">
      {/* Navbar spacer */}
      <div className="h-20" />

      <main className="max-w-[1160px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="eyebrow mb-3 justify-center">Instant Valuation</div>
          <h1 className="display text-4xl md:text-6xl text-text leading-none mb-4">
            What is your<br />
            <em className="text-gold italic font-light">home worth?</em>
          </h1>
          <p className="body-muted max-w-lg mx-auto text-sm">
            Enter your property details below. Our luxury pricing engine analyzes 
            recent sales, local micro-trends, and market velocity to give you a real value.
          </p>
          <div className="gold-rule mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-7 bg-card-bg border border-white/5 rounded-rxl p-8 shadow-2xl">
            <h3 className="font-serif text-2xl mb-6">Property Details</h3>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">Street Address</label>
                <input
                  type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Luxury Ln, Beverly Hills, CA"
                  className="w-full bg-bg-surf border border-white/10 rounded px-4 py-3 text-sm focus:border-gold outline-none transition-colors text-white placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">Beds</label>
                  <select
                    value={beds} onChange={(e) => setBeds(e.target.value)}
                    className="w-full bg-bg-surf border border-white/10 rounded px-4 py-3 text-sm focus:border-gold outline-none text-white cursor-pointer"
                  >
                    {[2,3,4,5,6].map((n) => <option key={n} value={n} className="bg-bg-deep">{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">Baths</label>
                  <select
                    value={baths} onChange={(e) => setBaths(e.target.value)}
                    className="w-full bg-bg-surf border border-white/10 rounded px-4 py-3 text-sm focus:border-gold outline-none text-white cursor-pointer"
                  >
                    {[1,2,3,4,5].map((n) => <option key={n} value={n} className="bg-bg-deep">{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-2">SqFt</label>
                  <input
                    type="number" required value={sqft} onChange={(e) => setSqft(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-bg-surf border border-white/10 rounded px-4 py-3 text-sm focus:border-gold outline-none text-white placeholder:text-white/20"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={calculating}
                className="w-full bg-gold text-bg-deep font-semibold text-xs uppercase tracking-widest py-4 rounded hover:bg-white hover:text-bg-deep transition-all flex items-center justify-center gap-2 shadow-sh cursor-pointer disabled:opacity-50"
              >
                {calculating ? "Analyzing Market Data..." : "Calculate Home Value"}
                {!calculating && <ArrowRight size={14} />}
              </button>
            </form>

            {estimate && (
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <div className="text-[10px] uppercase tracking-wider text-gold mb-1">Estimated Value</div>
                <div className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-4">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(estimate)}
                </div>
                <p className="text-xs text-white/40 max-w-sm mx-auto mb-6">
                  This estimation is based on current market micro-trends and addresses near your location.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="border border-white/10 hover:bg-white/5 text-white px-5 py-2.5 rounded text-[11px] uppercase tracking-wider">
                    Download Report
                  </button>
                  <button className="bg-white text-bg-deep px-5 py-2.5 rounded text-[11px] uppercase tracking-wider font-semibold">
                    Speak to Agent
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 space-y-8 mt-10 lg:mt-0">
            {[
              { icon: Home, title: "Precision Valuation", desc: "We don't just use algorithms. We analyze premium finishes, unique layouts, and lot layouts missing on Zillow." },
              { icon: TrendingUp, title: "Capital Growth Strategy", desc: "Gain insights into your home's equity breakdown and potential appreciation maps over the next 18 months." },
              { icon: Shield, title: "Verified Private Access", desc: "Your appraisal remains 100% private. No spam agents, no public dashboard entries. Pure asset analysis." }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 border border-gold/30 rounded flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-white mb-2">{title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
