import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const cardContent = (
    <>
      <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl">
        {event.badge ? (
          <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            {event.badge}
          </div>
        ) : null}
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${event.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h4 className="text-xl font-bold transition-colors group-hover:text-primary dark:group-hover:text-accent">
            {event.title}
          </h4>
          <span className="font-black text-primary dark:text-accent">
            {event.price}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-charcoal/60 dark:text-white/60">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {event.location}
        </div>

        <div className="flex items-center gap-2 text-sm text-charcoal/60 dark:text-white/60">
          <span className="material-symbols-outlined text-sm">event</span>
          {event.date}
        </div>
      </div>
    </>
  );

  if (event.id) {
    return (
      <Link className="group block cursor-pointer" to={`/events/${event.id}`}>
        {cardContent}
      </Link>
    );
  }

  return <div className="group cursor-pointer">{cardContent}</div>;
}
