import React, { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slices/authSlice";
import { getWishlist, toggleWishlist } from "../../api/wishlistApi";
import { getUserReservations } from "../../api/reservationApi";
import QRCode from "qrcode";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// QRCode component wrapper
const QRCodeDisplay = ({ value, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    }
  }, [value, size]);

  return <canvas ref={canvasRef} />;
};

const buildDefaultAvatar = (name) => {
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=111827&color=f5c065&size=256`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Date unavailable";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getEventImage = (event) => {
  const API_URL = API_BASE_URL.replace("/api", "");

  let image =
    event.movieDetails?.posterUrl ||
    event.movieDetails?.posterDataUrl ||
    event.festivalDetails?.posterUrl ||
    event.festivalDetails?.posterDataUrl ||
    event.image ||
    event.poster ||
    "";

  if (image && !image.startsWith("http") && !image.startsWith("data:")) {
    image = image.startsWith("/")
      ? `${API_URL}${image}`
      : `${API_URL}/${image}`;
  }

  return image;
};

const getEventTitle = (event) => {
  return (
    event.movieDetails?.title ||
    event.festivalDetails?.festivalName ||
    event.title ||
    "Untitled Event"
  );
};

const getEventCategory = (event) => {
  return (
    event.movieDetails?.genre ||
    event.festivalDetails?.category ||
    event.category ||
    "Event"
  );
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState(null);
  const [likedItems, setLikedItems] = useState({}); // Track which items are liked
  const [toppingLoading, setToppingLoading] = useState({}); // Track loading state per item

  // Booking history state
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState(null);

  // Ticket view state
  const [selectedTicket, setSelectedTicket] = useState(null);

  if (!currentUser) return null;

  const avatarSrc = currentUser.avatar || buildDefaultAvatar(currentUser.name);

  // Fetch wishlist on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setWishlistLoading(true);
        setWishlistError(null);
        const data = await getWishlist();
        // Handle response based on structure
        const items = data.wishlist || data.data || [];
        setWishlistItems(items);

        // Initialize all items as liked since they're in the wishlist
        const likedMap = {};
        items.forEach((item) => {
          likedMap[item._id || item.id] = true;
        });
        setLikedItems(likedMap);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistError(error.message || "Failed to fetch wishlist");
        // Fallback to Redux state if API fails
        const fallbackItems = currentUser.wishlist || [];
        setWishlistItems(fallbackItems);

        // Initialize fallback items as liked
        const likedMap = {};
        fallbackItems.forEach((item) => {
          likedMap[item._id || item.id] = true;
        });
        setLikedItems(likedMap);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  // Fetch user reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setReservationsLoading(true);
        setReservationsError(null);
        const data = await getUserReservations();
        console.log("Fetched reservations data:", data);
        setReservations(data.reservations || []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservationsError(error.message || "Failed to fetch reservations");
        setReservations([]);
      } finally {
        setReservationsLoading(false);
      }
    };

    if (currentUser) {
      console.log("Current user:", currentUser);
      fetchReservations();
    }
  }, [currentUser]);

  const wishlist = useMemo(() => wishlistItems, [wishlistItems]);
  const bookingHistory = useMemo(
    () =>
      reservations.length > 0 ? reservations : currentUser.bookingHistory || [],
    [reservations, currentUser],
  );

  const stats = [
    {
      label: "Wishlist",
      value: wishlist.length,
      icon: "favorite",
    },
    {
      label: "Bookings",
      value: bookingHistory.length,
      icon: "confirmation_number",
    },
    {
      label: "Role",
      value: currentUser.role || "Spectator",
      icon: "person",
    },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  const handleWishlistRemove = async (itemId, e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setToppingLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await toggleWishlist(itemId);
      if (response?.success) {
        // Remove item from wishlist
        setWishlistItems((prev) =>
          prev.filter((item) => (item._id || item.id) !== itemId),
        );
        setLikedItems((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setToppingLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left Profile Panel */}
          <aside className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-md">
            <div className="relative h-32 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />
            <div className="relative px-6 pb-6">
              <div className="-mt-12 flex flex-col items-center text-center">
                <img
                  src={avatarSrc}
                  alt="Profile avatar"
                  className="h-24 w-24 rounded-full border-4 border-black object-cover shadow-lg"
                />

                <h1 className="mt-4 text-2xl font-black text-white">
                  {currentUser.name}
                </h1>

                <p className="mt-1 text-sm text-white/60">
                  {currentUser.email}
                </p>

                <span className="mt-4 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {currentUser.role || "Spectator"}
                </span>
              </div>

              <div className="mt-8 grid gap-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-accent">
                        {item.icon}
                      </span>
                      <span className="text-sm text-white/70">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/[0.1]">
                Logout
              </button>
            </div>
          </aside>

          {/* Right Dashboard */}
          <section className="space-y-8">
            {/* Welcome */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md md:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-accent/80">
                Spectator Dashboard
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Welcome back, {currentUser.name?.split(" ")[0] || "Guest"}
              </h2>
              <p className="mt-3 max-w-2xl text-white/65">
                Manage your saved movies, track your bookings, and keep your
                cinema experience organized in one place.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Saved Movies</span>
                  <span className="material-symbols-outlined text-accent">
                    favorite
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">{wishlist.length}</p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Total Bookings</span>
                  <span className="material-symbols-outlined text-accent">
                    local_activity
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {bookingHistory.length}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Account Type</span>
                  <span className="material-symbols-outlined text-accent">
                    workspace_premium
                  </span>
                </div>
                <p className="mt-4 text-xl font-black">
                  {currentUser.role || "Spectator"}
                </p>
              </div>
            </div>

            {/* Wishlist */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">Wishlist</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Movies and events you saved for later.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                  View All
                </button>
              </div>

              {wishlistLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-accent"></div>
                    <p className="text-sm text-white/70">
                      Loading your wishlist...
                    </p>
                  </div>
                </div>
              ) : wishlistError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-red-500/50">
                    error_outline
                  </span>
                  <p className="mt-3 text-white/70">{wishlistError}</p>
                  <button
                    onClick={() => {
                      setWishlistLoading(true);
                      const fetchWishlist = async () => {
                        try {
                          setWishlistError(null);
                          const data = await getWishlist();
                          const items = data.wishlist || data.data || [];
                          setWishlistItems(items);
                        } catch (error) {
                          setWishlistError(
                            error.message || "Failed to fetch wishlist",
                          );
                          setWishlistItems(currentUser.wishlist || []);
                        } finally {
                          setWishlistLoading(false);
                        }
                      };
                      fetchWishlist();
                    }}
                    className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]">
                    Retry
                  </button>
                </div>
              ) : wishlist.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {wishlist.map((item, index) => {
                    const itemImage = getEventImage(item);
                    const itemTitle = getEventTitle(item);
                    const itemCategory = getEventCategory(item);
                    const itemId = item._id || item.id;
                    const isLiked = likedItems[itemId];
                    const isLoading = toppingLoading[itemId];

                    return (
                      <div
                        key={itemId || index}
                        className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30 transition hover:shadow-lg hover:border-accent/50 cursor-pointer"
                        onClick={() => navigate(`/events/${itemId}`)}>
                        <div className="aspect-[2/3] bg-white/5 overflow-hidden">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={itemTitle}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-white/30">
                              <span className="material-symbols-outlined text-2xl">
                                movie
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-2">
                          <h4 className="line-clamp-1 text-xs font-bold text-white truncate">
                            {itemTitle}
                          </h4>
                          <p className="mt-1 line-clamp-1 text-[10px] text-white/60">
                            {itemCategory}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-white/25">
                    favorite
                  </span>
                  <p className="mt-3 text-white/70">Your wishlist is empty.</p>
                  <button
                    onClick={() => navigate("/events")}
                    className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]">
                    Explore Events
                  </button>
                </div>
              )}
            </div>

            {/* Booking History */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    Booking History
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    A record of your past and upcoming reservations.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/bookings")}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                  View All
                </button>
              </div>

              {reservationsLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-accent"></div>
                    <p className="text-sm text-white/70">
                      Loading your booking history...
                    </p>
                  </div>
                </div>
              ) : reservationsError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-red-500/50">
                    error_outline
                  </span>
                  <p className="mt-3 text-white/70">{reservationsError}</p>
                  <button
                    onClick={() => {
                      setReservationsLoading(true);
                      const fetchReservations = async () => {
                        try {
                          setReservationsError(null);
                          const data = await getUserReservations();
                          setReservations(data.reservations || []);
                        } catch (error) {
                          setReservationsError(
                            error.message || "Failed to fetch reservations",
                          );
                          setReservations([]);
                        } finally {
                          setReservationsLoading(false);
                        }
                      };
                      fetchReservations();
                    }}
                    className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]">
                    Retry
                  </button>
                </div>
              ) : reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation, index) => {
                    const eventTitle =
                      reservation.event?.movie?.title ||
                      reservation.event?.title ||
                      reservation.eventTitle ||
                      "Cinema Event";
                    const eventDate =
                      reservation.event?.date || reservation.date;
                    const eventId =
                      reservation.event?._id || reservation.eventId;
                    const status =
                      reservation.paymentStatus === "paid"
                        ? "Confirmed"
                        : reservation.status || "Pending";
                    const seats = reservation.selectedSeats || [];
                    const bookingRef = reservation.bookingReference || "N/A";
                    const totalPrice = reservation.totalPrice || 0;
                    const bookingFee = reservation.bookingFee || 0;
                    const paidAmount = reservation.paidAmount || totalPrice;
                    const paymentMethod =
                      reservation.paymentDetails?.paymentMethod || "Stripe";

                    return (
                      <div
                        key={reservation._id || index}
                        className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]">
                        {/* Header: Event Title and Status */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white">
                              {eventTitle}
                            </h4>
                            <p className="mt-2 text-sm text-white/60">
                              Booking Reference:{" "}
                              <span className="font-mono font-semibold text-accent">
                                {bookingRef}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                              status === "Confirmed"
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : status === "Paid"
                                  ? "border-accent/20 bg-accent/10 text-accent"
                                  : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            }`}>
                            {status}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {/* Date */}
                          <div className="rounded-lg bg-white/[0.03] p-3">
                            <p className="text-xs text-white/50 uppercase tracking-wider">
                              Date
                            </p>
                            <p className="mt-1.5 text-sm font-semibold text-white">
                              {formatDate(eventDate)}
                            </p>
                          </div>

                          {/* Seats */}
                          <div className="rounded-lg bg-white/[0.03] p-3">
                            <p className="text-xs text-white/50 uppercase tracking-wider">
                              Seats ({seats.length})
                            </p>
                            <p className="mt-1.5 text-sm font-semibold text-white">
                              {seats.length > 0 ? seats.join(", ") : "N/A"}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="rounded-lg bg-white/[0.03] p-3">
                            <p className="text-xs text-white/50 uppercase tracking-wider">
                              Original Price
                            </p>
                            <p className="mt-1.5 text-sm font-semibold text-white">
                              {totalPrice.toFixed(2)} TND
                            </p>
                          </div>

                          {/* Total Paid */}
                          <div className="rounded-lg bg-accent/10 p-3 border border-accent/30">
                            <p className="text-xs text-accent/70 uppercase tracking-wider font-semibold">
                              Total Paid
                            </p>
                            <p className="mt-1.5 text-sm font-bold text-accent">
                              {paidAmount.toFixed(2)} TND
                            </p>
                          </div>
                        </div>

                        {/* Payment Method and Action */}
                        <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                          <div className="text-xs text-white/50">
                            Paid by card
                          </div>

                          <button
                            onClick={() => setSelectedTicket(reservation)}
                            className="rounded-lg bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/30">
                            View Ticket
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-white/25">
                    confirmation_number
                  </span>
                  <p className="mt-3 text-white/70">
                    No bookings found in your history.
                  </p>
                  <button
                    onClick={() => navigate("/events")}
                    className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]">
                    Book Your Next Event
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Ticket Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-white">Your Ticket</h2>
              <p className="mt-2 text-sm text-white/60">
                Show this at admission
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              {/* Event Title */}
              <div className="rounded-lg bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Event
                </p>
                <p className="mt-2 text-lg font-bold text-white">
                  {selectedTicket.event?.movie?.title ||
                    selectedTicket.event?.title ||
                    selectedTicket.eventTitle ||
                    "Cinema Event"}
                </p>
              </div>

              {/* Booking Reference */}
              <div className="rounded-lg bg-accent/10 p-4 border border-accent/30">
                <p className="text-xs uppercase tracking-wider text-accent/70 font-semibold">
                  Booking Reference
                </p>
                <p className="mt-2 font-mono text-lg font-bold text-accent">
                  {selectedTicket.bookingReference || "N/A"}
                </p>
              </div>

              {/* Date and Seats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Date
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {formatDate(
                      selectedTicket.event?.date || selectedTicket.date,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Seats
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    {(selectedTicket.selectedSeats || []).length}
                  </p>
                </div>
              </div>

              {/* Seats List */}
              {(selectedTicket.selectedSeats || []).length > 0 && (
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
                    Selected Seats
                  </p>
                  <p className="font-semibold text-white text-sm">
                    {selectedTicket.selectedSeats.join(", ")}
                  </p>
                </div>
              )}

              {/* Price Info */}
              <div className="rounded-lg bg-white/[0.05] p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Total Paid
                </p>
                <p className="mt-2 text-xl font-bold text-accent">
                  {(
                    selectedTicket.paidAmount ||
                    selectedTicket.totalPrice ||
                    0
                  ).toFixed(2)}{" "}
                  TND
                </p>
              </div>

              {/* QR Code */}
              <div className="mt-6 flex flex-col items-center">
                <div className="rounded-lg bg-white p-4">
                  <QRCodeDisplay
                    value={JSON.stringify({
                      bookingRef: selectedTicket.bookingReference,
                      event:
                        selectedTicket.event?.movie?.title ||
                        selectedTicket.event?.title ||
                        selectedTicket.eventTitle,
                      date: selectedTicket.event?.date || selectedTicket.date,
                      seats: (selectedTicket.selectedSeats || []).join(", "),
                      amount:
                        selectedTicket.paidAmount || selectedTicket.totalPrice,
                    })}
                    size={200}
                  />
                </div>
                <p className="mt-3 text-xs text-white/60">
                  Scan for verification
                </p>
              </div>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="mt-6 w-full rounded-lg bg-accent px-4 py-3 font-semibold text-black transition hover:bg-accent/90">
                Print Ticket
              </button>

              {/* Close Button */}
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full rounded-lg bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/20">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
