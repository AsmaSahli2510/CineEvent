import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import { getEvents, updateEvent } from "../../api/eventApi";
import { getPublishedVenueTemplateById } from "../../api/venueTemplateApi";
import MiniVenueMap from "../../components/organizer/MiniVenueMap";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDateTime(date, startTime) {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.valueOf())) return "-";

  const datePart = parsed.toLocaleDateString();
  return startTime ? `${datePart} ${startTime}` : datePart;
}

function formatTimeAgo(dateValue) {
  if (!dateValue) return "Recently";

  const eventDate = new Date(dateValue).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - eventDate) / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  if (url.includes("youtube.com/embed/")) return url;

  return null;
}

function getVimeoEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;

  if (url.includes("vimeo.com/video/")) return url;

  return null;
}

function resolvePoster(event) {
  const rawPoster =
    event?.movieDetails?.posterUrl ||
    event?.movieDetails?.posterDataUrl ||
    event?.movie?.poster ||
    "";

  if (!rawPoster) return "";

  if (
    rawPoster.startsWith("http://") ||
    rawPoster.startsWith("https://") ||
    rawPoster.startsWith("data:") ||
    rawPoster.startsWith("blob:")
  ) {
    return rawPoster;
  }

  if (rawPoster.startsWith("/")) return `${API_BASE_URL}${rawPoster}`;

  return `${API_BASE_URL}/${rawPoster}`;
}

function getPriceRows(event) {
  const details = event?.pricingDetails || {};

  if (details?.isFreeEvent) {
    return [{ label: "Free Admission", value: "Free" }];
  }

  // Handle dynamic zone-based pricing (any seat categories from venue)
  if (details?.categories && typeof details.categories === "object") {
    const categoryKeys = Object.keys(details.categories);

    if (categoryKeys.length > 0) {
      return categoryKeys.map((zoneId) => ({
        label: zoneId.charAt(0).toUpperCase() + zoneId.slice(1),
        value: `${Number(details.categories[zoneId] || 0).toFixed(3)} TND`,
      }));
    }
  }

  // Fallback to single price
  return [
    {
      label: "Standard Admission",
      value: `${Number(details?.singlePrice || event?.price || 0).toFixed(3)} TND`,
    },
  ];
}

const PAGE_STYLES = `
  .event-validation-page {
    font-family: 'Spline Sans', sans-serif;
  }

  .event-validation-page .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .event-validation-page .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .event-validation-page .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #800020;
    border-radius: 10px;
  }

  .event-validation-page .sidebar-link.active {
    background: rgba(128, 0, 32, 0.2);
    border-right: 3px solid #F5C065;
    color: #F5C065;
  }

  .event-validation-page .event-card.active {
    border-color: #F5C065;
    background: rgba(245, 192, 101, 0.06);
    box-shadow: inset 0 0 0 1px rgba(245, 192, 101, 0.2);
  }
`;

