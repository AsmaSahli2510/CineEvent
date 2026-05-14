import React from "react";

const SocialShareButtons = ({
  eventTitle,
  eventUrl,
  eventImage,
  eventDate,
  eventVenue,
  eventPrice,
}) => {
  const encodedUrl = encodeURIComponent(eventUrl);
  const encodedImage = encodeURIComponent(eventImage);

  // Create a clean share message with event details
  const shareMessage = `Don't miss this amazing event!\n\nEvent: ${eventTitle}\n\nDate: ${eventDate || "Date TBA"}\nVenue: ${eventVenue || "Venue TBA"}\nPrice: ${eventPrice || "Price TBA"}\n\nBook Now: ${eventUrl}`;
  const encodedMessage = encodeURIComponent(shareMessage);

  const handleShare = (platform) => {
    let shareUrl = "";

    if (platform === "facebook") {
      // Facebook share with message and image preview
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}&picture=${encodedImage}`;
    } else if (platform === "twitter") {
      // X/Twitter share with message and image
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`;
    } else if (platform === "instagram") {
      // Instagram - copy formatted message to clipboard with instructions
      const instagramMessage = `Don't miss this amazing event!\n\nEvent: ${eventTitle}\n\nDate: ${eventDate || "Date TBA"}\nVenue: ${eventVenue || "Venue TBA"}\nPrice: ${eventPrice || "Price TBA"}\n\nBook Now: ${eventUrl}`;

      navigator.clipboard.writeText(instagramMessage).then(() => {
        alert(
          `Message copied to clipboard!\n\nInstructions:\n1. Open Instagram\n2. Create a new post\n3. Upload the event poster image\n4. Paste the caption in the text field`,
        );
      });
      return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-white/65">
          share
        </span>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Share with friends
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        {/* Facebook Button */}
        <button
          onClick={() => handleShare("facebook")}
          className="flex items-center justify-center rounded-lg border border-white/20 bg-white/8 hover:bg-white/12 p-2.5 text-white transition duration-300 hover:border-blue-400/50"
          title="Share on Facebook with poster">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* X/Twitter Button */}
        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center justify-center rounded-lg border border-white/20 bg-white/8 hover:bg-white/12 p-2.5 text-white transition duration-300 hover:border-white/50"
          title="Share on X with poster">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.648l-5.195-6.793-5.974 6.793H2.882l7.605-8.696-8.156-10.804h6.8l4.759 6.298 5.449-6.298zM11.6 20.644h2.039L5.404 3.467H3.21L11.6 20.644z" />
          </svg>
        </button>

        {/* Instagram Button */}
        <button
          onClick={() => handleShare("instagram")}
          className="flex items-center justify-center rounded-lg border border-white/20 bg-white/8 hover:bg-white/12 p-2.5 text-white transition duration-300 hover:border-pink-400/50"
          title="Share on Instagram with poster">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16.5 12c0 2.485-2.015 4.5-4.5 4.5S7.5 14.485 7.5 12 9.515 7.5 12 7.5 16.5 9.515 16.5 12z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
