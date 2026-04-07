import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";

export default function ReservationConfirmationPage() {
  const { reservationId } = useParams();
  const location = useLocation();
  const state = location.state;

  if (!state || !state.bookingReference) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark px-6">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-black text-white">
            Confirmation Not Found
          </h1>
          <p className="mb-8 text-white/60">
            We couldn't find confirmation details for your reservation.
          </p>
          <Link
            to="/events"
            className="rounded-xl bg-accent px-6 py-3 font-bold text-charcoal">
            Back to Events
          </Link>
        </div>
      </div>
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
          <Link
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
            to="/events">
            <span className="material-symbols-outlined text-sm">close</span>
            Close
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20 md:px-20">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <span className="material-symbols-outlined text-5xl text-green-400">
                check_circle
              </span>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-black">Reservation Confirmed!</h1>
          <p className="text-lg text-white/70">
            Your tickets have been reserved and a confirmation email has been
            sent to <span className="font-semibold">{state.email}</span>
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="space-y-6">
          {/* Booking Reference Card */}
          <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-8">
            <div className="mb-4 text-sm font-bold uppercase tracking-wider text-green-400">
              Booking Reference
            </div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-3xl font-black text-accent">
                {state.bookingReference}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(state.bookingReference);
                  alert("Booking reference copied!");
                }}
                className="flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/30">
                <span className="material-symbols-outlined text-base">
                  content_copy
                </span>
                Copy
              </button>
            </div>
            <p className="mt-4 text-[10px] text-white/60">
              Save this reference for your records. You'll need it for check-in.
            </p>
          </div>

          {/* Reservation Summary */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <span className="material-symbols-outlined text-accent">
                  confirmation_number
                </span>
                Reservation Summary
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">
                    chair
                  </span>
                  <div>
                    <div className="text-sm text-white/60">Selected Seats</div>
                    <div className="text-lg font-semibold">
                      {state.seats.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Quantity</div>
                  <div className="text-lg font-semibold">
                    {state.seats.length}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">
                    email
                  </span>
                  <div>
                    <div className="text-sm text-white/60">
                      Confirmation Email
                    </div>
                    <div className="text-lg font-semibold">{state.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Ticket Price</span>
                  <span>{Number(state.totalPrice).toFixed(2)} TND</span>
                </div>
                {state.bookingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Booking Fee</span>
                    <span>{Number(state.bookingFee).toFixed(2)} TND</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-lg font-black">
                  <span>Total Amount Paid</span>
                  <span className="text-accent">
                    {Number(
                      state.paidAmount ||
                        Number(state.totalPrice) + (state.bookingFee || 0),
                    ).toFixed(2)}{" "}
                    TND
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 rounded-2xl border border-accent/30 bg-accent/5 p-8">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-accent">
                  info
                </span>
                What Happens Next
              </h3>
            </div>

            <div className="space-y-3 text-sm text-white/70">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white">
                    Check Your Email
                  </div>
                  <p>
                    Look for a confirmation email with your tickets and QR code.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white">
                    Download Your Tickets
                  </div>
                  <p>Save your tickets to your phone or print them out.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  3
                </span>
                <div>
                  <div className="font-semibold text-white">Arrive Early</div>
                  <p>Come at least 15 minutes before the screening starts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
            <Link
              to="/events"
              className="flex items-center justify-center gap-2 rounded-xl border border-accent/50 bg-accent/10 px-6 py-4 font-bold text-accent transition-colors hover:bg-accent/20">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Events
            </Link>
            <button
              onClick={() => {
                // This could open or download tickets
                window.print();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-bold text-charcoal transition-colors hover:bg-accent/90">
              <span className="material-symbols-outlined">print</span>
              Print Tickets
            </button>
          </div>

          {/* Support Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="mb-3 text-sm text-white/60">
              Having trouble with your reservation?
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80">
              <span className="material-symbols-outlined text-base">
                support_agent
              </span>
              Contact Support
            </a>
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
