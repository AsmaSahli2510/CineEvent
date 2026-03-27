import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";

export default function AdminHeader({
  title,
  subtitle,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuth());
    window.location.href = "/login";
  };

  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/80 transition-colors hover:bg-white/10"
          onClick={onToggleSidebar}
          type="button">
          <span className="material-symbols-outlined text-xl">
            {isSidebarOpen ? "close" : "menu"}
          </span>
        </button>
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
            aria-label="Admin menu"
            className="ml-2 flex items-center gap-3 border-l border-white/10 pl-4 transition-opacity hover:opacity-80"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button">
            <div className="text-right">
              <p className="text-sm font-bold leading-none text-white">
                Sign In
              </p>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-accent">
                Super Admin
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-black text-charcoal cursor-pointer">
              AD
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-charcoal shadow-lg">
              <button
                className="w-full px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3 rounded-lg"
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
