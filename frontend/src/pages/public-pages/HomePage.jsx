import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../api/eventApi";
import { toggleWishlist, isEventInWishlist } from "../../api/wishlistApi";
import MovieRecommendationChat from "../../components/MovieRecommendationChat";
import MovieAIFloatingButton from "../../components/MovieAIFloatingButton";
import heroImg from "../../images/upscalemedia-transformed.png";
import parisImg from "../../images/projecteur.png";

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
    : backendEvent.pricingDetails?.singlePrice || backendEvent.price || 0;

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
    rawDate: backendEvent.date ? new Date(backendEvent.date) : null,
  };
};

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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          <span className="rounded-full border border-white/15 bg-background-dark/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
            {event.category}
          </span>

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

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div
            className="
              rounded-[20px]
              border border-white/10
              bg-black/20
              backdrop-blur-md
              p-3
              transition-all duration-300
              translate-y-[78%]
              group-hover:translate-y-0
            ">
            <h3 className="text-sm font-bold text-white">{event.title}</h3>

            <div className="mt-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <p className="text-xs font-medium text-accent">{event.price}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {event.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/85">
                    {genre}
                  </span>
                ))}
              </div>

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

export default function HomePage() {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const showJoinCards = !(isAuthenticated && currentUser);
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMovieAIChatOpen, setIsMovieAIChatOpen] = useState(false);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        setLoading(true);
        const result = await getEvents({ status: "published", limit: 100 });

        const publishedEvents = Array.isArray(result?.events)
          ? result.events.map(transformEventData)
          : [];

        // Sort by date (most recent first) and limit to 6
        publishedEvents.sort(
          (a, b) => (b.rawDate?.getTime() || 0) - (a.rawDate?.getTime() || 0),
        );
        const recentEvents = publishedEvents.slice(0, 6);

        setPopularEvents(recentEvents);
      } catch (err) {
        console.error("Failed to load popular events:", err);
        setPopularEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  return (
    <>
      <main className="w-full bg-black">
        <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full bg-cover bg-center"
              data-alt="A luxurious Great Gatsby style cinema party with gold accents"
              style={{
                backgroundImage: `url(${heroImg})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          </div>

          <div className="relative z-10 max-w-4xl px-6 text-center">
            <span className="mb-6 inline-block rounded-full border border-accent px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Premium Cinema Experience
            </span>

            <h2 className="mb-6 font-serif-alt text-5xl font-black italic leading-[1.1] text-white drop-shadow-2xl md:text-7xl">
              Discover unforgettable <br />{" "}
              <span className="text-accent">cinematic events</span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/80 md:text-xl">
              From exclusive premieres to curated festivals and private
              screenings, find the most elegant movie experiences in your city.
            </p>

            <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    location_on
                  </span>
                  <input
                    className="w-full border-none bg-transparent text-sm text-white placeholder:text-white/40 focus:ring-0"
                    placeholder="Select City"
                    type="text"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    calendar_today
                  </span>
                  <input
                    className="w-full border-none bg-transparent text-sm text-white placeholder:text-white/40 focus:ring-0"
                    type="date"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    category
                  </span>
                  <select
                    className="w-full appearance-none border-none bg-transparent text-sm text-white focus:ring-0"
                    defaultValue="All Categories">
                    <option className="bg-charcoal">All Categories</option>
                    <option className="bg-charcoal">Premiere</option>
                    <option className="bg-charcoal">Gala Night</option>
                    <option className="bg-charcoal">Indie Fest</option>
                  </select>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-black text-charcoal transition-all hover:bg-accent/90">
                  <span className="material-symbols-outlined">search</span>
                  Find Events
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full px-6 py-24 md:px-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h3 className="mb-2 text-4xl font-black text-white">
                  Popular Events
                </h3>
                <p className="text-white/60">
                  Handpicked cinematic experiences for this month.
                </p>
              </div>
              <a
                className="flex items-center gap-2 font-bold text-accent hover:underline"
                href="/events">
                View All Events{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <p className="text-white/60">Loading popular events...</p>
                </div>
              ) : popularEvents.length > 0 ? (
                popularEvents.map((event) => (
                  <MovieEventCard event={event} key={event.id} />
                ))
              ) : (
                <div className="col-span-full flex justify-center py-12">
                  <p className="text-white/60">
                    No events available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {showJoinCards && (
          <section className="mx-auto max-w-[1440px] px-6 pb-24 md:px-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-[24px] border border-white/10 min-h-[220px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${heroImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

                <div className="relative z-10 flex h-full flex-col justify-center p-6 md:p-8">
                  <span className="mb-3 inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                    Membership
                  </span>

                  <h4 className="text-2xl font-black text-white md:text-3xl">
                    For Spectators
                  </h4>

                  <p className="mt-3 max-w-md text-sm text-white/75 md:text-base">
                    Access exclusive screenings, early releases, curated
                    festivals, and premium cinema nights.
                  </p>

                  <a
                    href="/signup"
                    className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-charcoal transition-all hover:scale-[1.02] hover:bg-white">
                    Join Now
                  </a>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[24px] border border-white/10 min-h-[220px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${parisImg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/30" />

                <div className="relative z-10 flex h-full flex-col justify-center p-6 md:p-8">
                  <span className="mb-3 inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                    Creator
                  </span>

                  <h4 className="text-2xl font-black text-white md:text-3xl">
                    For Organizers
                  </h4>

                  <p className="mt-3 max-w-md text-sm text-white/75 md:text-base">
                    Launch festivals, host private screenings, and manage
                    high-end movie experiences effortlessly.
                  </p>

                  <a
                    href="/organizer-registration"
                    className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-charcoal transition-all hover:scale-[1.02] hover:bg-white">
                    Host an Event
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Movie AI Floating Button */}
      <MovieAIFloatingButton onClick={() => setIsMovieAIChatOpen(true)} />

      {/* Movie Recommendation Chat Dialog */}
      <MovieRecommendationChat
        isOpen={isMovieAIChatOpen}
        onClose={() => setIsMovieAIChatOpen(false)}
      />
    </>
  );
}
