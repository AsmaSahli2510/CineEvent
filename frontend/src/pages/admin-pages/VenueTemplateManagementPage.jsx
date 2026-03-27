import React from "react";

function Dots({ total, active = [], colsClass, gapClass }) {
  return (
    <div className={`grid ${colsClass} ${gapClass} opacity-60`}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`minimap-dot ${active.includes(index) ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

export default function VenueTemplateManagementPage() {
  return (
    <>
      <style>{`
        .venue-template-management-page {
          font-family: 'Spline Sans', sans-serif;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar-track {
          background: #1C1C1C;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F5C065;
          border-radius: 10px;
        }

        .venue-template-management-page .minimap-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 9999px;
          background: rgba(245, 192, 101, 0.2);
        }

        .venue-template-management-page .minimap-dot.active {
          background: #F5C065;
          box-shadow: 0 0 5px rgba(245, 192, 101, 0.8);
        }

        .venue-template-management-page .glass-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="venue-template-management-page bg-background-dark text-white min-h-screen flex">
        <aside className="w-72 border-r border-white/10 flex flex-col fixed h-full bg-charcoal z-50">
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-4xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white">
                CINE<span className="text-accent">EVENT</span>
              </h1>
            </div>
            <p className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase mt-1 opacity-80">
              Admin Console
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 transition-all"
              href="#">
              <span className="material-symbols-outlined">dashboard</span>
              Global Analytics
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-white font-bold"
              href="#">
              <span className="material-symbols-outlined">layers</span>
              Venue Templates
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">theater_comedy</span>
              Live Events
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">payments</span>
              Pricing Tiers
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">group</span>
              Partner Accounts
            </a>
          </nav>

          <div className="p-6 mt-auto">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-charcoal">
                  <span className="material-symbols-outlined">
                    admin_panel_settings
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Platform Admin</p>
                  <p className="text-[10px] text-white/40">Superuser Access</p>
                </div>
              </div>
              <button className="w-full py-2 bg-charcoal border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-all">
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-white">
                Master Venue Template Catalog
              </h2>
              <p className="text-white/40 text-sm">
                Create and manage high-fidelity seating blueprints for all
                cinema types.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-accent text-charcoal hover:opacity-90 rounded-xl text-sm font-black transition-all shadow-[0_0_20px_rgba(245,192,101,0.2)]">
                <span className="material-symbols-outlined text-lg">
                  add_circle
                </span>
                Create New Template
              </button>
            </div>
          </header>

          <section className="flex flex-col lg:flex-row items-center gap-4 mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                search
              </span>
              <input
                className="w-full bg-charcoal border-white/10 focus:border-accent focus:ring-accent rounded-xl pl-12 text-sm text-white placeholder:text-white/20 h-12"
                placeholder="Search templates by name or tag..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <select className="bg-charcoal border-white/10 text-white/60 text-sm rounded-xl focus:ring-accent focus:border-accent h-12 px-4 flex-1 lg:flex-none lg:w-48">
                <option>Venue Type: All</option>
                <option>IMAX</option>
                <option>Prestige</option>
                <option>Outdoor</option>
                <option>Boutique</option>
              </select>
              <select className="bg-charcoal border-white/10 text-white/60 text-sm rounded-xl focus:ring-accent focus:border-accent h-12 px-4 flex-1 lg:flex-none lg:w-48">
                <option>Capacity: All</option>
                <option>Small (&lt; 50)</option>
                <option>Medium (50 - 200)</option>
                <option>Large (200+)</option>
              </select>
              <button className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-white/60">
                  filter_list
                </span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="glass-card border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300">
              <div className="h-48 bg-charcoal relative flex items-center justify-center p-6 overflow-hidden border-b border-white/10">
                <Dots
                  colsClass="grid-cols-10"
                  gapClass="gap-1.5"
                  total={40}
                  active={Array.from({ length: 20 }, (_, i) => i + 10)}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-charcoal text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      star
                    </span>{" "}
                    Popularity High
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  v1.2.4-stable
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                      Grand IMAX Theater
                    </h3>
                    <p className="text-xs text-white/40">
                      Large-scale cinematic experience
                    </p>
                  </div>
                  <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded text-[10px] font-bold">
                    IMAX
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Capacity
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        event_seat
                      </span>
                      <span className="text-lg font-black">450</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Active Events
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        confirmation_number
                      </span>
                      <span className="text-lg font-black">24</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-3 rounded-xl transition-all">
                    Edit Layout
                  </button>
                  <button className="w-12 aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300">
              <div className="h-48 bg-charcoal relative flex items-center justify-center p-6 overflow-hidden border-b border-white/10">
                <Dots
                  colsClass="grid-cols-8"
                  gapClass="gap-3"
                  total={24}
                  active={Array.from({ length: 24 }, (_, i) => i)}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/10 text-white/60 text-[10px] font-black rounded-full uppercase tracking-tighter flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      trending_up
                    </span>{" "}
                    Trending
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  v2.0.0-gold
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                      Royal Lounge
                    </h3>
                    <p className="text-xs text-white/40">
                      Luxury reclining suites
                    </p>
                  </div>
                  <span className="bg-accent/10 text-accent border border-accent/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    Prestige
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Capacity
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        king_bed
                      </span>
                      <span className="text-lg font-black">48</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Active Events
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        confirmation_number
                      </span>
                      <span className="text-lg font-black">12</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-3 rounded-xl transition-all">
                    Edit Layout
                  </button>
                  <button className="w-12 aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300">
              <div className="h-48 bg-charcoal relative flex items-center justify-center p-6 overflow-hidden border-b border-white/10">
                <Dots
                  colsClass="grid-cols-6"
                  gapClass="gap-4"
                  total={12}
                  active={Array.from({ length: 12 }, (_, i) => i)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  v0.9.1-beta
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                      Micro Boutique
                    </h3>
                    <p className="text-xs text-white/40">
                      Private screening studio
                    </p>
                  </div>
                  <span className="bg-white/5 text-white/60 border border-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    Boutique
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Capacity
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        chair
                      </span>
                      <span className="text-lg font-black">20</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Active Events
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        confirmation_number
                      </span>
                      <span className="text-lg font-black">4</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-3 rounded-xl transition-all">
                    Edit Layout
                  </button>
                  <button className="w-12 aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300">
              <div className="h-48 bg-charcoal relative flex items-center justify-center p-6 overflow-hidden border-b border-white/10">
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={`row1-${i}`} className="minimap-dot" />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={`row2-${i}`} className="minimap-dot" />
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`row3-${i}`} className="minimap-dot active" />
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-charcoal text-[10px] font-black rounded-full uppercase tracking-tighter flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      verified
                    </span>{" "}
                    Certified
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  v3.1.0-master
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                      Starry Garden
                    </h3>
                    <p className="text-xs text-white/40">
                      Open-air moonlight cinema
                    </p>
                  </div>
                  <span className="bg-green-900/20 text-green-400 border border-green-500/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    Outdoor
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Capacity
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        wb_sunny
                      </span>
                      <span className="text-lg font-black">250</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                      Active Events
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-lg">
                        confirmation_number
                      </span>
                      <span className="text-lg font-black">8</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-3 rounded-xl transition-all">
                    Edit Layout
                  </button>
                  <button className="w-12 aspect-square flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 p-8 hover:border-accent/50 hover:bg-accent/5 transition-all group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                <span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-accent">
                  add
                </span>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-white/40 group-hover:text-white">
                  Create Template
                </h3>
                <p className="text-xs text-white/20 group-hover:text-white/40">
                  Draft a new seating blueprint
                </p>
              </div>
            </button>
          </div>

          <footer className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
            <p className="text-xs text-white/40">
              Showing 4 of 48 total venue templates. All templates are
              synchronized with the{" "}
              <span className="text-accent">Global Master Sync</span> service.
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-charcoal font-bold text-xs">
                1
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white font-bold text-xs">
                2
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white font-bold text-xs">
                3
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
