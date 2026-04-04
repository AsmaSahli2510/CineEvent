import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const cardContent = (
    <div className="group relative overflow-hidden border border-white/10 bg-[#10131b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
      {/* Top Badges */}
      <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2">
        {event.badge && (
          <span className="border border-accent/40 bg-accent/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent backdrop-blur-sm">
            {event.badge}
          </span>
        )}
        <span className="border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm ml-auto">
          Cinema
        </span>
      </div>

      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-background-dark overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/80">
            Poster unavailable
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,12,0.95)_0%,rgba(6,8,12,0.4)_40%,rgba(6,8,12,0)_75%)]" />

        {/* Content at Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">event</span>
              {event.date}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 flex items-center gap-1 line-clamp-1">
              <span className="material-symbols-outlined text-xs">
                location_on
              </span>
              {event.location}
            </p>
          </div>

          {/* Price & Button */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm font-black text-accent">
              {event.price}
            </span>
            <button
              type="button"
              className="flex-1 border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-accent/40">
              See details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (event.id) {
    return <Link to={`/events/${event.id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
