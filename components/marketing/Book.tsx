"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Book() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [interest, setInterest] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [apiError, setApiError]         = useState("");

  const slots = ["Mon 10am", "Tue 2pm", "Wed 11am", "Thu 4pm", "Fri 9am", "Sat 10am"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setApiError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          property_interest: interest.trim() || null,
          preferred_slot: selectedSlot || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setApiError("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section bg-bg-surf" id="book">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-18 items-start">

          <div>
            <div className="eyebrow mb-3">Schedule a Visit</div>
            <h2 className="display text-4xl md:text-5xl text-text leading-none mb-3">
              Book Your<br />
              <em className="text-gold italic font-light">Private Viewing</em>
            </h2>
            <div className="gold-rule" />
            <p className="body-muted mb-8 leading-relaxed">
              No phone tag. No waiting. Pick a slot and James confirms within the hour via WhatsApp.
            </p>

            {!isSubmitted ? (
              <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>

                {apiError && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
                    {apiError}
                  </div>
                )}

                <input
                  className="w-full px-5 py-4 border border-card-border rounded-rl text-sm font-sans text-white bg-white/5 outline-none focus:border-gold focus:shadow-[0_0_0_4px_rgba(192,192,192,0.1)] transition-all placeholder:text-white/20"
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="w-full px-5 py-4 border border-card-border rounded-rl text-sm font-sans text-white bg-white/5 outline-none focus:border-gold focus:shadow-[0_0_0_4px_rgba(192,192,192,0.1)] transition-all placeholder:text-white/20"
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="w-full px-5 py-4 border border-card-border rounded-rl text-sm font-sans text-white bg-white/5 outline-none focus:border-gold focus:shadow-[0_0_0_4px_rgba(192,192,192,0.1)] transition-all placeholder:text-white/20"
                  type="tel"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <input
                  className="w-full px-5 py-4 border border-card-border rounded-rl text-sm font-sans text-white bg-white/5 outline-none focus:border-gold focus:shadow-[0_0_0_4px_rgba(192,192,192,0.1)] transition-all placeholder:text-white/20"
                  type="text"
                  placeholder="Property of interest (optional)"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />

                <div>
                  <span className="text-[10px] tracking-wider uppercase text-muted mb-2 block font-medium">
                    Preferred Day & Time
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 border rounded-lg text-[11px] text-center cursor-pointer transition-all font-sans ${selectedSlot === slot ? "border-gold bg-gold text-bg-deep font-bold" : "border-white/10 text-white/40 bg-white/5 hover:border-gold/50 hover:text-white"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-gold hover:bg-white disabled:opacity-50 text-bg-deep py-4.5 rounded-rl font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-sh"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Private Viewing"
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-13"
              >
                <div className="text-4xl text-gold mb-3.5">✦</div>
                <h3 className="font-serif text-3xl font-light text-text mb-2.5">
                  You&apos;re Booked, {name}
                </h3>
                <p className="text-[15px] text-muted leading-relaxed max-w-[300px] mx-auto mb-6">
                  James will confirm your viewing via WhatsApp within the hour.
                </p>
                <Link
                  href={`https://wa.me/1234567890?text=Hi%20James%2C%20I%20just%20booked%20a%20viewing.%20My%20name%20is%20${encodeURIComponent(name)}${interest ? `%20and%20I%27m%20interested%20in%20${encodeURIComponent(interest)}` : ""}.`}
                  target="_blank"
                  className="inline-block bg-gold hover:bg-gold-dk text-white px-9 py-3.5 rounded-rl font-sans text-xs uppercase tracking-widest font-medium transition-all"
                >
                  Open WhatsApp
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right: Info panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-bg-deep rounded-rxl p-9 text-white">
              <div className="text-[10px] tracking-wider uppercase text-white/35 mb-2.5 font-medium">
                What to expect
              </div>
              <div className="font-serif text-3xl font-light leading-none mb-3">
                We Respect<br />Your Time
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
                Every viewing is private, prepared, and personalised. We send a property
                brief and virtual tour link 24 hours before.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Confirmed within 1 hour via WhatsApp",
                  "Property brief emailed 24hrs before",
                  "Virtual tour link sent to your phone",
                  "No pressure — just a conversation",
                ].map((promise, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <div className="w-4 h-4 border border-gold rounded-full bg-gold/10 flex-shrink-0" />
                    <span>{promise}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border border-card-border rounded-rl bg-bg-surf/50 backdrop-blur-sm flex items-center gap-4.5">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&q=80"
                alt="James"
                className="w-14 h-14 rounded-full object-cover flex-shrink-0 shadow-lg border border-white/10"
              />
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-white">James Whitmore</div>
                <div className="text-xs text-white/40 font-light">Responds within 30 minutes</div>
                <div className="text-[10px] text-[#25D366] font-semibold mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                  Available Now
                </div>
              </div>
              <Link
                href="https://wa.me/1234567890"
                target="_blank"
                className="bg-gold hover:bg-white text-bg-deep px-5 py-3 rounded font-sans text-[11px] uppercase tracking-widest font-bold transition-all shadow-sh"
              >
                WhatsApp
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
