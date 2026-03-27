import React from "react";

export default function CreateRoomTemplatePage() {
  return (
    <>
      <style>{`
				.room-template-page {
					font-family: 'Spline Sans', sans-serif;
					background-color: #1C1C1C;
				}

				.room-template-page .seat-grid {
					background-image:
						linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
					background-size: 40px 40px;
				}

				.room-template-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.room-template-page .custom-scrollbar::-webkit-scrollbar-track {
					background: #1C1C1C;
				}

				.room-template-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #333;
					border-radius: 10px;
				}
			`}</style>

      <div className="room-template-page text-white overflow-hidden h-screen flex flex-col bg-background-dark">
        <header className="h-16 border-b border-white/10 bg-charcoal flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">
                movie_filter
              </span>
              <h1 className="text-sm font-black tracking-tighter uppercase whitespace-nowrap">
                CINÉ<span className="text-accent">EVENT</span>{" "}
                <span className="text-white/40 ml-2 font-normal">| Editor</span>
              </h1>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Grand Rex - Theater 01{" "}
                <span className="material-symbols-outlined text-xs text-white/40">
                  edit
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-accent text-charcoal flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  design_services
                </span>
                Design
              </button>
              <button className="px-4 py-1.5 rounded-md text-xs font-bold text-white/60 hover:text-white transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  visibility
                </span>
                Preview Mode
              </button>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <button className="px-5 py-2 bg-primary/20 border border-primary/40 text-accent rounded-lg text-xs font-bold hover:bg-primary transition-all">
              SAVE TEMPLATE
            </button>
            <button className="px-5 py-2 bg-accent text-charcoal rounded-lg text-xs font-black hover:opacity-90 transition-all">
              PUBLISH
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-20 lg:w-64 border-r border-white/5 bg-charcoal flex flex-col p-4 lg:p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 hidden lg:block">
                Zone Painter
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 border-2 border-accent transition-all">
                  <div className="w-4 h-4 rounded-full bg-white ring-2 ring-white/20" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-none">
                      Standard
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      $15.00 Base
                    </p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all">
                  <div className="w-4 h-4 rounded-full bg-accent ring-2 ring-accent/20" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-none">
                      VIP
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      $45.00 Gold
                    </p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                  <div className="w-4 h-4 rounded-full bg-primary ring-2 ring-primary/20" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-none">
                      Premium
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      $25.00 Burg.
                    </p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-pmr-green/30 transition-all">
                  <div className="w-4 h-4 rounded-full bg-pmr-green ring-2 ring-pmr-green/20" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-none">
                      PMR
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      Accessibility
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 hidden lg:block">
                Components
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-white/10">
                  <span className="material-symbols-outlined text-white/60">
                    reorder
                  </span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    Single Row
                  </span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-white/10">
                  <span className="material-symbols-outlined text-white/60">
                    grid_view
                  </span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    Block
                  </span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-white/10">
                  <span className="material-symbols-outlined text-white/60">
                    door_front
                  </span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    Entrance
                  </span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:bg-white/10">
                  <span className="material-symbols-outlined text-white/60">
                    person
                  </span>
                  <span className="text-[9px] font-bold text-white/60 uppercase">
                    Obstacle
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 bg-background-dark relative overflow-auto custom-scrollbar seat-grid">
            <div className="min-w-[1200px] min-h-[1000px] p-20 flex flex-col items-center">
              <div className="w-2/3 h-4 bg-gradient-to-b from-accent/20 to-transparent rounded-full mb-32 relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-accent tracking-[0.5em] uppercase">
                  SCREEN
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-8 group">
                  <span className="text-xs font-bold text-white/40 w-4">A</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10" />
                  </div>
                  <span className="text-xs font-bold text-white/40 w-4">A</span>
                </div>

                <div className="flex items-center gap-8 group">
                  <span className="text-xs font-bold text-white/40 w-4">B</span>
                  <div className="flex gap-2 p-1 border-2 border-dashed border-accent/20 rounded-lg bg-accent/5">
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-accent ring-1 ring-accent/50 shadow-lg shadow-accent/10" />
                  </div>
                  <span className="text-xs font-bold text-white/40 w-4">B</span>
                </div>

                <div className="flex items-center gap-8">
                  <span className="text-xs font-bold text-white/40 w-4">C</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-4" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                  </div>
                  <span className="text-xs font-bold text-white/40 w-4">C</span>
                </div>

                <div className="flex items-center gap-8">
                  <span className="text-xs font-bold text-white/40 w-4">D</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-t-lg bg-pmr-green ring-1 ring-pmr-green/50 shadow-lg shadow-pmr-green/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-background-dark">
                        accessible
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-t-lg bg-pmr-green ring-1 ring-pmr-green/50 shadow-lg shadow-pmr-green/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-background-dark">
                        accessible
                      </span>
                    </div>
                    <div className="w-16" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-8 h-8 rounded-t-lg bg-white/20 border border-white/10" />
                    <div className="w-16" />
                    <div className="w-8 h-8 rounded-t-lg bg-pmr-green ring-1 ring-pmr-green/50 shadow-lg shadow-pmr-green/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-background-dark">
                        accessible
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-t-lg bg-pmr-green ring-1 ring-pmr-green/50 shadow-lg shadow-pmr-green/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-background-dark">
                        accessible
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/40 w-4">D</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-charcoal/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                <button className="material-symbols-outlined text-white/60 hover:text-white transition-colors">
                  zoom_out
                </button>
                <span className="text-xs font-bold text-white/40 w-8 text-center">
                  85%
                </span>
                <button className="material-symbols-outlined text-white/60 hover:text-white transition-colors">
                  zoom_in
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button className="material-symbols-outlined text-white/60 hover:text-white transition-colors">
                  undo
                </button>
                <button className="material-symbols-outlined text-white/60 hover:text-white transition-colors">
                  redo
                </button>
                <button className="material-symbols-outlined text-white/60 hover:text-white transition-colors">
                  delete
                </button>
              </div>
            </div>
          </main>

          <aside className="w-80 border-l border-white/5 bg-charcoal flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
                Properties
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">
                    Selected Object
                  </label>
                  <div className="p-4 bg-white/5 rounded-xl border border-accent/20">
                    <p className="text-xs font-bold text-accent">
                      VIP Row Block
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      ID: #R-12B-VIP
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">
                    Row Label
                  </label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-accent"
                    type="text"
                    defaultValue="B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">
                      Seat Count
                    </label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-accent"
                      type="number"
                      defaultValue="12"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">
                      Spacing (px)
                    </label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-accent"
                      type="number"
                      defaultValue="8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-2">
                    Price Override
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                      $
                    </span>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-accent"
                      type="text"
                      defaultValue="45.00"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
                    Venue Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40">Total Capacity</span>
                      <span className="font-bold text-white">420 Seats</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40">Standard</span>
                      <span className="font-bold text-white">320</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-accent">VIP (Gold)</span>
                      <span className="font-bold text-accent">40</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-pmr-green">PMR Access</span>
                      <span className="font-bold text-pmr-green">8</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                  REMOVE SELECTION
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
