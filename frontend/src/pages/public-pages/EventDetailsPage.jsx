import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../../api/eventApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const extractYouTubeId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?.*?v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

const transformEventDetails = (backendEvent) => {
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

  const eventDate = backendEvent.date ? new Date(backendEvent.date) : null;
  let fullDate = "Date TBA";

  if (eventDate) {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const formattedDate = eventDate.toLocaleDateString("en-US", options);
    const time = backendEvent.startTime || "";
    fullDate = time ? `${formattedDate} • ${time}` : formattedDate;
  }

  const fullLocation =
    backendEvent.venueDetails?.name ||
    backendEvent.venueDetails?.name ||
    backendEvent.cinema ||
    "Location TBA";

  const priceNum = backendEvent.pricingDetails?.isFreeEvent
    ? 0
    : backendEvent.pricingDetails?.singlePrice || backendEvent.price || 0;

  const fullPrice =
    priceNum === 0
      ? "Free"
      : `${Number(priceNum).toLocaleString("en-US", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })} TND`;

  const gallery = backendEvent.media?.galleryImageUrls || [];
  const galleryWithDefaults =
    gallery.length > 0 ? gallery : image ? [image] : [];

  let teaserUrl =
    backendEvent.media?.teaserUrl || backendEvent.movieDetails?.teaserUrl || "";

  if (
    teaserUrl &&
    !teaserUrl.startsWith("http") &&
    !teaserUrl.startsWith("data:")
  ) {
    teaserUrl = teaserUrl.startsWith("/")
      ? `${API_URL}${teaserUrl}`
      : `${API_URL}/${teaserUrl}`;
  }

  return {
    id: backendEvent._id,
    title,
    heroTitle: title,
    image,
    teaserUrl,
    category:
      backendEvent.eventType === "festival"
        ? backendEvent.festivalDetails?.category || "Festival"
        : "Movie",
    maturity: "PG",
    duration: backendEvent.movieDetails?.duration || "1h 38min",
    genre:
      backendEvent.movieDetails?.genre ||
      backendEvent.festivalDetails?.category ||
      "Adventure / Animation / Comedy",
    fullDate,
    fullLocation,
    fullPrice,
    about:
      backendEvent.movieDetails?.synopsis ||
      backendEvent.festivalDetails?.description ||
      "Event details coming soon.",
    gallery: galleryWithDefaults,
    cast:
      backendEvent.movieDetails?.cast ||
      backendEvent.festivalDetails?.guests ||
      "Cast information coming soon",
    director:
      backendEvent.movieDetails?.director ||
      backendEvent.festivalDetails?.organizer ||
      "Unknown",
    venueAddress:
      backendEvent.venueDetails?.address ||
      backendEvent.venueDetails?.location ||
      "Address not available",
  };
};

const InfoPill = ({ icon, label, value }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
    <div className="mb-1 flex items-center gap-1 text-white/50">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="text-xs font-medium text-white md:text-sm">{value}</p>
  </div>
);

