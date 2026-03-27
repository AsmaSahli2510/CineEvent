import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/admin/events/validation", icon: "event", label: "Event Validation" },
  { to: "/admin/comments/moderation", icon: "flag", label: "Moderation" },
  {
    to: "/admin/organizers/validation",
    icon: "group",
    label: "Organizer Validation",
  },
  { to: "/admin/users", icon: "manage_accounts", label: "Users" },
  { to: "/admin/revenue", icon: "payments", label: "Revenue" },
  { to: "/admin/donations", icon: "volunteer_activism", label: "Donations" },
  {
    to: "/admin/organizers/wallet",
    icon: "account_balance_wallet",
    label: "Organizer Wallet",
  },
  { to: "/admin/statistics", icon: "analytics", label: "Statistics" },
  { to: "/admin/venues/templates", icon: "layers", label: "Venue Templates" },
];

function isItemActive(itemPath, currentPath) {
  if (itemPath === "/admin/dashboard") {
    return currentPath === "/admin" || currentPath === "/admin/dashboard";
  }

  return currentPath === itemPath;
}

export default function AdminSidebar({ isOpen, onClose }) {
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
                CINE<span className="text-accent">ADMIN</span>
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
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Moderation Alerts
            </h3>
            <div className="space-y-4">
              <Link
                to="/admin/comments/moderation"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 transition-colors hover:border-red-500/40">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    12 Flagged Comments
                  </p>
                  <p className="text-[10px] text-white/40">Requires review</p>
                </div>
                <span className="material-symbols-outlined text-sm text-white/40">
                  chevron_right
                </span>
              </Link>
              <Link
                to="/admin/organizers/validation"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3 transition-colors hover:border-accent/40">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    4 Pending Organizers
                  </p>
                  <p className="text-[10px] text-white/40">
                    Identity verification
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
