import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEvents } from "../../api/eventApi";
import { toggleWishlist, isEventInWishlist } from "../../api/wishlistApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const transformEventData = (backendEvent) => {
  const API_URL = API_BASE_URL.replace("/api", "");

  const title =
    backendEvent.eventType === "festival"
      ? backendEvent.festivalDetails?.festivalName ||
        backendEvent.movieDetails?.title ||
        "Untitled Event"
      : backendEvent.movieDetails?.title || "Untitled Event";

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

  const priceNum = backendEvent.pricingDetails?.isFreeEvent
    ? 0
    : backendEvent.pricingDetails?.categories?.standard ||
      backendEvent.pricingDetails?.singlePrice ||
      backendEvent.price ||
      0;

  const price =
    priceNum === 0
      ? "Free"
      : `${Number(priceNum).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} TND`;

  const eventDate = backendEvent.date ? new Date(backendEvent.date) : null;
  let formattedDate = "Date TBA";

  if (eventDate) {
    const month = eventDate.toLocaleDateString("en-US", { month: "short" });
    const day = eventDate.getDate();
    const year = eventDate.getFullYear();
    const time = backendEvent.startTime || "";
    formattedDate = time
      ? `${month} ${day}, ${year} • ${time}`
      : `${month} ${day}, ${year}`;
  }

  const location =
    backendEvent.venueDetails?.venueTemplateName ||
    backendEvent.cinema ||
    backendEvent.venueDetails?.location ||
    "Location TBA";

  const rawGenre =
    backendEvent.movieDetails?.genre || backendEvent.category || "Screening";

  const genreTags = String(rawGenre)
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id: backendEvent._id,
    title,
    image: image || "",
    price,
    date: formattedDate,
    location,
    category: backendEvent.eventType === "festival" ? "Festival" : "Movie",
    genres: genreTags.length ? genreTags : ["Screening"],
    badge: backendEvent.charity?.isCharityEvent ? "Charity Event" : "",
    isFestival: backendEvent.eventType === "festival",
  };
};

function FilterSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">
        {title}
      </h3>
      {children}
    </div>
  );
}

