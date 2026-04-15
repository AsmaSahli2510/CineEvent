import React from "react";

export default function MovieAIFloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-accent text-charcoal shadow-2xl border border-accent/40 hover:scale-110 hover:shadow-accent/30 transition-all flex items-center justify-center group"
      title="Movie Recommendations AI">
      <span className="material-symbols-outlined text-[28px] group-hover:scale-125 transition-transform">
        auto_awesome
      </span>
      
      {/* Optional pulsing indicator */}
      <div className="absolute inset-0 rounded-full border border-accent/50 animate-pulse"></div>
    </button>
  );
}
