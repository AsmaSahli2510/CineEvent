import React from "react";
import { Link, useParams } from "react-router-dom";
import { eventById } from "../data/events";

const seatLayout = [
  "ooaaaaaaaaoo",
  "aaaassaaaaaa",
  "aaaaaaaaaaaa",
  "oooaaaaaaooo",
  "aaaaaaaaaaaa",
];

function parsePrice(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

export default function GuestReservationPage() {
  const { eventId } = useParams();
  const event = eventById[eventId];

  if (!event) {
    return (
      <main className="mx-auto max-w-[1440px] px-6 py-20 md:px-20">
        <h2 className="mb-4 text-3xl font-black">Event not found</h2>
        <p className="mb-8 text-white/60">This reservation link is invalid.</p>
        <Link
          className="rounded-xl bg-accent px-6 py-3 font-bold text-charcoal"
          to="/events">
          Back to Events
        </Link>
      </main>
    );
  }

  const ticketCount = 2;
  const ticketSubtotal = parsePrice(event.price) * ticketCount;
  const bookingFee = 12.5;
  const totalAmount = ticketSubtotal + bookingFee;

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
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm border border-white/20 bg-white/10" />{" "}
                    Available
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-accent" /> Selected
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-charcoal/80 opacity-40" />{" "}
                    Occupied
                  </div>
                </div>
              </div>

              <div className="relative mb-12 h-2 w-full rounded-full bg-gradient-to-b from-accent/40 to-transparent">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-accent/60">
                  Stage / Screen
                </span>
              </div>

              <div className="mb-8 grid grid-cols-12 gap-2">
                {seatLayout
                  .join("")
                  .split("")
                  .map((seatType, index) => {
                    const className =
                      seatType === "o"
                        ? "bg-charcoal/80 border-transparent cursor-not-allowed opacity-40"
                        : seatType === "s"
                          ? "bg-accent border-accent text-charcoal"
                          : "bg-white/10 border border-white/20 hover:border-accent hover:bg-accent/20";

                    return (
                      <div
                        className={`aspect-square rounded ${className}`}
                        key={`seat-${index}`}
                      />
                    );
                  })}
              </div>
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
                      Row B, Seats 5, 6
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">
                        Tickets ({ticketCount}x Premium)
                      </span>
                      <span>${ticketSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Booking Fee</span>
                      <span>${bookingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-black">
                      <span>Total Amount</span>
                      <span className="text-accent">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-black text-charcoal shadow-lg shadow-accent/20 transition-all hover:bg-accent/90">
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
