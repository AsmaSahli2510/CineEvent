import React from "react";
import { Link, useParams } from "react-router-dom";
import { eventById } from "../data/events";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const event = eventById[eventId];

  if (!event) {
    return (
      <main className="mx-auto max-w-[1440px] px-6 py-20 md:px-20">
        <h2 className="mb-4 text-3xl font-black">Event not found</h2>
        <p className="mb-8 text-white/60">This event does not exist anymore.</p>
        <Link
          className="rounded-xl bg-accent px-6 py-3 font-bold text-charcoal"
          to="/events">
          Back to Events
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="h-full w-full scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-background-dark" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-16 md:px-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex gap-3">
              <span className="rounded-full border border-accent/30 bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                {event.category}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <span className="material-symbols-outlined text-[14px]">
                  volunteer_activism
                </span>
                {event.secondaryTag}
              </span>
            </div>

            <h2 className="mb-6 text-5xl font-black leading-[0.9] md:text-7xl">
              {event.heroTitle}
            </h2>

            <div className="mb-10 flex flex-wrap items-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">
                  calendar_month
                </span>
                <div>
                  <p className="text-[10px] uppercase opacity-60">
                    Date & Time
                  </p>
                  <p className="font-bold">{event.fullDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">
                  location_on
                </span>
                <div>
                  <p className="text-[10px] uppercase opacity-60">Location</p>
                  <p className="font-bold text-white">{event.fullLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">
                  payments
                </span>
                <div>
                  <p className="text-[10px] uppercase opacity-60">Price</p>
                  <p className="font-bold text-accent">{event.fullPrice}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                className="flex items-center gap-3 rounded-xl bg-primary px-10 py-4 font-black text-white shadow-2xl shadow-primary/40 transition-all hover:scale-105"
                to={`/events/${event.id}/reserve`}>
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                BOOK NOW
              </Link>
              <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-bold transition-all hover:bg-white/10">
                <span className="material-symbols-outlined">favorite</span>
                ADD TO FAVORITES
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="space-y-16 lg:col-span-2">
            <div>
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-black">
                <span className="h-[2px] w-8 bg-accent" />
                About the Event
              </h3>
              <p className="mb-6 text-lg font-light leading-relaxed text-white/70">
                {event.about[0]}
              </p>
              <p className="text-lg font-light leading-relaxed text-white/70">
                {event.about[1]}
              </p>
            </div>

            <div>
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-black">
                <span className="h-[2px] w-8 bg-accent" />
                Gallery & Experience
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {event.gallery.map((img, index) => (
                  <div
                    className={`group relative cursor-pointer overflow-hidden rounded-xl aspect-square ${index === 1 ? "md:col-span-2 md:row-span-2" : ""}`}
                    key={`${event.id}-${index}`}>
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-10 flex items-center gap-3 text-2xl font-black">
                <span className="h-[2px] w-8 bg-accent" />
                Community Reflections
              </h3>
              <div className="space-y-8">
                {event.reviews.map((review, index) => (
                  <div
                    className={`${index < event.reviews.length - 1 ? "border-b border-white/5 pb-8" : ""} flex items-start gap-6`}
                    key={review.name}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/20 font-bold text-primary">
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="font-bold text-accent">
                          {review.name}
                        </span>
                        <span className="text-xs text-white/40">
                          • {review.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">
                        {review.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="absolute right-0 top-0 p-4">
                <span className="material-symbols-outlined rotate-12 text-6xl text-accent/20 transition-transform duration-500">
                  heart_check
                </span>
              </div>
              <h4 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <span className="material-symbols-outlined text-sm">
                  favorite
                </span>
                Cinema for a Cause
              </h4>
              <p className="mb-8 text-sm text-white/60">
                This event supports film preservation initiatives. A portion of
                each ticket funds cinema heritage projects.
              </p>
              <div className="rounded-xl border border-white/5 bg-charcoal/50 p-6 text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-tighter text-white/40">
                  Total Funds Collected
                </p>
                <p className="text-4xl font-black text-white">$42,850.00</p>
                <div className="relative mt-6 h-2 w-full rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-primary" />
                </div>
                <p className="mt-4 text-[10px] font-bold text-accent">
                  75% of monthly goal reached
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-accent/20 bg-white/5 p-8 backdrop-blur-xl">
              <h4 className="mb-6 text-lg font-bold">Venue Details</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-accent">
                    map
                  </span>
                  <div>
                    <p className="text-sm font-bold">{event.fullLocation}</p>
                    <p className="text-xs text-white/40">
                      {event.venueAddress}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-accent">
                    chair
                  </span>
                  <div>
                    <p className="text-sm font-bold">Luxury Seating</p>
                    <p className="text-xs text-white/40">
                      Reclining seats with premium table service
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-accent">
                    wine_bar
                  </span>
                  <div>
                    <p className="text-sm font-bold">Dress Code</p>
                    <p className="text-xs text-white/40">
                      Elegant Evening / Themed optional
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
