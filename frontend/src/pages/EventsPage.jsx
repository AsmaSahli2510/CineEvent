import React from "react";
import EventCard from "../components/EventCard";
import { events } from "../data/events";

export default function EventsPage() {
  return (
    <main className="flex min-h-[calc(100vh-180px)] flex-1 overflow-hidden bg-background-dark text-white">
      <aside className="custom-scrollbar w-80 overflow-y-auto border-r border-white/10 bg-background-dark p-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <button className="text-xs font-bold uppercase tracking-wider text-accent">
            Reset All
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
              Date Range
            </h3>
            <div className="space-y-3">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Today
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  This Weekend
                </span>
              </label>
              <div className="mt-4">
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-accent focus:ring-accent"
                  type="date"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
              Location
            </h3>
            <select className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-accent focus:ring-accent">
              <option className="bg-charcoal">All Cities</option>
              <option className="bg-charcoal">New York, NY</option>
              <option className="bg-charcoal">Los Angeles, CA</option>
              <option className="bg-charcoal">Chicago, IL</option>
            </select>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
              Price Range
            </h3>
            <input
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-accent"
              max="500"
              min="0"
              type="range"
            />
            <div className="mt-2 flex justify-between text-xs text-white/40">
              <span>$0</span>
              <span>$500+</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
              Category
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  defaultChecked
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Film Premiere
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Gala Night
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Independent Fest
                </span>
              </label>
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  type="checkbox"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Classic Cinema
                </span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold">Search Results</h2>
            <p className="text-sm text-white/40">
              Showing 128 premium events matching your criteria
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">Sort by:</span>
            <select className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-accent focus:ring-accent">
              <option>Recommended</option>
              <option>Soonest Date</option>
              <option>Lowest Price</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard event={event} key={event.title} />
              ))}
            </div>
          </div>

          <div className="relative hidden w-[450px] overflow-hidden bg-charcoal 2xl:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,192,101,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(128,0,32,0.35),transparent_45%)]" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="w-full rounded-2xl border border-white/10 bg-background-dark/70 p-6 text-center backdrop-blur">
                <span className="material-symbols-outlined mb-2 text-4xl text-accent">
                  map
                </span>
                <p className="text-sm text-white/70">
                  Interactive map area for events (Leaflet ready).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
