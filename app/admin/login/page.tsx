"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-bg-deep flex items-center justify-center px-6">
      <div className="w-full max-w-[360px] bg-white rounded-rxl p-8 border border-card-border shadow-sh">
        <div className="text-center mb-6">
          <Link href="/" className="font-serif text-xl text-text tracking-wider hover:text-gold transition-colors">
            LuxeNest<span className="text-gold">.</span>
          </Link>
          <h1 className="font-serif text-2xl font-light text-text mt-3">Admin Portal</h1>
          <p className="text-xs text-muted mt-0.5">Sign in to manage bookings and listings</p>
        </div>

        {error && (
          <div className="text-red-600 text-xs bg-red-50 border border-red-200 p-2.5 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-card-border rounded text-sm outline-none focus:border-gold transition-all"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-card-border rounded text-sm outline-none focus:border-gold transition-all"
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bg-deep hover:bg-bg-deep/90 disabled:opacity-60 text-white py-3.5 rounded font-sans text-xs uppercase tracking-widest font-medium transition-all mt-1 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
