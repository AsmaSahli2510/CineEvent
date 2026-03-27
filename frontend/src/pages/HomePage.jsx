import React from "react";
import EventCard from "../components/EventCard";
import { events } from "../data/events";
import heroImg from "../images/upscalemedia-transformed.png";
import parisImg from "../images/Gemini_Generated_Image_8huwzw8huwzw8huw.png";

const popularEvents = events;

export default function HomePage() {
  return (
    <>
      <main className="w-full">
        <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full bg-cover bg-center"
              data-alt="A luxurious Great Gatsby style cinema party with gold accents"
              style={{
                backgroundImage: `url(${heroImg})`,
              }}
            />
            <div className="cinematic-gradient absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 max-w-4xl px-6 text-center">
            <span className="mb-6 inline-block rounded-full border border-accent px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Premium Cinema Experience
            </span>

            <h2 className="mb-6 font-serif-alt text-5xl font-black italic leading-[1.1] text-white drop-shadow-2xl md:text-7xl">
              Experience The Magic of <br />{" "}
              <span className="text-accent">The Silver Screen</span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/80 md:text-xl">
              From exclusive film premieres to themed gala screenings. Discover
              the most prestigious cinema events in your city.
            </p>

            <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    location_on
                  </span>
                  <input
                    className="w-full border-none bg-transparent text-sm text-white placeholder:text-white/40 focus:ring-0"
                    placeholder="Select City"
                    type="text"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    calendar_today
                  </span>
                  <input
                    className="w-full border-none bg-transparent text-sm text-white placeholder:text-white/40 focus:ring-0"
                    type="date"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-charcoal/40 px-4 py-3">
                  <span className="material-symbols-outlined text-accent">
                    category
                  </span>
                  <select
                    className="w-full appearance-none border-none bg-transparent text-sm text-white focus:ring-0"
                    defaultValue="All Categories">
                    <option className="bg-charcoal">All Categories</option>
                    <option className="bg-charcoal">Premiere</option>
                    <option className="bg-charcoal">Gala Night</option>
                    <option className="bg-charcoal">Indie Fest</option>
                  </select>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-black text-charcoal transition-all hover:bg-accent/90">
                  <span className="material-symbols-outlined">search</span>
                  Find Events
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h3 className="mb-2 text-4xl font-black text-charcoal dark:text-white">
                Popular Events
              </h3>
              <p className="text-charcoal/60 dark:text-white/60">
                Handpicked cinematic experiences for this month.
              </p>
            </div>
            <a
              className="flex items-center gap-2 font-bold text-primary hover:underline dark:text-accent"
              href="/events">
              View All Events{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {popularEvents.map((event) => (
              <EventCard event={event} key={event.title} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 pb-24 md:px-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl p-10">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                data-alt="Satisfied audience in a luxury cinema theater"
                style={{
                  backgroundImage: `url(${heroImg})`,
                }}
              />
              <div className="absolute inset-0 bg-primary/40 transition-colors group-hover:bg-primary/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
              <div className="relative z-10">
                <h4 className="mb-3 text-3xl font-black text-white">
                  Join as Spectator
                </h4>
                <p className="mb-6 max-w-sm text-white/80">
                  Access exclusive invites, member-only screenings, and premium
                  cinematic perks.
                </p>
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-bold text-primary transition-all hover:bg-accent hover:text-charcoal"
                  href="/signup">
                  Get Started
                </a>
              </div>
            </div>

            <div className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl p-10">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                data-alt="Event organizer planning a film set event"
                style={{
                  backgroundImage: `url(${parisImg})`,
                }}
              />
              <div className="absolute inset-0 bg-charcoal/60 transition-colors group-hover:bg-charcoal/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="relative z-10">
                <h4 className="mb-3 text-3xl font-black text-white">
                  Join as Organizer
                </h4>
                <p className="mb-6 max-w-sm text-white/80">
                  Host your own film festival or private screening. We provide
                  the platform and the prestige.
                </p>
                <a
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 font-bold text-charcoal transition-all hover:bg-white"
                  href="/organizer-registration">
                  Host an Event
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