export default function EventDetailsPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const backendEvent = await getEventById(eventId);
        const transformedEvent = transformEventDetails(backendEvent);

        setEvent(transformedEvent);
      } catch (err) {
        setError(err.message || "Failed to load event");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const youtubeId = useMemo(
    () => extractYouTubeId(event?.teaserUrl),
    [event?.teaserUrl],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06070a] text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
              <span className="material-symbols-outlined animate-spin text-4xl">
                progress_activity
              </span>
            </div>
            <p className="text-lg font-medium text-white/80">
              Loading cinematic experience...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#06070a] px-6 py-20 text-white md:px-16">
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-sm text-red-300">
            Not available
          </span>
          <h1 className="mb-4 text-4xl font-black md:text-6xl">
            Event not found
          </h1>
          <p className="mb-8 max-w-2xl text-white/70">
            {error || "This event does not exist anymore."}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition hover:scale-[1.02]">
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <section className="relative overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div
            className="h-full min-h-[980px] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06070a] via-[#06070a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/35 to-[#06070a]/10" />
          <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 pb-12 pt-20 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-red-900/30">
                Now Showing
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                {event.category}
              </span>
            </div>

            <h1 className="max-w-4xl text-3xl font-black leading-[0.92] tracking-tight md:text-5xl xl:text-6xl">
              {event.heroTitle}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75 md:text-base">
              <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 font-semibold text-yellow-200">
                ★ 8.7 Audience Score
              </span>
              <span>{event.maturity}</span>
              <span>•</span>
              <span>{event.duration}</span>
              <span>•</span>
              <span>{event.genre}</span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
              {event.about}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                
                className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-black shadow-2xl transition hover:scale-[1.02]">
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                Book seats
              </Link>

              {event.teaserUrl && (
                <button
                  onClick={() => {
                    setShowVideoModal(true);
                    setVideoError("");
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-xl transition hover:scale-[1.02] hover:bg-white/15">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch teaser
                </button>
              )}

              <button className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-wide text-white/85 transition hover:border-white/20 hover:bg-white/5">
                <span className="material-symbols-outlined">favorite</span>
                Wishlist
              </button>
            </div>

            {/* STATS / INFO GRID */}
            <div className="mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoPill
                icon="calendar_month"
                label="Date"
                value={event.fullDate}
              />
              <InfoPill
                icon="location_on"
                label="Cinema"
                value={event.fullLocation}
              />
              <InfoPill icon="sell" label="Ticket" value={event.fullPrice} />
              <InfoPill
                icon="theaters"
                label="Director"
                value={event.director}
              />
            </div>

            {/* EXTRA DETAILS */}
            <div className="mt-6 max-w-4xl rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/40">
                    Cast
                  </p>
                  <p className="leading-7 text-white/80">{event.cast}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/40">
                    Venue address
                  </p>
                  <p className="leading-7 text-white/80">
                    {event.venueAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE POSTER CARD */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                      Premium screening
                    </span>
                  </div>

                  {event.teaserUrl && (
                    <button
                      onClick={() => {
                        setShowVideoModal(true);
                        setVideoError("");
                      }}
                      className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition hover:scale-105"
                      aria-label="Play teaser">
                      <span className="material-symbols-outlined text-[26px]">
                        play_arrow
                      </span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 border-t border-white/10 bg-black/30">
                  <div className="p-2 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Format
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white">
                      2D / IMAX
                    </p>
                  </div>
                  <div className="border-x border-white/10 p-2 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Audio
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white">
                      Dolby
                    </p>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Seats
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white">
                      Available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER CONTENT */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:p-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">
                  local_activity
                </span>
                <h2 className="text-2xl font-bold">About this experience</h2>
              </div>
              <p className="text-base leading-8 text-white/75 md:text-lg">
                {event.about}
              </p>
            </div>

            {event.gallery.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Gallery</h2>
                  <span className="text-sm uppercase tracking-[0.2em] text-white/40">
                    Visuals
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {event.gallery.map((img, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                      <img
                        src={img}
                        alt={`${event.title}-${index}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-red-500/15 to-amber-400/10 p-4 backdrop-blur-2xl">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/40">
                Booking status
              </p>
              <h3 className="text-xl font-black">Reserve your seats now</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Choose your screening, secure your spot, and enjoy a premium
                cinema experience with immersive sound and a giant screen
                atmosphere.
              </p>

              <Link
                
                className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-black transition hover:scale-[1.02]">
                <span className="material-symbols-outlined">weekend</span>
                Select seats
              </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
              <h3 className="mb-3 text-lg font-bold">Cinema details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Release
                  </p>
                  <p className="mt-1 text-sm text-white/85">{event.fullDate}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Genre
                  </p>
                  <p className="mt-1 text-sm text-white/85">{event.genre}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Audience
                  </p>
                  <p className="mt-1 text-sm text-white/85">{event.maturity}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Ticket price
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {event.fullPrice}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    Venue
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {event.fullLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {showVideoModal && event.teaserUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
          onClick={() => {
            setShowVideoModal(false);
            setVideoError("");
          }}>
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowVideoModal(false);
                setVideoError("");
              }}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
              aria-label="Close video">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="aspect-video w-full bg-white/5">
              {videoError ? (
                <div className="flex h-full items-center justify-center px-6 text-center text-white/70">
                  <div>
                    <p className="mb-2 text-lg font-semibold">
                      Video failed to load
                    </p>
                    <p className="text-sm">{videoError}</p>
                  </div>
                </div>
              ) : youtubeId ? (
                <iframe
                  title="Event teaser"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  className="h-full w-full"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={event.teaserUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                  controlsList="nodownload"
                  onCanPlay={() => setVideoError("")}
                  onError={() =>
                    setVideoError(
                      `Failed to load video from: ${event.teaserUrl}`,
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
