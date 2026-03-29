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
  const isCollapsed = !isOpen;

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

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
        className={`fixed inset-y-0 left-0 z-50 border-r border-white/5 bg-charcoal text-white transition-all duration-200 ${
          isOpen
            ? "w-72 translate-x-0"
            : "w-20 -translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex h-full flex-col">
          <div className="p-6">
            <div
              className={`mb-6 flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              }`}>
              <div
                className={`flex items-center text-accent ${
                  isCollapsed ? "justify-center" : "gap-2.5"
                }`}>
                <span className="material-symbols-outlined text-2xl">
                  movie_filter
                </span>
                <h1
                  className={`text-lg font-black tracking-tight uppercase text-white ${
                    isCollapsed ? "hidden" : ""
                  }`}>
                  CINE<span className="text-accent">ORGANIZER</span>
                </h1>
              </div>
              {!isCollapsed ? (
                <button
                  aria-label="Close sidebar"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                  type="button">
                  <span className="material-symbols-outlined text-base leading-none">
                    close
                  </span>
                </button>
              ) : null}
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = isItemActive(item.to, pathname);

                return (
                  <Link
                    key={item.to}
                    className={`flex items-center rounded-xl py-3 text-sm font-bold transition-all ${
                      isCollapsed
                        ? "justify-center px-2"
                        : "gap-4 px-4"
                    } ${
                      active
                        ? "border border-primary/30 bg-primary/20 text-accent"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={handleNavClick}
                    to={item.to}>
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                    {!isCollapsed ? <span>{item.label}</span> : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={`mt-auto border-t border-white/5 ${isCollapsed ? "p-3" : "p-8"}`}>
            {!isCollapsed ? (
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-white/40">
                Organizer Focus
              </h3>
            ) : null}
            <div className={isCollapsed ? "space-y-2" : "space-y-4"}>
              <Link
                to="/organizer/events/create"
                onClick={handleNavClick}
                className={`flex items-center rounded-xl border border-accent/20 bg-accent/5 transition-colors hover:border-accent/40 ${
                  isCollapsed ? "justify-center p-2" : "gap-3 p-3"
                }`}>
                {isCollapsed ? (
                  <span className="material-symbols-outlined text-base text-accent">
                    add_circle
                  </span>
                ) : (
                  <>
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
                  </>
                )}
              </Link>
              <Link
                to="/organizer/reservations"
                onClick={handleNavClick}
                className={`flex items-center rounded-xl border border-primary/20 bg-primary/5 transition-colors hover:border-primary/40 ${
                  isCollapsed ? "justify-center p-2" : "gap-3 p-3"
                }`}>
                {isCollapsed ? (
                  <span className="material-symbols-outlined text-base text-primary">
                    confirmation_number
                  </span>
                ) : (
                  <>
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
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
