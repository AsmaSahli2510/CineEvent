import React from "react";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";

const metrics = [
  {
    label: "Total Reviews",
    value: "1,284",
    note: "+12%",
    noteClass: "text-green-400",
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    note: "star",
    noteClass: "material-symbols-outlined text-sm text-accent",
  },
  {
    label: "Pending Replies",
    value: "24",
    note: "Requires Action",
    noteClass: "text-primary/70",
    valueClass: "text-primary",
  },
  {
    label: "Response Rate",
    value: "96%",
    note: "Excellent",
    noteClass: "text-accent",
  },
];

const reviews = [
  {
    id: 1,
    user: "Eleanor P.",
    eventName: "The Great Gatsby Gala",
    time: "2 hours ago",
    rating: 5,
    text: "An absolutely mesmerizing evening! The transition between the vintage jazz band and the screening was seamless. The gold accents in the decor really made me feel like I was at one of Jay Gatsby's parties. Can't wait for the next event!",
    vip: false,
    featured: false,
    resolved: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3kJnrefV61ipMRksOPZdTSWp15n7zS1o9vzD4lIOK4QwQEEyVOc4rHpiFIT8XQUUgrzXdaQUbgOnD16O8UZ_xjwI-r223VxUbO1gTraPfve-iokTv7zUaMkkSfiUgRvqUM05jFAZLW-paOzMNrxSxruCT_veGXf3Mk2SPkNxxpXv0e1244ni4qPfGsRdCYM1A5dWwoNAhLDYfzDgQR57-6eUDIBEog-8vDyE6jg2hHle-2uNDjW06-34-_skhOejl2lhxquca1fzn",
  },
  {
    id: 2,
    user: "Marcus T.",
    eventName: "Noir Film Festival",
    time: "Yesterday",
    rating: 4,
    text: "The film selection was impeccable, but the cocktail service was a bit slow during the intermission. Other than that, the ambiance of the Vintage Film House was spot on for the noir theme.",
    vip: true,
    featured: false,
    resolved: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpTXD0Zdv7EJsgHbGjFAiJq9vLPTVUk2vuAsoIjvZoqdSaEoyQz4O1FCh3Cd9lWQTMQyYdsL_LEmeFPXSTqakpXKiVNLe4RTxPVxsBdBXkShqt10tYtrkJHZfhyYtdob0u-V1QLrd2BEIEtjXdBOLd15JMG2n13NuTmBpkXCX87ZOx3-zOasrDT7vKSf4ZHH_KGlTOyv__KUxcccY-D_vz1o5ecezc2p48yw204hh7um7uL-4780MB36p-y8j6Xslk8apmrw-Q_012",
  },
  {
    id: 3,
    user: "Sophie L.",
    eventName: "Midnight in Paris Screening",
    time: "3 days ago",
    rating: 5,
    text: '"Simply the most elegant cinematic experience I\'ve had in years. The attention to detail, from the ticket design to the seat service, was extraordinary."',
    vip: false,
    featured: true,
    resolved: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrECPeEEhv1yZzprGbPCDUhfQ7CFJgynlsi5H8pVQqdU5etfLbKerdJDRkcfcYf-4Lj-03EJMXxOp0kJV8dHCUjqkHE6tHEccyOjqWPwZ8bNy5S2GoGm9ZT2SbwtYiFrflKpw5jHgiOv3MzMSvN3qxe_buU8cbc1z1wxdOJHf7S8j0mT96a-VPgTlQI7d9cjDREmCo0gynX9F4XHXW1O3zplgLBKu0YN1jA8YzuMBH_XgYwt__wTFvQl7GsIWDZN1itraUgIuT7xg6",
  },
];

function RatingStars({ value }) {
  return (
    <div className="mb-4 flex gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`star-${value}-${index}`}
          className="material-symbols-outlined text-lg"
          style={{ fontVariationSettings: `'FILL' ${index < value ? 1 : 0}` }}>
          star
        </span>
      ))}
    </div>
  );
}

