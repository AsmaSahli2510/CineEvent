import React, { useEffect, useMemo, useState } from "react";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getMyEvents } from "../../api/eventApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ORGANIZER_EVENTS_STORAGE_KEY = "organizer_events_store_v1";

function readLocalOrganizerEvents() {
  try {
    const raw = localStorage.getItem(ORGANIZER_EVENTS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizePosterSrc(src) {
  if (!src) {
    return "";
  }

  const value = String(src).trim();
  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_BASE_URL}${value}`;
  }

  return `${API_BASE_URL}/${value}`;
}

function buildEventKey(title, dateValue, timeValue) {
  const titleKey = String(title || "")
    .trim()
    .toLowerCase();
  const dateKey = String(dateValue || "").trim();
  const timeKey = String(timeValue || "").trim();
  return `${titleKey}__${dateKey}__${timeKey}`;
}

function formatDateTime(date, startTime) {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.valueOf())) {
    return "-";
  }

  const datePart = parsed.toLocaleDateString();
  return startTime ? `${datePart} ${startTime}` : datePart;
}

function statusClasses(status) {
  if (status === "pending_validation") {
    return "border-amber-300/40 bg-black/45 text-amber-200 backdrop-blur-sm";
  }
  if (status === "published") {
    return "border-green-400/40 bg-black/45 text-green-300 backdrop-blur-sm";
  }
  if (status === "rejected") {
    return "border-red-400/40 bg-black/45 text-red-300 backdrop-blur-sm";
  }
  return "border-white/20 bg-black/45 text-white/90 backdrop-blur-sm";
}

export default function MyEventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const loadMyEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getMyEvents();
        if (isMounted) {
          setEvents(Array.isArray(result) ? result : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load your events");
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMyEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (first, second) =>
        new Date(second.createdAt).valueOf() -
        new Date(first.createdAt).valueOf(),
    );
  }, [events]);

  const localPosterByKey = useMemo(() => {
    const map = new Map();
    readLocalOrganizerEvents().forEach((item) => {
      const key = buildEventKey(
        item?.movie?.title,
        item?.projection?.date,
        item?.projection?.time,
      );
      const localPoster = item?.movie?.posterDataUrl || "";
      if (key && localPoster) {
        map.set(key, localPoster);
      }
    });
    return map;
  }, [sortedEvents.length]);

  const filteredEvents = useMemo(() => {
    if (statusFilter === "all") {
      return sortedEvents;
    }

    return sortedEvents.filter(
      (event) => String(event?.status || "draft") === statusFilter,
    );
  }, [sortedEvents, statusFilter]);

  return (
    <OrganizerPageFrame
      title="My Events List"
      subtitle="All events created from your organizer account">
      <section className="space-y-5">
        {!loading && !error && sortedEvents.length > 0 ? (
          <article className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "pending_validation", label: "Pending" },
                { value: "published", label: "Published" },
                { value: "rejected", label: "Rejected" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatusFilter(item.value)}
                  className={`border px-3 py-1 text-[10px] font-black uppercase tracking-wide transition ${
                    statusFilter === item.value
                      ? "border-accent/50 bg-accent/20 text-accent"
                      : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </article>
        ) : null}

        {loading ? (
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            Loading your events...
          </article>
        ) : null}

        {!loading && error ? (
          <article className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-sm text-red-200">
            {error}
          </article>
        ) : null}

        {!loading && !error && sortedEvents.length === 0 ? (
          <article className="rounded-2xl border border-dashed border-white/20 bg-background-dark/80 p-8 text-center">
            <p className="text-lg font-black text-white">No events found</p>
            <p className="mt-2 text-sm text-white/60">
              Create an event and it will show here.
            </p>
          </article>
        ) : null}

        {!loading && !error && filteredEvents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredEvents.map((event) => {
              const status = String(event.status || "draft");
              const title = event?.movieDetails?.title || "Untitled event";
              const dateKey = event?.date
                ? new Date(event.date).toISOString().slice(0, 10)
                : "";
              const posterFromLocal = localPosterByKey.get(
                buildEventKey(title, dateKey, event?.startTime || ""),
              );
              const posterSrc = normalizePosterSrc(
                event?.movieDetails?.posterUrl ||
                  event?.movieDetails?.posterDataUrl ||
                  event?.movie?.poster ||
                  posterFromLocal ||
                  "",
              );

              return (
                <article
                  key={event._id || event.id}
                  className="group relative overflow-hidden border border-white/10 bg-[#10131b] shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
                  <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2">
                    <span
                      className={`border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${statusClasses(
                        status,
                      )}`}>
                      {status.replace(/_/g, " ")}
                    </span>
                    <span className="border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
                      Cinema
                    </span>
                  </div>

                  <div className="relative aspect-[2/3] bg-background-dark">
                    {posterSrc ? (
                      <img
                        src={posterSrc}
                        alt={`${title} poster`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/80">
                        Poster unavailable
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,12,0.92)_0%,rgba(6,8,12,0.15)_42%,rgba(6,8,12,0)_72%)]" />

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                        {title}
                      </h3>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                        Movie poster card
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="mt-4 w-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20">
                        See details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : !loading && !error && sortedEvents.length > 0 ? (
          <article className="border border-dashed border-white/20 bg-background-dark/80 p-8 text-center">
            <p className="text-lg font-black text-white">No matching events</p>
            <p className="mt-2 text-sm text-white/60">
              Try a different filter.
            </p>
          </article>
        ) : null}

        {selectedEvent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xl border border-white/10 bg-charcoal p-5">
              {(() => {
                const selectedTitle =
                  selectedEvent?.movieDetails?.title || "Untitled event";
                const selectedStatus = String(selectedEvent?.status || "draft");
                const selectedIsFree = Boolean(
                  selectedEvent?.pricingDetails?.isFreeEvent,
                );
                const selectedPrice = Number(
                  selectedEvent?.pricingDetails?.singlePrice ||
                    selectedEvent?.price ||
                    0,
                );
                const selectedPoster = normalizePosterSrc(
                  selectedEvent?.movieDetails?.posterUrl ||
                    selectedEvent?.movieDetails?.posterDataUrl ||
                    selectedEvent?.movie?.poster ||
                    "",
                );

                return (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-white">{selectedTitle}</h3>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="rounded-lg border border-white/15 px-3 py-1 text-xs font-bold text-white/80 hover:bg-white/10">
                        Close
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-background-dark">
                        {selectedPoster ? (
                          <img
                            src={selectedPoster}
                            alt={`${selectedTitle} poster`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/80">
                            Poster unavailable
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-white/80">
                        <p>
                          <span className="text-white/50">Status:</span>{" "}
                          {selectedStatus.replace(/_/g, " ")}
                        </p>
                        <p>
                          <span className="text-white/50">Venue:</span>{" "}
                          {selectedEvent?.venueDetails?.venueTemplateName ||
                            selectedEvent?.cinema ||
                            "-"}
                        </p>
                        <p>
                          <span className="text-white/50">Location:</span>{" "}
                          {selectedEvent?.venueDetails?.location || "-"}
                        </p>
                        <p>
                          <span className="text-white/50">Screening:</span>{" "}
                          {formatDateTime(
                            selectedEvent?.date,
                            selectedEvent?.startTime,
                          )}
                        </p>
                        <p>
                          <span className="text-white/50">Price:</span>{" "}
                          {selectedIsFree ? "Free" : `${selectedPrice.toFixed(3)} TND`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ) : null}
      </section>
    </OrganizerPageFrame>
  );
}
