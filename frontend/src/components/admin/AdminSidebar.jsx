import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getPendingOrganizersAdmin } from "../../api/authApi";

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
  const isCollapsed = !isOpen;
  const [pendingOrganizerCount, setPendingOrganizerCount] = useState(0);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPendingOrganizers = async () => {
      try {
        const organizers = await getPendingOrganizersAdmin();
        if (isMounted) {
          setPendingOrganizerCount(
            Array.isArray(organizers) ? organizers.length : 0,
          );
        }
      } catch {
        if (isMounted) {
          setPendingOrganizerCount(0);
        }
      }
    };

    loadPendingOrganizers();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

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
          <div className="p-5">
            <div
              className={`mb-5 flex items-center gap-2 ${
                isCollapsed ? "justify-center" : "justify-between"
              }`}>
              <div
                className={`flex items-center text-accent ${
                  isCollapsed ? "justify-center" : "gap-2"
                }`}>
                <span className="material-symbols-outlined text-[22px]">
                  movie_filter
                </span>
                <h1
                  className={`text-base font-black tracking-tight uppercase text-white ${
                    isCollapsed ? "hidden" : ""
                  }`}>
                  CINE<span className="text-accent">ADMIN</span>
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

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = isItemActive(item.to, pathname);

                return (
                  <Link
                    key={item.to}
                    className={`flex items-center rounded-lg py-2.5 text-[13px] font-bold transition-all ${
                      isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                    } ${
                      active
                        ? "border border-primary/30 bg-primary/20 text-accent"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={handleNavClick}
                    to={item.to}>
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      {item.icon}
                    </span>
                    {!isCollapsed ? <span>{item.label}</span> : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            className={`mt-auto border-t border-white/5 ${isCollapsed ? "p-3" : "p-6"}`}>
            {!isCollapsed ? (
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
                Moderation Alerts
              </h3>
            ) : null}
            <div className={isCollapsed ? "space-y-2" : "space-y-3"}>
              <Link
                to="/admin/comments/moderation"
                onClick={handleNavClick}
                className={`flex items-center rounded-xl border border-red-500/20 bg-red-500/5 transition-colors hover:border-red-500/40 ${
                  isCollapsed ? "justify-center p-2" : "gap-2.5 p-2.5"
                }`}>
                {isCollapsed ? (
                  <span className="material-symbols-outlined text-sm text-red-300">
                    flag
                  </span>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-white">
                        12 Flagged Comments
                      </p>
                      <p className="text-[9px] text-white/40">
                        Requires review
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-white/40">
                      chevron_right
                    </span>
                  </>
                )}
              </Link>
              <Link
                to="/admin/organizers/validation"
                onClick={handleNavClick}
                className={`flex items-center rounded-xl border border-accent/20 bg-accent/5 transition-colors hover:border-accent/40 ${
                  isCollapsed ? "justify-center p-2" : "gap-2.5 p-2.5"
                }`}>
                {isCollapsed ? (
                  <span className="material-symbols-outlined text-sm text-accent">
                    group
                  </span>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-white">
                        {pendingOrganizerCount} Pending Organizers
                      </p>
                      <p className="text-[9px] text-white/40">
                        Identity verification
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-xs text-white/40">
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
