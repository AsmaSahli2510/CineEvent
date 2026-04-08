import React, { useEffect, useState, useMemo } from "react";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getOrganizerReservations } from "../../api/reservationApi";

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

function statusBadgeClass(status) {
  switch (status) {
    case "confirmed":
      return "bg-green-500/20 border border-green-400/60 text-green-300";
    case "pending":
      return "bg-amber-500/20 border border-amber-400/60 text-amber-200";
    case "cancelled":
      return "bg-red-500/20 border border-red-400/60 text-red-300";
    default:
      return "bg-white/10 border border-white/20 text-white/80";
  }
}

function normalizeImagePath(imagePath) {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  return `${API_BASE_URL}/${imagePath}`;
}

export default function ReservationsListPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const LIMIT = 20;

  useEffect(() => {
    loadReservations();
  }, [page, statusFilter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const status = statusFilter !== "all" ? statusFilter : undefined;
      const data = await getOrganizerReservations(page, LIMIT, status);

      setReservations(Array.isArray(data.reservations) ? data.reservations : []);

      // Calculate total pages
      if (data.pagination) {
        const total = data.pagination.total || 0;
        const calculated = Math.ceil(total / LIMIT);
        setTotalPages(calculated || 1);
      }
    } catch (loadError) {
      console.error("Failed to load organizer reservations:", loadError);
      setError(
        loadError.message || "Failed to load reservations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Group reservations by event
  const groupedReservations = useMemo(() => {
    const groups = {};
    reservations.forEach((reservation) => {
      if (reservation.event) {
        const eventId = reservation.event._id;
        const eventTitle = reservation.event.movieDetails?.title 
          || reservation.event.festivalDetails?.festivalName 
          || "Untitled Event";
        const eventDate = reservation.event.date;
        const eventTime = reservation.event.startTime;

        const key = `${eventId}__${eventDate}__${eventTime}`;

        if (!groups[key]) {
          groups[key] = {
            eventId,
            eventTitle,
            eventDate,
            eventTime,
            eventPoster: normalizeImagePath(
              reservation.event.movieDetails?.posterUrl ||
              reservation.event.festivalDetails?.posterUrl
            ),
            cinema: reservation.event.cinema,
            hall: reservation.event.hall,
            reservations: [],
          };
        }

        groups[key].reservations.push(reservation);
      }
    });

    return Object.values(groups).sort(
      (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
    );
  }, [reservations]);

  // Filter grouped reservations by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedReservations;

    const query = searchQuery.toLowerCase();
    return groupedReservations.filter(
      (group) =>
        group.eventTitle.toLowerCase().includes(query) ||
        group.cinema.toLowerCase().includes(query) ||
        group.hall.toLowerCase().includes(query)
    );
  }, [groupedReservations, searchQuery]);

  const totalSeatsReserved = reservations.reduce((sum, res) => sum + (res.selectedSeats?.length || 0), 0);
  const totalRevenue = reservations.reduce((sum, res) => sum + (Number(res.totalPrice) || 0), 0);

  return (
    <OrganizerPageFrame
      title="Reservations"
      subtitle="Manage and view all reservations for your events"
    >
      <div className="space-y-8">
        <style>{`
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: border-color 0.2s ease;
          }
          .stat-card:hover {
            border-color: #30161C;
          }
          .revenue-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: border-color 0.2s ease;
          }
          .revenue-card:hover {
            border-color: #30161C;
          }
          .event-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: border-color 0.2s ease;
          }
          .event-card:hover {
            border-color: #30161C;
          }
          .filter-btn-active {
            background: rgba(220, 38, 38, 0.8);
            border-color: #30161C;
          }
        `}</style>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="stat-card rounded-lg p-6">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Total Reservations</div>
            <div className="text-4xl font-black text-white">{reservations.length}</div>
            <div className="mt-3 text-white/30 text-xs">Across all events</div>
          </div>

          <div className="stat-card rounded-lg p-6">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Active Events</div>
            <div className="text-4xl font-black text-white">{groupedReservations.length}</div>
            <div className="mt-3 text-white/30 text-xs">With bookings</div>
          </div>

          <div className="stat-card rounded-lg p-6">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Seats Booked</div>
            <div className="text-4xl font-black text-white">{totalSeatsReserved}</div>
            <div className="mt-3 text-white/30 text-xs">Total capacity</div>
          </div>

          <div className="revenue-card rounded-lg p-6">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Total Revenue</div>
            <div className="text-4xl font-black text-white">{totalRevenue} TND</div>
            <div className="mt-3 text-white/30 text-xs">Generated</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search events, cinemas, or halls..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-5 py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#30161C] focus:bg-white/8 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                  statusFilter === status
                    ? "filter-btn-active text-white"
                    : "bg-white/8 border border-white/15 text-white/70 hover:bg-white/12 hover:border-white/25"
                }`}
              >
                {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-4 text-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-white/20 border-t-red-600 animate-spin" />
              <div className="text-white/60 font-medium text-sm">Loading reservations...</div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredGroups.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-white/40 font-medium mb-2">No reservations found</div>
            <div className="text-white/30 text-sm">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "You don't have any reservations yet"}
            </div>
          </div>
        )}

        {/* Events List */}
        {!loading && filteredGroups.map((group) => (
          <div
            key={group.eventId}
            className="event-card rounded-lg overflow-hidden"
          >
            {/* Event Header - Clickable */}
            <div 
              onClick={() => setExpandedEventId(expandedEventId === group.eventId ? null : group.eventId)}
              className="p-6 cursor-pointer hover:bg-white/8 transition-all border-b border-white/10"
            >
              <div className="flex gap-6 items-start">
                {/* Poster */}
                {group.eventPoster && (
                  <div className="flex-shrink-0">
                    <img
                      src={group.eventPoster}
                      alt={group.eventTitle}
                      className="w-20 h-28 object-cover rounded border border-white/20"
                    />
                  </div>
                )}

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white truncate">{group.eventTitle}</h3>
                      <p className="text-white/40 text-sm mt-1">{group.cinema} • Hall {group.hall}</p>
                    </div>
                    <button className="flex-shrink-0 text-white/50 hover:text-white/70 transition-colors text-lg font-semibold">
                      {expandedEventId === group.eventId ? "−" : "+"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Date & Time</p>
                      <p className="text-white font-medium text-sm">{formatDateTime(group.eventDate, group.eventTime)}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Total Reservations</p>
                      <p className="text-white font-black text-sm">{group.reservations.length}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Seats</p>
                      <p className="text-white font-medium text-sm">{group.reservations.reduce((sum, r) => sum + (r.selectedSeats?.length || 0), 0)}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Revenue</p>
                      <p className="text-white font-semibold text-sm">{group.reservations.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0)} TND</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Reservations Table */}
            {expandedEventId === group.eventId && (
              <div className="border-t border-white/10 bg-black/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black/60 border-b border-white/10">
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Guest Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white/50 uppercase tracking-wider">Seats</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-white/50 uppercase tracking-wider">Total Price</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white/50 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/50 uppercase tracking-wider">Booking Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {group.reservations.map((reservation) => (
                        <tr key={reservation._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{reservation.user?.name || reservation.guestInfo?.fullName || "Guest"}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white/60 font-medium">{reservation.user?.email || reservation.guestInfo?.email || "-"}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-white font-semibold">
                              {reservation.selectedSeats?.length > 0 
                                ? reservation.selectedSeats.join(", ") 
                                : reservation.seats || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-white font-bold">{reservation.totalPrice} TND</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1.5 rounded text-xs font-semibold ${statusBadgeClass(reservation.status)}`}>
                              {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1) || "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/40 font-medium">{new Date(reservation.createdAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8 py-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                      page === pageNum
                        ? "bg-red-700 text-white border border-[#30161C]"
                        : "bg-white/10 border border-white/20 hover:bg-white/15 text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </OrganizerPageFrame>
  );
}