function MovieEventCard({ event }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const hasImage = Boolean(event.image);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if event is in wishlist on mount
  useEffect(() => {
    if (currentUser && (event.id || event._id)) {
      const eventId = event.id || event._id;
      isEventInWishlist(eventId)
        .then((res) => {
          if (res.success) {
            setIsLiked(res.isInWishlist);
          }
        })
        .catch((err) => {
          console.error("Error checking wishlist:", err);
        });
    }
  }, [currentUser, event.id, event._id]);

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault?.();
    e.stopPropagation?.();

    const eventId = event.id || event._id;

    if (!eventId) {
      console.error("Event ID not found");
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      toggleWishlist(eventId)
        .then((response) => {
          if (response?.success) {
            setIsLiked(response.added);
          }
        })
        .catch((error) => {
          console.error("Error toggling wishlist:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error in handler:", error);
      setLoading(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
        {hasImage ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
            <span className="text-xs uppercase tracking-[0.3em]">
              No Poster
            </span>
          </div>
        )}

        {/* MUCH LIGHTER gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* TOP */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          <span className="rounded-full border border-white/15 bg-background-dark/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
            {event.category}
          </span>

          {/* HEART BUTTON */}
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={loading}
            className={`transition-all duration-200 ${
              isLiked
                ? "text-red-500 scale-110"
                : "text-white/80 hover:text-red-500 hover:scale-110"
            }`}
            title={
              currentUser
                ? isLiked
                  ? "Remove from wishlist"
                  : "Add to wishlist"
                : "Login to add to wishlist"
            }>
            <span className="material-symbols-outlined text-[22px]">
              {isLiked ? "favorite" : "favorite_border"}
            </span>
          </button>
        </div>

        {/* BOTTOM OVERLAY */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div
            className="
              rounded-[20px]
              border border-white/10
              bg-black/20   /* lighter */
              backdrop-blur-md
              p-3
              transition-all duration-300
              translate-y-[78%]   /* MORE HIDDEN */
              group-hover:translate-y-0
            ">
            {/* ALWAYS VISIBLE (TITLE ONLY) */}
            <h3 className="text-sm font-bold text-white">{event.title}</h3>

            {/* HIDDEN CONTENT */}
            <div className="mt-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <p className="text-xs font-medium text-accent">{event.price}</p>

              {/* GENRES */}
              <div className="mt-2 flex flex-wrap gap-2">
                {event.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/85">
                    {genre}
                  </span>
                ))}
              </div>

              {/* DETAILS */}
              <div className="mt-3 space-y-2 text-xs text-white/75">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-accent">
                    calendar_month
                  </span>
                  <span>{event.date}</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-accent">
                    location_on
                  </span>
                  <span className="line-clamp-2">{event.location}</span>
                </div>
              </div>

              <button
                onClick={handleViewDetails}
                className="mt-3 w-full rounded-xl bg-accent px-4 py-2 text-sm font-bold text-background-dark transition-transform duration-200 hover:scale-[1.02]">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

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
      } catch (err) {
        setError(err.message || "Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let list = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.genres.some((genre) => genre.toLowerCase().includes(q)),
      );
    }

    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "lowest-price") {
      list.sort((a, b) => {
        const getNumericPrice = (value) => {
          if (value === "Free") return 0;
          return Number(String(value).replace(/[^\d.]/g, "")) || 0;
        };
        return getNumericPrice(a.price) - getNumericPrice(b.price);
      });
    }

    if (sortBy === "soonest") {
      list.sort((a, b) => a.date.localeCompare(b.date));
    }

    return list;
  }, [events, search, sortBy]);

  return (
    <main className="flex min-h-[calc(100vh-180px)] flex-1 overflow-hidden bg-background-dark text-white">
      <aside className="custom-scrollbar hidden w-[300px] shrink-0 overflow-y-auto border-r border-white/10 bg-background-dark p-6 xl:block">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Discover
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Cinema Filters</h2>
          <p className="mt-2 text-sm text-white/50">
            Explore events with a stylish cinematic layout.
          </p>
        </div>

        <div className="space-y-5">
          <FilterSection title="Date Range">
            <div className="space-y-3">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  Today
                </span>
              </label>

              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                />
                <span className="text-sm text-white/70 group-hover:text-white">
                  This Weekend
                </span>
              </label>

              <input
                type="date"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-accent focus:ring-accent"
              />
            </div>
          </FilterSection>

          <FilterSection title="Location">
            <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:ring-accent">
              <option className="bg-charcoal">All Cities</option>
              <option className="bg-charcoal">New York, NY</option>
              <option className="bg-charcoal">Los Angeles, CA</option>
              <option className="bg-charcoal">Chicago, IL</option>
            </select>
          </FilterSection>

          <FilterSection title="Price Range">
            <input
              type="range"
              min="0"
              max="500"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
            />
            <div className="mt-3 flex justify-between text-xs text-white/40">
              <span>TND 0</span>
              <span>TND 500+</span>
            </div>
          </FilterSection>

          <FilterSection title="Category">
            <div className="grid gap-3">
              {[
                "Film Premiere",
                "Gala Night",
                "Independent Fest",
                "Classic Cinema",
              ].map((item, index) => (
                <label
                  key={item}
                  className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={index === 0}
                    className="h-5 w-5 rounded border-white/20 bg-white/5 text-primary focus:ring-accent"
                  />
                  <span className="text-sm text-white/70 group-hover:text-white">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-white/10 bg-background-dark/80 px-6 py-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Now Showing
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Movie Events
              </h1>
              <p className="mt-2 text-sm text-white/40">
                {error
                  ? "Failed to load events"
                  : loading
                    ? "Loading events..."
                    : `${filteredEvents.length} published events available`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies, venues..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-accent focus:ring-accent sm:w-[280px]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:ring-accent">
                <option value="recommended">Recommended</option>
                <option value="soonest">Soonest Date</option>
                <option value="lowest-price">Lowest Price</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <p className="text-white/60">Loading events...</p>
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center">
                <p className="text-lg font-semibold text-white">
                  No published events found
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Try another search or adjust your filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredEvents.map((event) => (
                <MovieEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
