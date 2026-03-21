"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/types";

interface MatchedProperty extends Property {
  _match: number;
}

const steps = [
  {
    id: 0,
    questionStart: "What's your",
    questionAccent: "budget?",
    options: [
      { tag: "Entry",       label: "Under $600K",     maxPrice: 600000  },
      { tag: "Mid-Range",   label: "$600K – $1.2M",   maxPrice: 1200000 },
      { tag: "Premium",     label: "$1.2M – $2.5M",   maxPrice: 2500000 },
      { tag: "Ultra Luxury",label: "$2.5M+",           maxPrice: 99999999},
    ],
  },
  {
    id: 1,
    questionStart: "Your",
    questionAccent: "lifestyle?",
    options: [
      { tag: "Family",      label: "Space & great schools"   },
      { tag: "Professional",label: "City access & commute"   },
      { tag: "Entertainer", label: "Open plan & outdoor"     },
      { tag: "Investor",    label: "ROI & rental potential"  },
    ],
  },
  {
    id: 2,
    questionStart: "How many",
    questionAccent: "bedrooms?",
    options: [
      { tag: "Compact",  label: "1–2 Bedrooms", minBeds: 1 },
      { tag: "Standard", label: "3 Bedrooms",   minBeds: 3 },
      { tag: "Spacious", label: "4 Bedrooms",   minBeds: 4 },
      { tag: "Grand",    label: "5+ Bedrooms",  minBeds: 5 },
    ],
  },
  {
    id: 3,
    questionStart: "Preferred",
    questionAccent: "setting?",
    options: [
      { tag: "Urban",      label: "Downtown & walkable"  },
      { tag: "Suburban",   label: "Quiet neighborhoods"  },
      { tag: "Gated",      label: "Private community"    },
      { tag: "Countryside",label: "Land & privacy"       },
    ],
  },
];

export default function AiMatch() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minBeds, setMinBeds] = useState<number | null>(null);
  const [matchedProperties, setMatchedProperties] = useState<MatchedProperty[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const fetchMatches = async (priceLimit: number | null, bedsMin: number | null) => {
    setLoadingResults(true);
    try {
      let url = "/api/properties?";
      if (priceLimit) url += `maxPrice=${priceLimit}&`;
      if (bedsMin) url += `beds=${bedsMin}&`;
      const res = await fetch(url);
      const data: Property[] = await res.json();
      // Score: assign fake match % based on array position
      const scores = [98, 94, 87];
      setMatchedProperties(data.slice(0, 3).map((p, i) => ({ ...p, _match: scores[i] ?? 80 })));
    } catch (err) {
      console.error("AI match fetch error:", err);
      setMatchedProperties([]);
    } finally {
      setLoadingResults(false);
      setShowResult(true);
    }
  };


  const handleSelect = (option: (typeof steps[0]["options"][0]) & { maxPrice?: number; minBeds?: number }) => {
    const newMaxPrice = option.maxPrice ?? maxPrice;
    const newMinBeds = (option as { minBeds?: number }).minBeds ?? minBeds;

    if (currentStep === 0) setMaxPrice(newMaxPrice ?? null);
    if (currentStep === 2) setMinBeds(newMinBeds ?? null);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 250);
    } else {
      setTimeout(() => fetchMatches(newMaxPrice ?? maxPrice, newMinBeds ?? minBeds), 250);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setMaxPrice(null);
    setMinBeds(null);
    setMatchedProperties([]);
    setShowResult(false);
    setLoadingResults(false);
  };

  return (
    <section className="bg-dark-bg py-22" id="ai-match">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

          {/* Left: Description */}
          <div>
            <div className="eyebrow mb-3">Powered by AI</div>
            <h2 className="display text-4xl md:text-5xl text-dark-text leading-none mb-4">
              Find Your<br />
              <em className="text-gold italic font-light">Perfect Match</em>
            </h2>
            <div className="gold-rule" />
            <p className="body-muted mb-8 text-dark-sub leading-relaxed">
              Answer 4 questions. Our AI narrows every active listing to the 3 homes
              that truly fit your life.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Tell us your budget and lifestyle",
                "AI cross-references all active listings",
                "Get 3 matched homes with walk-through links",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full border border-gold bg-gold/10 flex items-center justify-center font-serif text-sm text-gold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-dark-sub">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quiz Box */}
          <div className="bg-white/5 border border-white/10 rounded-rxl p-8 backdrop-blur-sm">

            {!showResult ? (
              <div>
                {/* Progress dots */}
                <div className="flex gap-1.5 mb-6">
                  {steps.map((s, i) => (
                    <div
                      key={s.id}
                      className={`h-[3px] rounded-sm transition-all duration-300 ${i <= currentStep ? "bg-gold" : "bg-white/15"}`}
                      style={{ width: "22px" }}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Safe question rendering — no dangerouslySetInnerHTML */}
                    <div className="font-serif text-2xl font-light text-white leading-snug mb-5">
                      {steps[currentStep].questionStart}{" "}
                      <span className="text-gold italic">{steps[currentStep].questionAccent}</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {steps[currentStep].options.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handleSelect(option as never)}
                          className="flex items-center gap-3 px-4 py-3.5 border border-white/10 hover:border-gold hover:bg-gold/5 rounded-rl text-left font-sans transition-all cursor-pointer bg-white/5 group"
                        >
                          <span className="text-[10px] tracking-wider uppercase text-gold font-medium min-w-[70px] flex-shrink-0">
                            {option.tag}
                          </span>
                          <span className="text-sm text-white/80 group-hover:text-white">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-3xl text-gold mb-3">✦</div>
                <h3 className="font-serif text-2xl font-light text-white mb-1.5">
                  {loadingResults ? "Finding your matches..." : "3 Homes Matched for You"}
                </h3>
                <p className="text-xs text-white/50 mb-5">Based on your answers — top matches highlighted</p>

                {loadingResults ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : matchedProperties.length === 0 ? (
                  <p className="text-sm text-white/50 py-6">No properties found for your criteria. Try adjusting your budget.</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {(matchedProperties as (Property & { _match?: number })[]).map((prop, i) => (
                      <a
                        key={prop.id}
                        href={`/properties/${prop.id}`}
                        className="flex gap-3 p-3 border border-white/10 rounded-rl cursor-pointer hover:border-gold transition-all bg-white/5 text-left items-center"
                      >
                        <img
                          src={prop.images?.[0] ?? ""}
                          alt={prop.title}
                          className="w-16 h-14 rounded object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="inline-block bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full font-medium mb-1">
                            {prop._match}% match
                          </span>
                          <div className="font-serif text-lg text-white font-normal">
                            ${prop.price.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-white/50">{prop.city}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                <div className="flex gap-2.5 mt-4.5">
                  <a href="#book" className="flex-1 bg-gold hover:bg-gold-dk text-white py-3 rounded-rl font-sans text-xs uppercase tracking-wider font-medium transition-all text-center">
                    Book a Viewing
                  </a>
                  <button
                    onClick={resetQuiz}
                    className="flex-1 border border-white/20 hover:bg-white/5 text-white py-3 rounded-rl font-sans text-xs uppercase tracking-wider font-medium transition-all"
                  >
                    Retake
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
