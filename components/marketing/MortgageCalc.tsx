"use client";

import { useState, useEffect } from "react";

export default function MortgageCalc() {
  const [price, setPrice] = useState(1200000);
  const [downPercent, setDownPercent] = useState(20);
  const [term, setTerm] = useState(30);
  const [rate, setRate] = useState(6.8);

  const [monthly, setMonthly] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [downAmount, setDownAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const loan = price * (1 - downPercent / 100);
    const mr = rate / 100 / 12;
    const n = term * 12;
    
    let mo = 0;
    if (mr === 0) {
      mo = loan / n;
    } else {
      mo = (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    }
    
    const total = mo * n;

    setLoanAmount(loan);
    setDownAmount(price * (downPercent / 100));
    setMonthly(mo);
    setTotalInterest(total - loan);
    setTotalCost(total);
  }, [price, downPercent, term, rate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="section bg-bg-off" id="mortgage">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-18 items-start">
          <div>
            <div className="eyebrow mb-3">Instant Estimate</div>
            <h2 className="display text-4xl md:text-5xl text-text leading-none mb-3">
              Mortgage<br />
              <em className="text-gold italic font-light">Calculator</em>
            </h2>
            <div className="gold-rule" />
            <p className="body-muted mb-9">
              Move the sliders. See your monthly payment update live — before you make a single call.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">Property Price</label>
                  <span className="font-serif text-[19px] text-text font-light">{formatCurrency(price)}</span>
                </div>
                <input 
                  type="range" 
                  min={200000} 
                  max={5000000} 
                  step={50000} 
                  value={price} 
                  onChange={(e) => setPrice(+e.target.value)}
                  className="w-full h-0.5 bg-card-border rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">Down Payment</label>
                  <span className="font-serif text-[19px] text-text font-light">{downPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min={5} 
                  max={50} 
                  value={downPercent} 
                  onChange={(e) => setDownPercent(+e.target.value)}
                  className="w-full h-0.5 bg-card-border rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">Loan Term</label>
                  <span className="font-serif text-[19px] text-text font-light">{term} yrs</span>
                </div>
                <input 
                  type="range" 
                  min={5} 
                  max={30} 
                  step={5} 
                  value={term} 
                  onChange={(e) => setTerm(+e.target.value)}
                  className="w-full h-0.5 bg-card-border rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] tracking-wider uppercase text-muted font-medium">Interest Rate</label>
                  <span className="font-serif text-[19px] text-text font-light">{rate.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min={3} 
                  max={12} 
                  step={0.1} 
                  value={rate} 
                  onChange={(e) => setRate(+e.target.value)}
                  className="w-full h-0.5 bg-card-border rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card-bg border border-card-border rounded-rxl p-10 sticky top-24 shadow-shl">
              <div className="text-[10px] tracking-widest uppercase text-gold mb-2 font-semibold">Monthly Payment</div>
              <div className="font-serif text-6xl text-white font-light leading-none mb-2">
                {formatCurrency(monthly)}<span className="text-xl text-white/30 ml-2">/mo</span>
              </div>
              <div className="text-xs text-white/40 mb-8 font-light">Principal + Interest · {term}yr fixed</div>
              
              <div className="border-t border-card-border2 pt-6 flex flex-col gap-3.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Loan Amount</span>
                  <span className="font-medium text-white">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Down Payment</span>
                  <span className="font-medium text-white">{formatCurrency(downAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Interest</span>
                  <span className="font-medium text-white">{formatCurrency(totalInterest)}</span>
                </div>
              </div>

              <div className="border-t border-card-border2 mt-6 pt-5 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Total Cost</span>
                <span className="text-xl font-medium text-gold">{formatCurrency(totalCost)}</span>
              </div>

              <button className="w-full mt-8 bg-gold hover:bg-white text-bg-deep py-4.5 rounded-rl font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-sh">
                Discuss Financing
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
