import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toggleWishlist, isEventInWishlist } from "../api/wishlistApi";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if event is in wishlist on mount
  useEffect(() => {
    if (currentUser && (event.id || event._id)) {
      const eventId = event.id || event._id;
      console.log("🔍 Checking wishlist status for event:", eventId);
      isEventInWishlist(eventId)
        .then((res) => {
          console.log("✅ Wishlist check response:", res);
          if (res.success) {
            setIsLiked(res.isInWishlist);
          }
        })
        .catch((err) => {
          console.error("❌ Error checking wishlist:", err);
        });
    }
  }, [currentUser, event.id, event._id]);

  const handleWishlistClick = (e) => {
    // Just log to verify click is registered
    console.log("🎯 HEART BUTTON CLICKED!");
    
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }

    const eventId = event.id || event._id;
    console.log("🔎 Event ID:", eventId);
    
    if (!eventId) {
      console.error("❌ Event ID not found");
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      console.log("🔐 User not logged in, redirecting to login");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Toggling wishlist for event:", eventId);
      toggleWishlist(eventId).then((response) => {
        console.log("✅ Wishlist response:", response);
        if (response?.success) {
          setIsLiked(response.added);
          console.log("💚 Wishlist updated:", response.added ? "Added" : "Removed");
        } else {
          console.error("❌ Response not successful:", response);
        }
        setLoading(false);
      }).catch((error) => {
        console.error("❌ Error toggling wishlist:", error);
        setLoading(false);
      });
    } catch (error) {
      console.error("❌ Error in handler:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (e) => {
    // Navigate to event details when "See details" button is clicked
    navigate(`/events/${event.id || event._id}`);
  };

  const cardContent = (
    <div className="group relative overflow-hidden border border-white/10 bg-[#10131b] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.48)] cursor-pointer">
      {/* Top Badges */}
      <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2">
        {event.badge && (
          <span className="border border-accent/40 bg-accent/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent backdrop-blur-sm">
            {event.badge}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto z-20 relative">
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={loading}
            className={`rounded-full p-2 backdrop-blur-sm transition relative z-20 ${
              isLiked
                ? "bg-red-500/30 border border-red-500 text-red-500"
                : "border border-white/15 bg-black/35 text-white/80 hover:border-red-500 hover:text-red-500"
            }`}
            title={currentUser ? (isLiked ? "Remove from wishlist" : "Add to wishlist") : "Login to add to wishlist"}
          >
            <span className="material-symbols-outlined text-base">
              {isLiked ? "favorite" : "favorite_border"}
            </span>
          </button>
          <span className="border border-white/15 bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
            Cinema
          </span>
        </div>
      </div>

      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-background-dark overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/80">
            Poster unavailable
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,12,0.95)_0%,rgba(6,8,12,0.4)_40%,rgba(6,8,12,0)_75%)]" />

        {/* Content at Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">event</span>
              {event.date}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 flex items-center gap-1 line-clamp-1">
              <span className="material-symbols-outlined text-xs">
                location_on
              </span>
              {event.location}
            </p>
          </div>

          {/* Price & Button */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm font-black text-accent">
              {event.price}
            </span>
            <button
              type="button"
              onClick={handleCardClick}
              className="flex-1 border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-accent/40">
              See details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return cardContent;
