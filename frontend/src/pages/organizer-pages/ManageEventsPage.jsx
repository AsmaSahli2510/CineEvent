import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getMyEvents } from "../../api/eventApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ORGANIZER_EVENTS_STORAGE_KEY = "organizer_events_store_v1";

function readOrganizerEvents() {
  try {
    const raw = localStorage.getItem(ORGANIZER_EVENTS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDateTime(iso) {
  if (!iso) {
    return "-";
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.valueOf())) {
    return "-";
  }

  return parsed.toLocaleString();
}

function formatScreening(date, time) {
  if (!date || !time) {
    return "-";
  }
  return `${date} ${time}`;
}

function statusClasses(status) {
  if (status === "pending_validation") {
    return "border-amber-300/40 bg-amber-300/10 text-amber-200";
  }
  if (status === "published") {
    return "border-green-400/40 bg-green-400/10 text-green-300";
  }
  if (status === "rejected") {
    return "border-red-400/40 bg-red-400/10 text-red-300";
  }
  return "border-white/20 bg-white/10 text-white/80";
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

export default function ManageEventsPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const [eventsFromApi, setEventsFromApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const events = await getMyEvents();
        if (isMounted) {
          setEventsFromApi(Array.isArray(events) ? events : []);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || "Failed to fetch events from backend");
          setEventsFromApi([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const myEvents = useMemo(() => {
    const organizerId = currentUser?._id || currentUser?.id;
    if (!organizerId) {
      return [];
    }

    if (eventsFromApi.length > 0) {
      return eventsFromApi;
    }

    return readOrganizerEvents()
      .filter((event) => String(event.organizerId) === String(organizerId))
      .sort(
        (first, second) =>
          new Date(second.createdAt).valueOf() -
          new Date(first.createdAt).valueOf(),
      );
  }, [currentUser?._id, currentUser?.id, eventsFromApi]);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return myEvents.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || String(event?.status || "") === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const title = String(
        event?.movie?.title || event?.movieDetails?.title || "",
      ).toLowerCase();
      const venue = String(
        event?.venue?.venueTemplateName ||
          event?.venueDetails?.venueTemplateName ||
          event?.cinema ||
          "",
      ).toLowerCase();

      return title.includes(query) || venue.includes(query);
    });
  }, [myEvents, searchTerm, statusFilter]);

  return (
    <OrganizerPageFrame
      title="Manage Events"
      subtitle="All events created from your organizer account">
      <section className="space-y-5">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
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
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide transition ${
                    statusFilter === item.value
                      ? "border-accent/50 bg-accent/20 text-accent"
                      : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or venue"
              className="h-9 w-full rounded-lg border border-white/15 bg-background-dark px-3 text-xs text-white outline-none transition focus:border-accent md:w-64"
            />
          </div>

          <p className="mt-3 text-xs text-white/55">
            {filteredEvents.length} result
            {filteredEvents.length === 1 ? "" : "s"}
          </p>

          {loading ? (
            <p className="mt-2 text-xs text-white/45">
              Loading from backend...
            </p>
          ) : null}
          {!loading && loadError ? (
            <p className="mt-2 text-xs text-amber-300/90">
              {loadError}. Showing local events fallback.
            </p>
          ) : null}
        </article>

        {filteredEvents.length === 0 ? (
          <article className="rounded-2xl border border-dashed border-white/20 bg-background-dark/80 p-8 text-center">
            <p className="text-lg font-black text-white">No matching events</p>
            <p className="mt-2 text-sm text-white/60">
              Try changing filters or search terms.
            </p>
          </article>
        ) : (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredEvents.map((event) => {
              const cardStatus = String(event.status || "draft");
              const isFree = Boolean(
                event?.pricing?.isFreeEvent ||
                event?.pricingDetails?.isFreeEvent,
              );
              const basePrice = Number(
                event?.pricing?.singlePrice ||
                  event?.pricingDetails?.singlePrice ||
                  event?.price ||
                  0,
              );
              const eventTitle =
                event?.movie?.title ||
                event?.movieDetails?.title ||
                "Untitled event";
              const posterSrc = normalizePosterSrc(
                event?.movieDetails?.posterUrl ||
                  event?.movieDetails?.posterDataUrl ||
                  event?.movie?.poster ||
                  "",
              );

              return (
                <article
                  key={event._id || event.id}
                  className="rounded-xl border border-white/10 bg-charcoal/70 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-xs font-black text-white">
                      {eventTitle}
                    </h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${statusClasses(
                        cardStatus,
                      )}`}>
                      {cardStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="relative mb-2 aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-background-dark">
                    {posterSrc ? (
                      <img
                        src={posterSrc}
                        alt={`${eventTitle} poster`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-background-dark to-accent/20 px-2 text-center text-[10px] font-bold uppercase tracking-wide text-white/80">
                        Poster unavailable
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="mt-2 w-full rounded-md border border-white/20 bg-white/5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white/85 transition hover:bg-white/10">
                    See details
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {selectedEvent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-charcoal p-5">
              {(() => {
                const selectedIsFree = Boolean(
                  selectedEvent?.pricing?.isFreeEvent ||
                  selectedEvent?.pricingDetails?.isFreeEvent,
                );
                const selectedBasePrice = Number(
                  selectedEvent?.pricing?.singlePrice ||
                    selectedEvent?.pricingDetails?.singlePrice ||
                    selectedEvent?.price ||
                    0,
                );

                return (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-white">
                        {selectedEvent?.movie?.title ||
                          selectedEvent?.movieDetails?.title ||
                          "Untitled event"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="rounded-lg border border-white/15 px-3 py-1 text-xs font-bold text-white/80 hover:bg-white/10">
                        Close
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-white/80">
                      <p>
                        <span className="text-white/50">Status:</span>{" "}
                        {String(selectedEvent?.status || "draft").replace(
                          /_/g,
                          " ",
                        )}
                      </p>
                      <p>
                        <span className="text-white/50">Venue:</span>{" "}
                        {selectedEvent?.venue?.venueTemplateName ||
                          selectedEvent?.venueDetails?.venueTemplateName ||
                          selectedEvent?.cinema ||
                          "-"}
                      </p>
                      <p>
                        <span className="text-white/50">Location:</span>{" "}
                        {selectedEvent?.venue?.location ||
                          selectedEvent?.venueDetails?.location ||
                          "-"}
                      </p>
                      <p>
                        <span className="text-white/50">Screening:</span>{" "}
                        {formatScreening(
                          selectedEvent?.projection?.date ||
                            (selectedEvent?.date
                              ? new Date(selectedEvent.date)
                                  .toISOString()
                                  .slice(0, 10)
                              : ""),
                          selectedEvent?.projection?.time ||
                            selectedEvent?.startTime,
                        )}
                      </p>
                      <p>
                        <span className="text-white/50">Price:</span>{" "}
                        {selectedIsFree
                          ? "Free"
                          : `${(
                              selectedBasePrice ||
                              Number(selectedEvent?.price || 0)
                            ).toFixed(3)} TND`}
                      </p>
                      <p>
                        <span className="text-white/50">Created:</span>{" "}
                        {formatDateTime(selectedEvent?.createdAt)}
                      </p>
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
