import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/organizer/dashboard", icon: "dashboard", label: "Dashboard" },
  {
    to: "/organizer/events/create",
    icon: "add_circle",
    label: "Create Event",
  },
  {
    to: "/organizer/events/create-charity",
    icon: "volunteer_activism",
    label: "Create Charity Event",
  },
  {
    to: "/organizer/events/statistics",
    icon: "insights",
    label: "Event Statistics",
  },
  {
    to: "/organizer/comments/responses",
    icon: "rate_review",
    label: "Review & Feedback",
  },
  {
    to: "/organizer/donations/tracking",
    icon: "paid",
    label: "Donations Tracking",
  },
  {
    to: "/organizer/events/manage",
    icon: "edit_calendar",
    label: "Manage Events",
  },
  {
    to: "/organizer/events/my-list",
    icon: "event_note",
    label: "My Events List",
  },
  {
    to: "/organizer/reservations",
    icon: "confirmation_number",
    label: "Reservations List",
  },
  {
    to: "/organizer/revenue/tracking",
    icon: "payments",
    label: "Revenue Tracking",
  },
];

function isItemActive(itemPath, currentPath) {
  if (itemPath === "/organizer/dashboard") {
    return (
      currentPath === "/organizer" ||
      currentPath === "/organizer/dashboard" ||
      currentPath === "/organizer-dashboard"
    );
  }

  return currentPath === itemPath;
}

export default function OrganizerSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-charcoal text-white transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex h-full flex-col">
          <div className="p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-3xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase">
                CINE<span className="text-accent">ORGANIZER</span>
              </h1>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = isItemActive(item.to, pathname);

                return (
                  <Link
                    key={item.to}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                      active
                        ? "border border-primary/30 bg-primary/20 text-accent"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={onClose}
                    to={item.to}>
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/5 p-8">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-white/40">
              Organizer Focus
            </h3>
            <div className="space-y-4">
              <Link
                to="/organizer/events/create"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3 transition-colors hover:border-accent/40">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    Publish Next Event
                  </p>
                  <p className="text-[10px] text-white/40">
                    Launch your next campaign
                  </p>
                </div>
                <span className="material-symbols-outlined text-sm text-white/40">
                  chevron_right
                </span>
              </Link>
              <Link
                to="/organizer/reservations"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 transition-colors hover:border-primary/40">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    Track Reservations
                  </p>
                  <p className="text-[10px] text-white/40">
                    Monitor audience demand
                  </p>
                </div>
                <span className="material-symbols-outlined text-sm text-white/40">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
