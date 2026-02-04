"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isNewUser) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Գրանցման սխալ: " + error.message);
      else alert("Հաջողությամբ գրանցվեցիք: Հաստատեք էլ. փոստը:");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Մուտքի սխալ: " + error.message);
      else window.location.assign("/"); 
      
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">TaskFlow</h1>
        <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">
          {isNewUser ? "Join our community" : "Welcome back"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-slate-200 mt-4 disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : isNewUser ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsNewUser(!isNewUser)}
          className="text-slate-500 text-xs font-bold hover:text-indigo-600 transition-colors"
        >
          {isNewUser ? "ALREADY HAVE AN ACCOUNT? SIGN IN" : "NEW HERE? CREATE AN ACCOUNT"}
        </button>
      </div>
    </div>
  );
}