import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import { getEvents } from "../../api/eventApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Transform backend event data to EventCard format
const transformEventData = (backendEvent) => {
  const API_URL = API_BASE_URL.replace("/api", "");

  // Get title based on event type
  const title =
    backendEvent.eventType === "festival"
      ? backendEvent.festivalDetails?.festivalName ||
        backendEvent.movieDetails?.title ||
        "Untitled Event"
      : backendEvent.movieDetails?.title || "Untitled Event";

  // Get poster image
  let image =
    backendEvent.movieDetails?.posterUrl ||
    backendEvent.movieDetails?.posterDataUrl ||
    backendEvent.festivalDetails?.posterUrl ||
    backendEvent.festivalDetails?.posterDataUrl ||
    "";

  if (image && !image.startsWith("http") && !image.startsWith("data:")) {
    image = image.startsWith("/")
      ? `${API_URL}${image}`
      : `${API_URL}/${image}`;
  }

  // Format price
  const priceNum = backendEvent.pricingDetails?.isFreeEvent
    ? 0
    : backendEvent.pricingDetails?.singlePrice || backendEvent.price || 0;
  const price =
    priceNum === 0
      ? "Free"
      : `${Number(priceNum).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} TND`;

  // Format date and time
  const eventDate = backendEvent.date ? new Date(backendEvent.date) : null;
  let formattedDate = "Date TBA";
  if (eventDate) {
    const month = eventDate.toLocaleDateString("en-US", { month: "short" });
    const day = eventDate.getDate();
    const time = backendEvent.startTime || "";
    formattedDate = time ? `${month} ${day} • ${time}` : `${month} ${day}`;
  }

  // Get location
  const location =
    backendEvent.venueDetails?.venueTemplateName ||
    backendEvent.cinema ||
    backendEvent.venueDetails?.location ||
    "Location TBA";

  return {
    id: backendEvent._id,
    title: title,
    image: image || undefined,
    price: price,
    date: formattedDate,
    location: location,
    badge: backendEvent.charity?.isCharityEvent ? "Charity Event" : undefined,
  };
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getEvents({ status: "published", limit: 100 });
        const publishedEvents = Array.isArray(result?.events)
          ? result.events.map(transformEventData)
          : [];
        setEvents(publishedEvents);
        setFilteredEvents(publishedEvents);
      } catch (err) {
        setError(err.message || "Failed to load events");
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedEvents();
  }, []);

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
              <span>TND 0</span>
              <span>TND 500+</span>
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
              {error
                ? "Failed to load events"
                : loading
                  ? "Loading events..."
                  : `Showing ${filteredEvents.length} published events`}
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">Loading events...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">No published events found</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredEvents.map((event) => (
                  <EventCard event={event} key={event.id} />
                ))}
              </div>
            )}
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
