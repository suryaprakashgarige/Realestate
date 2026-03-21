"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Booking, Property } from "@/types";
import { Loader2 } from "lucide-react";

type Tab = "bookings" | "listings" | "settings";

export default function AdminDashboardPage() {
  const [tab, setTab]             = useState<Tab>("bookings");
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]     = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Auth guard — server-verified session
  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase is not configured.");
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, pRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/properties"),
        ]);
        const [bData, pData] = await Promise.all([bRes.json(), pRes.json()]);
        setBookings(Array.isArray(bData) ? bData : []);
        setProperties(Array.isArray(pData) ? pData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authChecked]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-bg-deep text-white p-6 flex flex-col justify-between md:min-h-screen">
        <div>
          <div className="font-serif text-xl tracking-wider mb-8">
            LuxeNest<span className="text-gold">.</span> Admin
          </div>
          <nav className="flex flex-col gap-1.5 text-sm">
            {(["bookings", "listings", "settings"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-left px-4 py-2.5 rounded capitalize transition-all ${tab === t ? "bg-white/10 text-gold font-medium" : "hover:bg-white/5 text-white/70"}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-left px-4 py-2 text-xs text-white/40 hover:text-white transition-all"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 bg-bg-off">

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <>
            <div className="flex justify-between items-baseline mb-6 border-b border-card-border pb-4">
              <h1 className="font-serif text-3xl font-light text-text">Manage Bookings</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Bookings" value={String(bookings.length)} />
              <StatCard label="Active Listings" value={String(properties.length)} />
              <StatCard label="System Status" value="● Online" valueClass="text-emerald-600 text-xs font-medium mt-1" />
            </div>
            <div className="bg-white border border-card-border rounded-rxl shadow-sh overflow-hidden">
              {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-5 h-5 text-gold animate-spin" /></div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-muted text-sm">No bookings yet.</div>
              ) : (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-bg text-text text-[11px] uppercase tracking-wider font-semibold border-b border-card-border">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Slot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border2">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-bg-surf/30 transition-colors">
                        <td className="p-4 font-medium text-text">{b.name}</td>
                        <td className="p-4 text-muted">{b.email}</td>
                        <td className="p-4 text-muted">{b.phone}</td>
                        <td className="p-4 text-text">{b.property_interest ?? "General"}</td>
                        <td className="p-4">
                          <span className="bg-gold/10 text-gold text-[11px] px-2 py-0.5 rounded-full font-medium">
                            {b.preferred_slot ?? "Any"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Listings Tab */}
        {tab === "listings" && (
          <>
            <div className="flex justify-between items-baseline mb-6 border-b border-card-border pb-4">
              <h1 className="font-serif text-3xl font-light text-text">Manage Listings</h1>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-gold animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((p) => (
                  <div key={p.id} className="bg-white border border-card-border rounded-rl overflow-hidden">
                    <img src={p.images?.[0] ?? ""} alt={p.title} className="w-full aspect-video object-cover" />
                    <div className="p-4">
                      <div className="font-serif text-lg text-text">${p.price.toLocaleString()}</div>
                      <div className="text-xs text-muted mt-0.5">{p.title} · {p.city}</div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 border border-card-border rounded py-1.5 text-[11px] text-muted hover:border-gold hover:text-gold transition-all">Edit</button>
                        <button className="flex-1 border border-red-200 rounded py-1.5 text-[11px] text-red-400 hover:bg-red-50 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <>
            <div className="flex justify-between items-baseline mb-6 border-b border-card-border pb-4">
              <h1 className="font-serif text-3xl font-light text-text">Settings</h1>
            </div>
            <div className="bg-white border border-card-border rounded-rxl p-6 max-w-[480px]">
              <div className="text-sm font-medium text-text mb-4">Agent Contact Details</div>
              <div className="flex flex-col gap-3">
                <input className="w-full px-4 py-3 border border-card-border rounded text-sm outline-none focus:border-gold" placeholder="Agent WhatsApp Number" defaultValue="1234567890" />
                <input className="w-full px-4 py-3 border border-card-border rounded text-sm outline-none focus:border-gold" placeholder="Agent Email" defaultValue="james@luxenest.com" />
                <button className="bg-gold hover:bg-gold-dk text-white py-3 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          </>
        )}

      </section>
    </main>
  );
}

function StatCard({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-white p-5 border border-card-border rounded-rl shadow-sm">
      <div className="text-[10px] tracking-wider uppercase text-muted mb-1 font-medium">{label}</div>
      <div className={valueClass ?? "font-serif text-3xl font-light text-text"}>{value}</div>
    </div>
  );
}
