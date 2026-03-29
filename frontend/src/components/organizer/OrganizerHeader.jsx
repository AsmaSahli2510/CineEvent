import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";

function getInitials(name) {
  if (!name) {
    return "OR";
  }

  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "OR";
  }

  return parts.map((part) => part[0].toUpperCase()).join("");
}

export default function OrganizerHeader({
  title,
  subtitle,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initials = useMemo(() => getInitials(currentUser?.name), [currentUser]);

  const handleLogout = () => {
    dispatch(clearAuth());
    window.location.href = "/login";
  };

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {!isSidebarOpen ? (
          <button
            aria-label="Open sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
            onClick={onToggleSidebar}
            type="button">
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        ) : null}
        <div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          <p className="text-sm font-medium text-white/40">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined cursor-pointer p-2 text-white/60 transition-colors hover:text-accent">
            notifications
          </span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-charcoal bg-primary" />
        </div>
        <div className="relative">
          <button
            aria-label="Organizer menu"
            className="ml-2 flex items-center gap-3 border-l border-white/10 pl-4 transition-opacity hover:opacity-80"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            type="button">
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-accent font-black text-charcoal">
              {initials}
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 border border-white/10 bg-charcoal shadow-lg">
              <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/70">
                {currentUser?.email || "organizer@cineevent.com"}
              </div>
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-400 transition-all hover:bg-red-500/10"
                onClick={handleLogout}
                type="button">
                <span className="material-symbols-outlined text-sm">
                  logout
                </span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
