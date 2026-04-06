import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../../api/eventApi";

const SEAT_COLOR_CLASS = {
  standard: "bg-white/60 border-white/30",
  premium: "bg-primary/90 border-primary/60",
  vip: "bg-accent border-accent/60",
  accessible: "bg-pmr-green border-pmr-green/60",
  bench: "bg-amber-400 border-amber-500/60",
};

const SEAT_COLOR_CLASS_SELECTED = {
  standard: "bg-accent border-accent ring-2 ring-accent",
  premium: "bg-accent border-accent ring-2 ring-accent",
  vip: "bg-accent border-accent ring-2 ring-accent",
  accessible: "bg-accent border-accent ring-2 ring-accent",
  bench: "bg-accent border-accent ring-2 ring-accent",
};

const ROW_TEXT_CLASS = {
  standard: "text-white",
  premium: "text-primary",
  vip: "text-accent",
  accessible: "text-pmr-green",
  bench: "text-amber-300",
};

function getSeatTypeFromRow(row, seatNumber) {
  const seatOverrides = row?.seatOverrides || {};
  if (Object.prototype.hasOwnProperty.call(seatOverrides, seatNumber)) {
    return seatOverrides[seatNumber];
  }
  const wheelchairSeats = Math.max(0, Number(row?.wheelchair) || 0);
  if (seatNumber <= wheelchairSeats) {
    return "accessible";
  }
  return row?.zoneId || "standard";
}

