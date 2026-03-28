import React from "react";
import { useSelector } from "react-redux";

export default function OrganizerDashboardPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const organizationName =
    currentUser?.organizerProfile?.organizationName || "Your Organization";

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="mb-10 rounded-2xl border border-accent/30 bg-white/5 p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Organizer Space
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Welcome, {currentUser?.name || "Organizer"}
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Your account is approved. You can now manage events and track your
            organizer activity from this dashboard.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Organization
            </p>
            <p className="mt-2 text-xl font-bold text-accent">
              {organizationName}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Account Status
            </p>
            <p className="mt-2 text-xl font-bold text-green-400">Approved</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Next Step
            </p>
            <p className="mt-2 text-xl font-bold text-white">
              Start creating events
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
