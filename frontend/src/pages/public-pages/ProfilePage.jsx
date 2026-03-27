import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../store/slices/authSlice";

const buildDefaultAvatar = (name) => {
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=1f2937&color=f5c065&size=256`;
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return null;
  }

  const avatarSrc = currentUser.avatar || buildDefaultAvatar(currentUser.name);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-14 md:px-12">
      <div className="rounded-2xl border border-accent/20 bg-background-dark/70 p-8 shadow-xl backdrop-blur-md md:p-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            alt="Profile avatar"
            className="h-24 w-24 rounded-full border-2 border-accent/60 object-cover"
            src={avatarSrc}
          />
          <h1 className="text-3xl font-black text-white">{currentUser.name}</h1>
          <p className="text-white/60">{currentUser.email}</p>
          <span className="rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            {currentUser.role}
          </span>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            className="rounded-full border border-accent/30 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