function parsePrice(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

export default function GuestReservationPage() {
  const { eventId } = useParams();
  const { currentUser } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [venueTemplate, setVenueTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  // Auto-fill with current user info if logged in
  useEffect(() => {
    if (currentUser) {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: currentUser.displayName || currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchEventAndVenue = async () => {
      try {
        setLoading(true);
        setError("");
        const backendEvent = await getEventById(eventId);

        // Transform backend event data to match expected format
        const transformedEvent = {
          id: backendEvent._id,
          title:
            backendEvent.movieDetails?.title ||
            backendEvent.festivalDetails?.festivalName ||
            "Untitled Event",
          price:
            backendEvent.pricingDetails?.singlePrice || backendEvent.price || 0,
          image:
            backendEvent.movieDetails?.posterUrl ||
            backendEvent.festivalDetails?.posterUrl ||
            "",
          fullDate: backendEvent.date
            ? new Date(backendEvent.date).toLocaleDateString()
            : "Date TBA",
          location:
            backendEvent.venueDetails?.name ||
            backendEvent.cinema ||
            "Location TBA",
        };

        setEvent(transformedEvent);

        // Use venue snapshot from event if available
        if (backendEvent.venueSnapshot) {
          setVenueTemplate(backendEvent.venueSnapshot);
        }
      } catch (err) {
        setError(err.message || "Failed to load event");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventAndVenue();
    }
  }, [eventId]);

  const ticketCount = selectedSeats.length;
  const ticketSubtotal = parsePrice(event?.price || 0) * ticketCount;
  const bookingFee = ticketCount > 0 ? 12.5 : 0;
  const totalAmount = ticketSubtotal + bookingFee;

  const selectedSeatsDisplay =
    selectedSeats.length > 0
      ? selectedSeats.slice(0, 3).join(", ") +
        (selectedSeats.length > 3 ? `...+${selectedSeats.length - 3}` : "")
      : "No seats selected";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark text-white">
        <div className="text-center">
          <p className="text-lg font-medium">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-[1440px] px-6 py-20 md:px-20">
        <h2 className="mb-4 text-3xl font-black">Event not found</h2>
        <p className="mb-8 text-white/60">
          {error || "This reservation link is invalid."}
        </p>
        <Link
          className="rounded-xl bg-accent px-6 py-3 font-bold text-charcoal"
          to="/events">
          Back to Events
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background-dark/95 px-6 py-4 backdrop-blur-md md:px-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-accent">
              <span className="material-symbols-outlined text-4xl">
                movie_filter
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              CINÉ<span className="text-accent">EVENT</span>
            </h1>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <div className="flex items-center gap-2 text-accent">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent text-[10px]">
                1
              </span>
              Selection
            </div>
            <div className="h-px w-8 bg-white/20" />
            <div className="flex items-center gap-2 text-white/40">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px]">
                2
              </span>
              Payment
            </div>
            <div className="h-px w-8 bg-white/20" />
            <div className="flex items-center gap-2 text-white/40">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px]">
                3
              </span>
              Confirmation
            </div>
          </div>
          <Link
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
            to={`/events/${event.id}`}>
            <span className="material-symbols-outlined text-sm">close</span>
            Cancel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-12 md:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <div>
              <h2 className="mb-2 text-4xl font-black">
                Quick Guest Reservation
              </h2>
              <p className="text-white/60">
                No account needed. Secure your tickets for{" "}
                <span className="text-accent">{event.title}</span> in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-accent">
                    chair
                  </span>
                  Select Your Seats
                </h3>
              </div>

              {/* Seat Legend */}
              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border border-white/30 bg-white/60" />
                  <span className="text-white/70">Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border border-primary/60 bg-primary/90" />
                  <span className="text-white/70">Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border border-accent/60 bg-accent" />
                  <span className="text-white/70">VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border border-pmr-green/60 bg-pmr-green" />
                  <span className="text-white/70">Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border border-amber-500/60 bg-amber-400" />
                  <span className="text-white/70">Bench</span>
                </div>
              </div>

              {venueTemplate?.screenLabel && (
                <div className="relative mb-8 h-2 w-full rounded-full bg-gradient-to-b from-accent/40 to-transparent">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-accent/60">
                    {venueTemplate.screenLabel}
                  </span>
                </div>
              )}

              {venueTemplate?.rows && venueTemplate.rows.length > 0 ? (
                <div className="space-y-0">
                  {venueTemplate.rows.map((row, rowIndex) => {
                    const zone = (() => {
                      const seatCount = Math.max(1, Number(row?.seats) || 1);
                      const counts = {};
                      for (
                        let seatNumber = 1;
                        seatNumber <= seatCount;
                        seatNumber += 1
                      ) {
                        const seatType = getSeatTypeFromRow(row, seatNumber);
                        counts[seatType] = (counts[seatType] || 0) + 1;
                      }
                      return (
                        Object.entries(counts).sort(
                          (a, b) => b[1] - a[1],
                        )[0]?.[0] || "standard"
                      );
                    })();

                    return (
                      <div
                        key={`row-${row.id || row.label || rowIndex}`}
                        className={`rounded-lg border transition-all ${
                          !selectedSeats.some((s) =>
                            s.startsWith((row.id || row.label) + "-"),
                          )
                            ? "border-transparent bg-transparent hover:border-white/15 hover:bg-white/5"
                            : "border-accent/60 bg-accent/10"
                        } p-4`}>
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 flex-shrink-0 text-center font-mono font-black leading-none text-sm ${ROW_TEXT_CLASS[zone] || "text-white"}`}>
                            {row.label || String.fromCharCode(65 + rowIndex)}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {Array.from({ length: row.seats }).map(
                              (_, seatIndex) => {
                                const seatNumber = seatIndex + 1;
                                const seatType = getSeatTypeFromRow(
                                  row,
                                  seatNumber,
                                );
                                const seatId = `${row.id || row.label}-${seatNumber}`;
                                const isSelected =
                                  selectedSeats.includes(seatId);

                                return (
                                  <button
                                    key={seatId}
                                    onClick={() => {
                                      setSelectedSeats((prev) =>
                                        prev.includes(seatId)
                                          ? prev.filter((s) => s !== seatId)
                                          : [...prev, seatId],
                                      );
                                    }}
                                    className={`h-7 w-7 rounded-t-md border text-[9px] font-bold transition-all ${
                                      isSelected
                                        ? SEAT_COLOR_CLASS_SELECTED[seatType] ||
                                          SEAT_COLOR_CLASS_SELECTED.standard
                                        : SEAT_COLOR_CLASS[seatType] ||
                                          SEAT_COLOR_CLASS.standard
                                    }`}
                                    title={`${row.label || String.fromCharCode(65 + rowIndex)}-${seatNumber}`}
                                  />
                                );
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/20 px-6 py-8 text-center text-white/40">
                  <p>Seat layout not available for this event</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <h3 className="mb-6 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-accent">
                  person_outline
                </span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                    placeholder="John Doe"
                    type="text"
                    value={guestInfo.fullName}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    value={guestInfo.phoneNumber}
                    onChange={(e) =>
                      setGuestInfo({
                        ...guestInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                    placeholder="john@example.com"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, email: e.target.value })
                    }
                  />
                  <p className="text-[10px] italic text-white/30">
                    Your tickets and receipt will be sent to this email.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <h3 className="mb-6 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-accent">
                  payments
                </span>
                Payment Method
              </h3>

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="relative flex cursor-pointer items-center rounded-xl border-2 border-accent bg-accent/5 p-4">
                  <input
                    checked
                    className="hidden"
                    name="payment"
                    readOnly
                    type="radio"
                  />
                  <span className="material-symbols-outlined mr-3 text-accent">
                    credit_card
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Credit Card</span>
                    <span className="text-[10px] text-white/60">
                      Visa, Mastercard, Amex
                    </span>
                  </div>
                  <span className="material-symbols-outlined ml-auto text-accent">
                    check_circle
                  </span>
                </label>
                <label className="relative flex cursor-pointer items-center rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                  <input className="hidden" name="payment" type="radio" />
                  <span className="material-symbols-outlined mr-3 text-white/40">
                    account_balance_wallet
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Digital Wallet</span>
                    <span className="text-[10px] text-white/60">
                      Apple Pay, Google Pay
                    </span>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Card Number
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                    placeholder="**** **** **** ****"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                      Expiry
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                      placeholder="MM / YY"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                      CVC
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-accent focus:ring-accent"
                      placeholder="123"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-primary/40 bg-primary/20">
                <div
                  className="relative h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                      Selected Event
                    </span>
                    <h4 className="text-xl font-bold">{event.title}</h4>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="material-symbols-outlined text-sm text-accent">
                        calendar_today
                      </span>
                      {event.fullDate}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="material-symbols-outlined text-sm text-accent">
                        location_on
                      </span>
                      {event.location}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <span className="material-symbols-outlined text-sm text-accent">
                        chair
                      </span>
                      {selectedSeatsDisplay}
                    </div>
                    {guestInfo.fullName && (
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <span className="material-symbols-outlined text-sm text-accent">
                          person
                        </span>
                        {guestInfo.fullName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">
                        Tickets ({ticketCount}x Premium)
                      </span>
                      <span>{ticketSubtotal.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Booking Fee</span>
                      <span>{bookingFee.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-black">
                      <span>Total Amount</span>
                      <span className="text-accent">
                        {totalAmount.toFixed(2)} TND
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={
                      selectedSeats.length === 0 ||
                      !guestInfo.fullName ||
                      !guestInfo.email
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-black text-charcoal shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined">lock</span>
                    Confirm Reservation
                  </button>
                  <p className="text-center text-[10px] text-white/40">
                    By clicking confirm, you agree to our Terms and Privacy
                    Policy.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl text-accent">
                    verified_user
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter text-white/60">
                    SSL Secure
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl text-accent">
                    confirmation_number
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter text-white/60">
                    Instant Entry
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-xl text-accent">
                    support_agent
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter text-white/60">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-white/5 bg-charcoal px-6 py-12 text-white/40 md:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3 opacity-60">
            <div className="text-accent">
              <span className="material-symbols-outlined text-2xl">
                movie_filter
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white">
              CINÉ<span className="text-accent">EVENT</span>
            </h1>
          </div>
          <p className="text-xs">
            © 2024 CinéEvent International. Secure Reservation System.
          </p>
          <div className="flex gap-6 text-xs font-medium">
            <a className="transition-colors hover:text-white" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