function ReviewStat({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-md border p-3 md:p-4 ${
        accent ? "border-accent/30 bg-accent/15" : "border-white/10 bg-white/5"
      }`}>
      <p
        className={`text-[10px] uppercase tracking-[0.18em] font-bold ${
          accent ? "text-accent" : "text-white/45"
        }`}>
        {label}
      </p>
      <p
        className={`mt-2 text-sm md:text-base font-black ${
          accent ? "text-accent" : "text-white"
        }`}>
        {value}
      </p>
    </div>
  );
}

function SectionCard({ title, children, action = null }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/10">
        <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-accent">
          {title}
        </h4>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function EventValidationPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedVenueTemplate, setSelectedVenueTemplate] = useState(null);
  const [loadingVenueTemplate, setLoadingVenueTemplate] = useState(false);

  const loadPendingEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getEvents({
        status: "pending_validation",
        limit: 100,
      });
      const pending = Array.isArray(result?.events) ? result.events : [];
      setEvents(pending);
      setSelectedId((previous) => {
        if (previous && pending.some((event) => event._id === previous)) {
          return previous;
        }
        return pending[0]?._id || null;
      });
    } catch (loadError) {
      setEvents([]);
      setSelectedId(null);
      setError(loadError.message || "Failed to load pending event submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return events;

    return events.filter((event) => {
      const title = String(event?.movieDetails?.title || "").toLowerCase();
      const organization = String(
        event?.organizationName || event?.submittedByName || "",
      ).toLowerCase();
      const venue = String(
        event?.venueDetails?.venueTemplateName || event?.cinema || "",
      ).toLowerCase();

      return (
        title.includes(query) ||
        organization.includes(query) ||
        venue.includes(query)
      );
    });
  }, [events, searchTerm]);

  const selectedEvent = useMemo(() => {
    return (
      filteredEvents.find((event) => event._id === selectedId) ||
      filteredEvents[0] ||
      null
    );
  }, [filteredEvents, selectedId]);

  const handleStatusUpdate = async (nextStatus) => {
    if (!selectedEvent?._id) return;

    try {
      setIsUpdating(true);
      setActionError("");
      await updateEvent(selectedEvent._id, { status: nextStatus });
      await loadPendingEvents();
    } catch (updateError) {
      setActionError(updateError.message || "Failed to update event status");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSelectedVenueTemplate = async () => {
      const templateId = selectedEvent?.venueDetails?.venueTemplateId;
      if (!templateId) {
        setSelectedVenueTemplate(null);
        return;
      }

      try {
        setLoadingVenueTemplate(true);
        const result = await getPublishedVenueTemplateById(templateId);
        if (!isMounted) return;
        setSelectedVenueTemplate(result?.template || null);
      } catch {
        if (isMounted) setSelectedVenueTemplate(null);
      } finally {
        if (isMounted) setLoadingVenueTemplate(false);
      }
    };

    loadSelectedVenueTemplate();

    return () => {
      isMounted = false;
    };
  }, [selectedEvent?._id, selectedEvent?.venueDetails?.venueTemplateId]);

  const selectedPrices = selectedEvent ? getPriceRows(selectedEvent) : [];
  const seatRowsForPreview =
    Array.isArray(selectedEvent?.venueSnapshot?.rows) &&
    selectedEvent.venueSnapshot.rows.length > 0
      ? selectedEvent.venueSnapshot.rows
      : Array.isArray(selectedVenueTemplate?.rows)
        ? selectedVenueTemplate.rows
        : [];
  const screenLabelForPreview =
    selectedEvent?.venueSnapshot?.screenLabel ||
    selectedVenueTemplate?.screenLabel ||
    "SCREEN";
  const selectedPoster = resolvePoster(selectedEvent || {});
  const isQueueEmpty = !loading && !error && filteredEvents.length === 0;

  if (isQueueEmpty) {
    return (
      <>
        <style>{PAGE_STYLES}</style>

        <div className="event-validation-page bg-background-dark text-white min-h-screen">
          <AdminPageFrame
            title="Event Validation"
            subtitle="Review pending event submissions">
            <div className="flex h-[calc(100vh-120px)] overflow-hidden p-2.5 md:p-3 gap-3">
              <aside className="w-[30%] min-w-[280px] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Validation Queue
                    </h2>
                    <p className="text-white/50 text-xs">
                      Reviewing 0 pending event submission(s)
                    </p>
                  </div>
                  <button
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                    onClick={loadPendingEvents}
                    type="button">
                    <span className="material-symbols-outlined text-accent">
                      refresh
                    </span>
                  </button>
                </div>

                <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-2 max-h-[calc(100vh-220px)]">
                  <div className="rounded-md border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent p-5">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-lg bg-accent/20 p-2">
                        <span className="material-symbols-outlined text-accent">
                          fact_check
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Queue is clear
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">
                          There are currently no event submissions waiting for
                          validation.
                        </p>
                      </div>
                    </div>

                    <button
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
                      onClick={loadPendingEvents}
                      type="button">
                      <span className="material-symbols-outlined text-sm">
                        refresh
                      </span>
                      Check Again
                    </button>
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex items-center justify-center">
                <div className="h-full w-full rounded-lg border border-accent/20 bg-gradient-to-br from-accent/10 via-white/0 to-transparent p-6 flex flex-col items-center justify-center text-center">
                  <div className="mb-3 rounded-full border border-accent/30 bg-accent/15 p-3">
                    <span className="material-symbols-outlined text-4xl text-accent">
                      task_alt
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    All Event Submissions Reviewed
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                    Great work. No event is currently waiting for approval or
                    rejection. New submissions will appear here automatically.
                  </p>

                  <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-white/10 bg-white/5 p-4 text-left">
                      <p className="text-[11px] uppercase tracking-wider text-white/45">
                        Queue Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-accent">
                        0 pending submissions
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 p-4 text-left">
                      <p className="text-[11px] uppercase tracking-wider text-white/45">
                        Suggested Action
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white/80">
                        Recheck queue in a few minutes
                      </p>
                    </div>
                  </div>

                  <button
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                    onClick={loadPendingEvents}
                    type="button">
                    <span className="material-symbols-outlined text-sm">
                      refresh
                    </span>
                    Refresh Validation Queue
                  </button>
                </div>
              </main>
            </div>
          </AdminPageFrame>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{PAGE_STYLES}</style>

      <div className="event-validation-page bg-background-dark text-white min-h-screen">
        <AdminPageFrame
          title="Event Validation"
          subtitle="Review pending event submissions">
          <div className="flex h-[calc(100vh-120px)] overflow-hidden">
            <aside className="w-[320px] flex-shrink-0 border-r border-white/5 flex flex-col bg-black/20">
              <div className="p-4 border-b border-white/5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
                      Awaiting Review
                    </h2>
                    <p className="mt-1 text-lg font-black text-white">
                      {filteredEvents.length} submission
                      {filteredEvents.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                    onClick={loadPendingEvents}
                    type="button">
                    <span className="material-symbols-outlined text-accent text-[18px]">
                      refresh
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    search
                  </span>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-3 py-2 text-sm focus:border-accent focus:ring-0"
                    placeholder="Search title, organizer, venue..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    type="text"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {loading ? (
                  <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Loading pending submissions...
                  </div>
                ) : null}

                {!loading && error ? (
                  <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                ) : null}

                {!loading && !error && filteredEvents.length === 0 ? (
                  <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    No pending event submissions found.
                  </div>
                ) : null}

                {!loading && !error
                  ? filteredEvents.map((event) => {
                      const isSelected =
                        (selectedEvent?._id || selectedId) === event._id;
                      const cardPoster = resolvePoster(event);
                      return (
                        <button
                          key={event._id}
                          onClick={() => setSelectedId(event._id)}
                          type="button"
                          className={`event-card w-full text-left border rounded-lg p-3 transition-all hover:bg-white/5 ${
                            isSelected
                              ? "active border-white/10"
                              : "border-white/5"
                          }`}>
                          <div className="flex gap-3">
                            <div className="w-14 h-20 rounded-md overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                              {cardPoster ? (
                                <img
                                  alt={
                                    event?.movieDetails?.title || "Event poster"
                                  }
                                  className="w-full h-full object-cover object-top"
                                  src={cardPoster}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/30">
                                  <span className="material-symbols-outlined text-base">
                                    image
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/60 border border-white/10 uppercase tracking-wider">
                                  Pending
                                </span>
                                <span className="text-[10px] text-white/35 whitespace-nowrap">
                                  {formatTimeAgo(event.createdAt)}
                                </span>
                              </div>

                              <h3
                                className={`mt-2 text-sm font-black leading-tight ${isSelected ? "text-accent" : "text-white"}`}>
                                {event?.movieDetails?.title || "Untitled Event"}
                              </h3>

                              <p className="mt-1 text-xs text-white/55 truncate">
                                {event?.organizationName ||
                                  event?.submittedByName ||
                                  "Organizer"}
                              </p>

                              <p className="mt-2 text-[11px] text-white/45 line-clamp-2">
                                {(event?.venueDetails?.venueTemplateName ||
                                  event?.cinema ||
                                  "Venue") +
                                  " • " +
                                  (event?.venueDetails?.venueType || "Event")}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  : null}
              </div>
            </aside>

            <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
              <div className="max-w-[1200px] mx-auto p-4 lg:p-6 space-y-5">
                {actionError ? (
                  <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {actionError}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
                  <div className="space-y-5 min-w-0">
                    <section className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <div className="p-4 lg:p-5">
                        <div className="flex flex-col lg:flex-row gap-5">
                          <div className="w-full lg:w-[240px] xl:w-[260px] h-[320px] rounded-lg overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">
                            {selectedPoster ? (
                              <img
                                alt="Event Hero"
                                className="w-full h-full object-cover object-top"
                                src={selectedPoster}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-transparent text-white/30">
                                <span className="material-symbols-outlined text-6xl">
                                  image
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] bg-accent/15 text-accent border border-accent/30">
                                  Pending Review
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-white/5 text-white/55 border border-white/10">
                                  Submitted{" "}
                                  {formatTimeAgo(selectedEvent?.createdAt)}
                                </span>
                              </div>

                              <h1 className="mt-4 text-2xl lg:text-3xl font-black tracking-tight text-white">
                                {selectedEvent?.movieDetails?.title ||
                                  "Untitled Event"}
                              </h1>

                              <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed">
                                {selectedEvent?.movieDetails?.tagline ||
                                  selectedEvent?.movieDetails?.synopsis ||
                                  "No synopsis provided."}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="rounded-md border border-white/10 bg-black/10 p-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
                                  Organizer
                                </p>
                                <p className="mt-2 text-sm font-bold text-white">
                                  {selectedEvent?.organizationName ||
                                    selectedEvent?.submittedByName ||
                                    "Organizer"}
                                </p>
                              </div>
                              <div className="rounded-md border border-white/10 bg-black/10 p-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
                                  Venue Type
                                </p>
                                <p className="mt-2 text-sm font-bold text-white">
                                  {selectedEvent?.venueDetails?.venueType ||
                                    "Event"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/10 to-background-dark/50 p-2.5">
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-accent/70 font-bold">
                        Venue details
                      </p>
                      <div className="flex flex-col gap-0.5 text-[10px] text-white/70">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-accent">
                            location_on
                          </span>
                          <span className="text-white/50 min-w-fit">
                            Venue:
                          </span>
                          <span className="font-semibold truncate">
                            {selectedEvent?.venueDetails?.venueTemplateName ||
                              selectedEvent?.cinema ||
                              "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-accent">
                            event
                          </span>
                          <span className="text-white/50 min-w-fit">Date:</span>
                          <span className="font-semibold truncate">
                            {selectedEvent
                              ? formatDateTime(selectedEvent.date)
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-accent">
                            schedule
                          </span>
                          <span className="text-white/50 min-w-fit">Time:</span>
                          <span className="font-semibold truncate">
                            {selectedEvent?.startTime || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-primary">
                            payments
                          </span>
                          <span className="text-white/50 min-w-fit">
                            Price:
                          </span>
                          <span className="font-bold text-primary text-[11px]">
                            {selectedPrices[0]?.value || "0.000 TND"}
                          </span>
                        </div>
                      </div>
                    </section>

                    <SectionCard title="Description">
                      <div className="text-sm leading-7 text-white/80 whitespace-pre-wrap">
                        {selectedEvent?.movieDetails?.synopsis ||
                          "No synopsis provided."}
                      </div>
                    </SectionCard>

                    <SectionCard title="Trailer / Teaser">
                      {selectedEvent?.media?.teaserUrl ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 p-3 bg-black/30 rounded-md border border-white/10">
                            <span className="material-symbols-outlined text-accent text-sm">
                              link
                            </span>
                            <a
                              href={selectedEvent.media.teaserUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline truncate flex-1">
                              {selectedEvent.media.teaserUrl}
                            </a>
                            <button className="ml-1 p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 flex-shrink-0">
                              <span className="material-symbols-outlined text-sm">
                                open_in_new
                              </span>
                            </button>
                          </div>

                          {(() => {
                            const youtubeEmbedUrl = getYouTubeEmbedUrl(
                              selectedEvent.media.teaserUrl,
                            );
                            const vimeoEmbedUrl = getVimeoEmbedUrl(
                              selectedEvent.media.teaserUrl,
                            );

                            if (youtubeEmbedUrl) {
                              return (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                                  <iframe
                                    title="Teaser"
                                    className="w-full h-full"
                                    src={youtubeEmbedUrl}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              );
                            }

                            if (vimeoEmbedUrl) {
                              return (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                                  <iframe
                                    title="Teaser"
                                    className="w-full h-full"
                                    src={vimeoEmbedUrl}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              );
                            }

                            return (
                              <div className="flex items-center justify-center h-40 text-white/40 text-center rounded-lg border border-dashed border-white/10 bg-black/20">
                                <div className="space-y-2">
                                  <span className="material-symbols-outlined text-3xl block">
                                    play_circle
                                  </span>
                                  <span className="text-sm">
                                    Supported: YouTube, Vimeo
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-10 text-white/40 text-center rounded-lg border border-dashed border-white/10 bg-black/20">
                          <div>
                            <span className="material-symbols-outlined block text-2xl mb-2">
                              play_circle
                            </span>
                            <span className="text-sm">No teaser provided</span>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    <SectionCard title="Gallery Media">
                      {selectedEvent?.media?.galleryImageUrls &&
                      selectedEvent.media.galleryImageUrls.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                          {selectedEvent.media.galleryImageUrls.map(
                            (imageUrl, index) => (
                              <div
                                key={index}
                                className="relative group rounded-lg overflow-hidden h-40 min-w-[180px] border border-white/10 bg-black/30 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20 cursor-pointer flex-shrink-0">
                                <img
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  src={imageUrl}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white text-2xl">
                                    zoom_in
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-10 text-white/40 text-center rounded-lg border border-dashed border-white/10 bg-black/20">
                          <div>
                            <span className="material-symbols-outlined block text-3xl mb-2">
                              image
                            </span>
                            <span className="text-sm">No gallery images</span>
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <SectionCard title="Pricing Details">
                        <div className="space-y-3">
                          {selectedPrices.map((row, index) => (
                            <div
                              key={`${row.label}-${index}`}
                              className={`flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/10 px-3 py-3 ${
                                index === 0 ? "border-accent/20" : ""
                              }`}>
                              <span className="text-sm font-bold text-white/65">
                                {row.label}
                              </span>
                              <span
                                className={`text-sm font-black ${index === 0 ? "text-accent" : "text-white"}`}>
                                {row.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </SectionCard>

                      <SectionCard title="Venue & Layout">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                const venueId =
                                  selectedEvent?.venueDetails?.venueTemplateId;
                                if (venueId) {
                                  navigate(
                                    `/admin/rooms/templates?templateId=${venueId}`,
                                  );
                                }
                              }}
                              disabled={
                                !selectedEvent?.venueDetails?.venueTemplateId
                              }
                              className="rounded-md border border-white/10 bg-black/10 p-3 text-left hover:bg-black/20 hover:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
                                Location
                              </p>
                              <p className="mt-2 text-sm font-bold text-white">
                                {selectedEvent?.venueDetails
                                  ?.venueTemplateName ||
                                  selectedEvent?.cinema ||
                                  "-"}
                              </p>
                              <p className="mt-1 text-xs text-white/55">
                                {selectedEvent?.venueDetails?.location || "-"}
                              </p>
                            </button>
                            <div className="rounded-md border border-white/10 bg-black/10 p-3">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">
                                Capacity
                              </p>
                              <p className="mt-2 text-sm font-bold text-white">
                                {selectedEvent?.totalSeats || 0} seats
                              </p>
                              <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-success bg-success/10 px-2 py-1 rounded-lg font-bold">
                                <span className="material-symbols-outlined text-[12px]">
                                  verified_user
                                </span>
                                Verified
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-black/10 p-3 min-h-[240px]">
                            {seatRowsForPreview.length > 0 ? (
                              <MiniVenueMap
                                rows={seatRowsForPreview}
                                screenLabel={screenLabelForPreview}
                              />
                            ) : loadingVenueTemplate ? (
                              <div className="h-[200px] flex items-center justify-center text-sm text-white/45">
                                Loading venue layout...
                              </div>
                            ) : (
                              <div className="h-[200px] flex items-center justify-center text-sm text-white/45 text-center">
                                No seating layout available.
                              </div>
                            )}
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>

                  <aside className="xl:sticky xl:top-5 space-y-3">
                    <section className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <div className="px-3 py-2 border-b border-white/10 bg-black/10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                          Decision Panel
                        </h4>
                      </div>

                      <div className="p-2.5 space-y-2">
                        <div className="rounded-md border border-white/10 bg-black/10 p-2">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/45 font-bold">
                            Submitted By
                          </p>
                          <p className="mt-1 text-xs font-black text-white">
                            {selectedEvent?.organizationName ||
                              selectedEvent?.submittedByName ||
                              "Organizer"}
                          </p>
                          <p className="mt-1 text-xs text-white/50">
                            {formatTimeAgo(selectedEvent?.createdAt)}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <button className="w-full flex items-center justify-center gap-1.5 border border-white/10 px-3 py-2 rounded-md font-bold text-xs hover:bg-white/5 transition-all">
                            <span className="material-symbols-outlined text-sm">
                              edit_note
                            </span>
                            Request Changes
                          </button>
                          <button
                            className="w-full flex items-center justify-center gap-1.5 bg-primary text-white border border-primary/20 px-3 py-2 rounded-md font-bold text-xs hover:bg-primary/80 transition-all disabled:opacity-50"
                            type="button"
                            disabled={!selectedEvent || isUpdating}
                            onClick={() => handleStatusUpdate("rejected")}>
                            <span className="material-symbols-outlined text-sm">
                              block
                            </span>
                            Reject
                          </button>
                          <button
                            className="w-full flex items-center justify-center gap-1.5 bg-accent text-charcoal px-3 py-2 rounded-md font-black text-xs hover:bg-accent/90 transition-all disabled:opacity-50"
                            type="button"
                            disabled={!selectedEvent || isUpdating}
                            onClick={() => handleStatusUpdate("published")}>
                            <span className="material-symbols-outlined text-sm">
                              publish
                            </span>
                            Publish
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <div className="px-3 py-2 border-b border-white/10 bg-black/10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                          Review Checklist
                        </h4>
                      </div>

                      <div className="p-2.5 space-y-1.5">
                        {[
                          {
                            label: "Poster uploaded",
                            done: Boolean(selectedPoster),
                          },
                          {
                            label: "Description included",
                            done: Boolean(
                              selectedEvent?.movieDetails?.synopsis,
                            ),
                          },
                          {
                            label: "Trailer attached",
                            done: Boolean(selectedEvent?.media?.teaserUrl),
                          },
                          {
                            label: "Gallery provided",
                            done: Boolean(
                              selectedEvent?.media?.galleryImageUrls?.length,
                            ),
                          },
                          {
                            label: "Pricing configured",
                            done: Boolean(selectedPrices.length),
                          },
                          {
                            label: "Venue mapped",
                            done: Boolean(seatRowsForPreview.length),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-black/10 px-2 py-1.5">
                            <span className="text-xs text-white/75">
                              {item.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                item.done
                                  ? "bg-success/10 text-success"
                                  : "bg-white/10 text-white/45"
                              }`}>
                              <span className="material-symbols-outlined text-[10px]">
                                {item.done
                                  ? "check_circle"
                                  : "radio_button_unchecked"}
                              </span>
                              {item.done ? "Ready" : "Missing"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </aside>
                </div>
              </div>
            </main>
          </div>
        </AdminPageFrame>
      </div>
    </>
  );
}
