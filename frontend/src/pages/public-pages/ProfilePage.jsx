import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slices/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  if (!currentUser) return null;

  const avatarSrc = currentUser.avatar || buildDefaultAvatar(currentUser.name);

  const wishlist = useMemo(() => currentUser.wishlist || [], [currentUser]);
  const bookingHistory = useMemo(
    () => currentUser.bookingHistory || [],
    [currentUser],
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

              {wishlist.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {wishlist.map((item, index) => {
                    const itemImage = getEventImage(item);
                    const itemTitle = getEventTitle(item);
                    const itemCategory = getEventCategory(item);

                    return (
                      <div
                        key={item._id || item.id || index}
                        className="group overflow-hidden rounded-lg border border-white/10 bg-black/30 transition hover:shadow-lg hover:border-accent/50 cursor-pointer"
                        onClick={() =>
                          navigate(`/events/${item._id || item.id}`)
                        }>
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

              {bookingHistory.length > 0 ? (
                <div className="overflow-hidden rounded-[22px] border border-white/10">
                  <div className="hidden grid-cols-[1.6fr_1fr_1fr_auto] gap-4 bg-white/[0.04] px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white/50 md:grid">
                    <span>Event</span>
                    <span>Date</span>
                    <span>Status</span>
                    <span className="text-right">Action</span>
                  </div>

                  <div className="divide-y divide-white/10">
                    {bookingHistory.map((booking, index) => (
                      <div
                        key={booking._id || booking.id || index}
                        className="grid gap-3 px-5 py-4 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-center md:gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            {booking.eventTitle ||
                              booking.title ||
                              "Cinema Event"}
                          </p>
                          <p className="mt-1 text-sm text-white/50">
                            {booking.location || "Location unavailable"}
                          </p>
                        </div>

                        <div className="text-sm text-white/70">
                          {formatDate(booking.date)}
                        </div>

                        <div>
                          <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                            {booking.status || "Confirmed"}
                          </span>
                        </div>

                        <div className="md:text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/events/${booking.eventId || booking._id || booking.id}`,
                              )
                            }
                            className="text-sm font-semibold text-white/80 transition hover:text-accent">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </main>
  );
}