export default function CommentResponsesPage() {
  return (
    <OrganizerPageFrame
      title="Review & Feedback"
      subtitle="Manage audience sentiment and respond to event attendees.">
      <section className="w-full">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">forum</span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Management Console
              </span>
            </div>
            <h2 className="text-4xl font-black text-white">
              Review & Feedback
            </h2>
            <p className="mt-2 text-white/60">
              Manage audience sentiment and respond to event attendees.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white shadow-lg"
                type="button">
                Pending
              </button>
              <button
                className="px-6 py-2 text-sm font-bold text-white/60 transition-colors hover:text-accent"
                type="button">
                Resolved
              </button>
            </div>
            <button
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-charcoal transition-all hover:scale-105"
              type="button">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>
              Filter
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {metrics.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-accent/10 bg-white/5 p-6 shadow-sm">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/60">
                {item.label}
              </p>
              <div className="flex items-end gap-2">
                <span
                  className={`text-3xl font-black ${item.valueClass || "text-white"}`}>
                  {item.value}
                </span>
                {item.note === "star" ? (
                  <span className={item.noteClass}>star</span>
                ) : (
                  <span className={`mb-1 text-xs font-bold ${item.noteClass}`}>
                    {item.note}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className={`overflow-hidden rounded-2xl border shadow-lg transition-all ${
                review.featured
                  ? "border-primary/30 bg-primary/10 shadow-primary/5"
                  : "border-accent/10 bg-white/5 shadow-charcoal/5 hover:border-accent/40"
              }`}>
              <div className={review.id === 2 ? "p-8" : "p-5"}>
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-primary/10 text-primary">
                      <img
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                        src={review.avatar}
                      />
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-lg font-bold text-white">
                        {review.user}
                        {review.vip && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-accent">
                            VIP Member
                          </span>
                        )}
                        {review.featured && (
                          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                            <span
                              className="material-symbols-outlined text-[10px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}>
                              grade
                            </span>
                            Featured
                          </span>
                        )}
                      </h4>

                      <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
                        <span className="material-symbols-outlined text-sm">
                          event
                        </span>
                        <span>{review.eventName}</span>
                        <span className="mx-1">•</span>
                        <span>{review.time}</span>
                      </div>

                      <RatingStars value={review.rating} />

                      <p
                        className={`max-w-3xl leading-relaxed text-white/80 ${
                          review.featured ? "italic" : ""
                        }`}>
                        {review.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row gap-3 md:flex-col">
                    <button
                      className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                        review.featured
                          ? "bg-accent text-charcoal hover:bg-white"
                          : review.id === 2
                            ? "border border-accent/30 text-accent/60 hover:bg-accent hover:text-charcoal"
                            : "border border-accent text-accent hover:bg-accent hover:text-charcoal"
                      }`}
                      type="button">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{
                          fontVariationSettings: `'FILL' ${review.featured ? 1 : 0}`,
                        }}>
                        grade
                      </span>
                      {review.featured ? "Unfeature" : "Feature Review"}
                    </button>

                    {review.resolved ? (
                      <div className="flex items-center justify-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black text-green-500">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Resolved
                      </div>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-2 text-xs font-bold text-white/80 transition-all hover:bg-primary"
                        type="button">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {review.id === 1 ? (
                  <div className="mt-4 border-t border-accent/10 pt-3">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black text-charcoal">
                        CE
                      </div>
                      <div className="w-full">
                        <textarea
                          className="min-h-[60px] w-full rounded-xl border border-accent/10 bg-white/5 p-4 text-sm text-white focus:border-accent focus:ring-accent"
                          placeholder="Type your premium response here..."
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            className="rounded-full bg-primary px-8 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
                            type="button">
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {review.id === 2 ? (
                  <div className="mt-6">
                    <button
                      className="flex items-center gap-1 text-sm font-bold text-accent hover:underline"
                      type="button">
                      <span className="material-symbols-outlined text-lg">
                        reply
                      </span>
                      Add Reply
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-accent/10 pt-8">
          <p className="text-sm text-white/60">
            Showing <span className="font-bold text-white">10</span> of{" "}
            <span className="font-bold text-white">1,284</span> reviews
          </p>

          <div className="flex gap-2">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/10 text-white transition-colors hover:bg-accent/10"
              type="button">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20"
              type="button">
              1
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/10 text-sm font-bold text-white transition-colors hover:bg-accent/10"
              type="button">
              2
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/10 text-sm font-bold text-white transition-colors hover:bg-accent/10"
              type="button">
              3
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/10 text-white transition-colors hover:bg-accent/10"
              type="button">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </OrganizerPageFrame>
  );
}
