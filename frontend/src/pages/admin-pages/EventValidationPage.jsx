import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import { getEvents, updateEvent } from "../../api/eventApi";
import { getPublishedVenueTemplateById } from "../../api/venueTemplateApi";
import MiniVenueMap from "../../components/organizer/MiniVenueMap";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

function formatTimeAgo(dateValue) {
  if (!dateValue) {
    return "Recently";
  }

  const eventDate = new Date(dateValue).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - eventDate) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  // Handle youtube.com/watch?v=XXX
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // Handle youtu.be/XXX
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // Handle youtube.com/embed/XXX
  if (url.includes("youtube.com/embed/")) return url;

  return null;
}

function getVimeoEmbedUrl(url) {
  if (!url) return null;

  // Handle vimeo.com/XXX
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;

  // Handle player.vimeo.com/video/XXX
  if (url.includes("vimeo.com/video/")) return url;

  return null;
}

function resolvePoster(event) {
  const rawPoster =
    event?.movieDetails?.posterUrl ||
    event?.movieDetails?.posterDataUrl ||
    event?.movie?.poster ||
    "";

  if (!rawPoster) {
    return "";
  }

  if (
    rawPoster.startsWith("http://") ||
    rawPoster.startsWith("https://") ||
    rawPoster.startsWith("data:") ||
    rawPoster.startsWith("blob:")
  ) {
    return rawPoster;
  }

  if (rawPoster.startsWith("/")) {
    return `${API_BASE_URL}${rawPoster}`;
  }

  return `${API_BASE_URL}/${rawPoster}`;
}

function getPriceRows(event) {
  const details = event?.pricingDetails || {};
  if (details?.isFreeEvent) {
    return [{ label: "Free Admission", value: "Free" }];
  }

  if (details?.pricingMode === "byCategory") {
    return [
      {
        label: "Standard Admission",
        value: `${Number(details?.categories?.normal || 0).toFixed(3)} TND`,
      },
      {
        label: "Student",
        value: `${Number(details?.categories?.student || 0).toFixed(3)} TND`,
      },
      {
        label: "Senior",
        value: `${Number(details?.categories?.senior || 0).toFixed(3)} TND`,
      },
    ];
  }

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
        background: rgba(245, 192, 101, 0.05);
      }
