import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../store/slices/authSlice";

const buildDefaultAvatar = (name) => {
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=1f2937&color=f5c065&size=128`;
};

export default function Navbar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const avatarSrc =
    currentUser?.avatar || buildDefaultAvatar(currentUser?.name);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
    setShowMenu(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowMenu(false);
  };

  return (
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
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            className="text-sm font-medium text-white transition-colors hover:text-accent"
            to="/">
            Home
          </Link>
          <Link
            className="text-sm font-medium text-white transition-colors hover:text-accent"
            to="/events">
            Events
          </Link>
          <Link
            className="text-sm font-medium text-white transition-colors hover:text-accent"
            to="/venues">
            Venues
          </Link>
          <Link
            className="text-sm font-medium text-white transition-colors hover:text-accent"
            to="/experience">
            Experience
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full border border-accent/30 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                onClick={() => setShowMenu(!showMenu)}>
                <img
                  alt="Current user avatar"
                  className="h-8 w-8 rounded-full border border-accent/40 object-cover"
                  src={avatarSrc}
                />
                <span className="hidden md:inline">{currentUser.name}</span>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-background-dark border border-accent/30 shadow-lg">
                  <div className="p-3 border-b border-accent/20 text-sm text-white/60">
                    {currentUser.email}
                  </div>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    onClick={handleProfile}>
                    <span className="material-symbols-outlined text-lg align-middle mr-2">
                      person
                    </span>
                    Profile
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-white hover:bg-white/10 transition-colors rounded-b-lg"
                    onClick={handleLogout}>
                    <span className="material-symbols-outlined text-lg align-middle mr-2">
                      logout
                    </span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                className="rounded-full border border-accent/30 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                to="/login">
                Login
              </Link>
              <Link
                className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
                to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
