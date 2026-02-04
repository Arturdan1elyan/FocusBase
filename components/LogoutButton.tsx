"use client";

import { supabase } from "@/lib/supabase";

export function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      window.location.assign("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
    >
      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-colors">
        <svg 
          className="w-4 h-4 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2.5" 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
      </div>
      <span className="uppercase tracking-wider text-[11px]">Sign Out</span>
    </button>
  );
}