`;

export default function EventValidationPage() {
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
    if (!query) {
      return events;
    }

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
    if (!selectedEvent?._id) {
      return;
    }

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
        if (!isMounted) {
          return;
        }

        setSelectedVenueTemplate(result?.template || null);
      } catch {
        if (isMounted) {
          setSelectedVenueTemplate(null);
        }
      } finally {
        if (isMounted) {
          setLoadingVenueTemplate(false);
        }
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
                  <div className="rounded-xl border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent p-5">
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
                <div className="h-full w-full rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white/0 to-transparent p-6 flex flex-col items-center justify-center text-center">
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
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                      <p className="text-[11px] uppercase tracking-wider text-white/45">
                        Queue Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-accent">
                        0 pending submissions
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
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
            <aside className="hidden w-64 flex-shrink-0 bg-charcoal border-r border-white/5 flex-col">
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">
                      movie_filter
                    </span>
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-white uppercase">
                    CINÉ<span className="text-accent">ADMIN</span>
                  </h1>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/dashboard">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                  to="/admin/events/validation">
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  <span className="font-medium">Validation Queue</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/comments/moderation">
                  <span className="material-symbols-outlined">flag</span>
                  <span className="font-medium">Moderation</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/organizers/validation">
                  <span className="material-symbols-outlined">group</span>
                  <span className="font-medium">Organizers</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/statistics">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="font-medium">Statistics</span>
                </Link>
              </nav>

              <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                      AD
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Admin Panel</p>
                      <p className="text-white/40 italic text-[10px]">
                        Super Admin
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            <aside className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col bg-black/20">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Awaiting Review ({filteredEvents.length})
                </h2>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    search
                  </span>
                  <input
                    className="w-full bg-white/5 border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[11px] focus:border-accent focus:ring-0"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    type="text"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {loading ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Loading pending submissions...
                  </div>
                ) : null}

                {!loading && error ? (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                ) : null}

                {!loading && !error && filteredEvents.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    No pending event submissions found.
                  </div>
                ) : null}

                {!loading && !error
                  ? filteredEvents.map((event) => {
                      const isSelected =
                        (selectedEvent?._id || selectedId) === event._id;
                      return (
                        <button
                          key={event._id}
                          onClick={() => setSelectedId(event._id)}
                          type="button"
                          className={`event-card w-full text-left border p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                            isSelected
                              ? "active border-white/10"
                              : "border-white/5"
                          }`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/60 border border-white/10 uppercase tracking-tighter">
                              Pending Review
                            </span>
                            <span className="text-[10px] text-white/40">
                              {formatTimeAgo(event.createdAt)}
                            </span>
                          </div>
                          <h3
                            className={`text-xs font-bold mb-1 ${
                              isSelected ? "text-accent" : "text-white/90"
                            }`}>
                            {event?.movieDetails?.title || "Untitled Event"}
                          </h3>
                          <p className="text-xs text-white/60 mb-3 truncate">
                            {(event?.venueDetails?.venueTemplateName ||
                              event?.cinema ||
                              "Venue") +
                              " • " +
                              (event?.venueDetails?.venueType || "Event")}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/45 overflow-hidden">
                              {resolvePoster(event) ? (
                                <div
                                  className="h-full w-full bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url('${resolvePoster(event)}')`,
                                    backgroundPosition: "top center",
                                  }}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-[11px]">
                                  image
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 font-medium truncate">
                              {event?.organizationName ||
                                event?.submittedByName ||
                                "Organizer"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  : null}
              </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-charcoal/50 border-b border-white/5 p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white/40">
                    chevron_left
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">
                    Review Submission:{" "}
                    {selectedEvent?.movieDetails?.title || "-"}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-white/5 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      edit_note
                    </span>
                    Request Changes
                  </button>
                  <button
                    className="flex items-center gap-1.5 bg-primary text-white border border-primary/20 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-primary/80 transition-all disabled:opacity-50"
                    type="button"
                    disabled={!selectedEvent || isUpdating}
                    onClick={() => handleStatusUpdate("rejected")}>
                    <span className="material-symbols-outlined text-sm">
                      block
                    </span>
                    Reject Submission
                  </button>
                  <button
                    className="flex items-center gap-1.5 bg-accent text-charcoal px-4 py-1.5 rounded-lg font-black text-xs hover:bg-accent/90 transition-all disabled:opacity-50"
                    type="button"
                    disabled={!selectedEvent || isUpdating}
                    onClick={() => handleStatusUpdate("published")}>
                    <span className="material-symbols-outlined text-sm">
                      publish
                    </span>
                    Publish Event
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-5 max-w-5xl mx-auto space-y-6">
                  {actionError ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {actionError}
                    </div>
                  ) : null}
                  <section>
                    <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black mb-1.5">
                            {selectedEvent?.movieDetails?.title ||
                              "No Selected Event"}
                          </h3>
                          <div className="flex gap-3 text-xs text-white/80">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                calendar_today
                              </span>{" "}
                              {selectedEvent
                                ? formatDateTime(selectedEvent.date)
                                : "-"}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                schedule
                              </span>{" "}
                              {selectedEvent?.startTime || "-"}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                location_on
                              </span>{" "}
                              {selectedEvent?.venueDetails?.venueTemplateName ||
                                selectedEvent?.cinema ||
                                "-"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-accent/20 backdrop-blur-md border border-accent/30 p-3 rounded-lg text-center min-w-[100px]">
                          <p className="text-[10px] text-accent uppercase font-black tracking-widest">
                            Base Price
                          </p>
                          <p className="text-xl font-black text-accent">
                            {selectedPrices[0]?.value || "0.000 TND"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[320px] w-full rounded-xl overflow-hidden mb-4 group">
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

                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-2 space-y-5">
                        <div>
                          <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                            Event Description
                          </h4>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 leading-relaxed text-sm text-white/80 space-y-3">
                            <p>
                              {selectedEvent?.movieDetails?.synopsis ||
                                "No synopsis provided for this submission."}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                              Pricing Tiers
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                              {selectedPrices.map((row, index) => (
                                <div
                                  key={`${row.label}-${index}`}
                                  className={`flex justify-between items-center ${
                                    index < selectedPrices.length - 1
                                      ? "pb-3 border-b border-white/5"
                                      : ""
                                  }`}>
                                  <span className="text-sm font-bold text-white/60">
                                    {row.label}
                                  </span>
                                  <span
                                    className={`text-sm font-black ${
                                      index === 0 ? "text-accent" : ""
                                    }`}>
                                    {row.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                              Venue Info
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2.5">
                              <p className="text-sm font-bold">
                                {selectedEvent?.venueDetails
                                  ?.venueTemplateName ||
                                  selectedEvent?.cinema ||
                                  "-"}
                              </p>
                              <p className="text-xs text-white/60">
                                {selectedEvent?.venueDetails?.location || "-"}
                              </p>
                              <div className="pt-3">
                                <span className="flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-1 rounded-lg w-fit">
                                  <span className="material-symbols-outlined text-[14px]">
                                    verified_user
                                  </span>
                                  Verified Venue
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                          Seating Plan
                        </h4>
                        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
                          {loadingVenueTemplate &&
                          seatRowsForPreview.length === 0 ? (
                            <div className="rounded-lg border border-white/10 bg-background-dark px-3 py-2 text-[10px] text-white/55">
                              Loading selected layout...
                            </div>
                          ) : (
                            <div className="w-full">
                              <MiniVenueMap
                                rows={seatRowsForPreview}
                                screenLabel={screenLabelForPreview}
                              />
                            </div>
                          )}

                          <p className="text-[10px] text-white/45 italic text-center">
                            {selectedVenueTemplate?.name || "Selected Layout"} •{" "}
                            {selectedEvent?.totalSeats || 0} Total Capacity
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-white/75">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                              <span>Premium</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                              <span>VIP</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-pmr-green" />
                              <span>Accessible</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-2.5 w-2.5 rounded-full bg-white/60" />
                              <span>Standard</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                          Gallery Media
                        </h4>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          {selectedEvent?.media?.galleryImageUrls &&
                          selectedEvent.media.galleryImageUrls.length > 0 ? (
                            <div className="grid grid-cols-4 gap-3">
                              {selectedEvent.media.galleryImageUrls.map(
                                (imageUrl, index) => (
                                  <div
                                    key={index}
                                    className="relative group rounded-lg overflow-hidden aspect-square border border-white/10 bg-black/30">
                                    <img
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      src={imageUrl}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="material-symbols-outlined text-white text-2xl">
                                        image
                                      </span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-8 text-white/40">
                              <span className="material-symbols-outlined mr-2">
                                image
                              </span>
                              <span className="text-sm">
                                No gallery images uploaded
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-black uppercase text-accent tracking-widest mb-3">
                          Teaser / Trailer
                        </h4>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          {selectedEvent?.media?.teaserUrl ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg border border-white/10">
                                <span className="material-symbols-outlined text-accent text-lg">
                                  link
                                </span>
                                <a
                                  href={selectedEvent.media.teaserUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-accent hover:underline truncate flex-1">
                                  {selectedEvent.media.teaserUrl}
                                </a>
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
                                  <div className="flex items-center justify-center h-40 text-white/40">
                                    <div className="text-center space-y-2">
                                      <span className="material-symbols-outlined text-4xl block">
                                        play_circle
                                      </span>
                                      <span className="text-sm">
                                        Click link to view teaser (supported
                                        platforms: YouTube, Vimeo)
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-8 text-white/40">
                              <span className="material-symbols-outlined mr-2">
                                play_circle
                              </span>
                              <span className="text-sm">
                                No teaser URL provided
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            <aside className="w-80 flex-shrink-0 bg-charcoal border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="p-6 border-b border-white/5">
                <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-6">
                  Organizer Profile
                </h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl border border-accent/20 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/35">
                    <span className="material-symbols-outlined text-2xl">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {selectedEvent?.organizationName ||
                        selectedEvent?.submittedByName ||
                        "Organizer"}
                    </p>
                    <p className="text-xs text-white/40 italic">
                      Submitted {formatTimeAgo(selectedEvent?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <p className="text-[10px] font-bold text-white/40 uppercase">
                      Past Events
                    </p>
                    <p className="text-lg font-black">{events.length}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <p className="text-[10px] font-bold text-white/40 uppercase">
                      Rating
                    </p>
                    <p className="text-lg font-black text-accent">4.9/5</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-[10px] text-success font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>
                    Trusted Partner Status
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-6">
                  Validation Checklist
                </h4>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      defaultChecked
                      className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                      type="checkbox"
                    />
                    <div>
                      <p className="text-sm font-bold leading-none mb-1">
                        Media Quality
                      </p>
                      <p className="text-[10px] text-white/40">
                        Hero images &amp; trailers meet UHD standards.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      defaultChecked
                      className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                      type="checkbox"
                    />
                    <div>
                      <p className="text-sm font-bold leading-none mb-1">
                        Pricing Range
                      </p>
                      <p className="text-[10px] text-white/40">
                        Fees are within platform-approved margins.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                      type="checkbox"
                    />
                    <div>
                      <p className="text-sm font-bold leading-none mb-1">
                        Legal Compliance
                      </p>
                      <p className="text-[10px] text-white/40">
                        Terms and licensing documentation present.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                      type="checkbox"
                    />
                    <div>
                      <p className="text-sm font-bold leading-none mb-1">
                        Venue Booking
                      </p>
                      <p className="text-[10px] text-white/40">
                        Confirmation of space from Grand Cinema.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mt-10">
                  <h4 className="text-xs font-black uppercase text-white/40 tracking-widest mb-4">
                    Internal Notes
                  </h4>
                  <textarea
                    className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-xs h-32 focus:border-accent focus:ring-0"
                    placeholder="Add a note for other administrators..."
                  />
                </div>
              </div>
            </aside>
          </div>
        </AdminPageFrame>
      </div>
    </>
  );
}
