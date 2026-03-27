import React from "react";

export default function OrganizerValidationPage() {
  return (
    <>
      <style>{`
				.organizer-validation-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-track {
					background: #1C1C1C;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #F5C06533;
					border-radius: 10px;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #F5C06566;
				}
			`}</style>

      <div className="organizer-validation-page bg-background-dark text-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background-dark/95 backdrop-blur-md px-6 md:px-12 py-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-3xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                CINÉ<span className="text-accent">EVENT</span>{" "}
                <span className="ml-2 text-xs font-normal tracking-widest uppercase border-l border-white/20 pl-3 text-white/60">
                  Admin Panel
                </span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                href="#">
                Dashboard
              </a>
              <a
                className="text-accent font-medium text-xs uppercase tracking-widest transition-colors border-b border-accent pb-1"
                href="#">
                Validation Queue
              </a>
              <a
                className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                href="#">
                User Management
              </a>
              <a
                className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                href="#">
                Reports
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-white">Admin User</span>
                <span className="text-[10px] text-accent uppercase tracking-tighter">
                  Super Admin
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary border border-accent/30 flex items-center justify-center text-accent font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-10 flex gap-8">
          <div className="w-2/5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Validation Queue
                </h2>
                <p className="text-white/50 text-sm">
                  Reviewing 12 pending organizer applications
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-accent">
                    filter_list
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[calc(100vh-250px)]">
              <div className="p-5 bg-primary/20 border-l-4 border-accent rounded-r-xl border-y border-r border-white/10 cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Lumière Cinema Group
                    </h4>
                    <p className="text-white/60 text-xs">Applied 2 hours ago</p>
                  </div>
                  <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>
                <div className="flex gap-3 mb-4">
                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    KBIS
                  </span>
                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    ID Card
                  </span>
                  <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">
                    <span className="material-symbols-outlined text-xs">
                      schedule
                    </span>
                    IBAN
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>{" "}
                    Marc Dubois
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>{" "}
                    Paris, FR
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Vintage Reels &amp; Co.
                    </h4>
                    <p className="text-white/60 text-xs">Applied 5 hours ago</p>
                  </div>
                  <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>
                <div className="flex gap-3 mb-4">
                  <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/20">
                    <span className="material-symbols-outlined text-xs">
                      error
                    </span>
                    KBIS
                  </span>
                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    ID Card
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>{" "}
                    Sarah Jenkins
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>{" "}
                    London, UK
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all opacity-60">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Majestic Screenings
                    </h4>
                    <p className="text-white/60 text-xs">Applied yesterday</p>
                  </div>
                  <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>
                <div className="flex gap-3 mb-4 text-xs">
                  <span className="text-white/40 italic">
                    Waiting for uploads...
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Indie Film Collective
                    </h4>
                    <p className="text-white/60 text-xs">Applied 2 days ago</p>
                  </div>
                  <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>
                <div className="flex gap-3 mb-4">
                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    KBIS
                  </span>
                  <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                    <span className="material-symbols-outlined text-xs">
                      check_circle
                    </span>
                    ID Card
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      person
                    </span>{" "}
                    Roberto G.
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>{" "}
                    Rome, IT
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-accent text-2xl font-black">
                    L
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Lumière Cinema Group</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-accent">
                          mail
                        </span>{" "}
                        contact@lumieregroup.fr
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-accent">
                          language
                        </span>{" "}
                        www.lumieregroup.fr
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg text-sm font-bold hover:bg-accent/20 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      account_balance
                    </span>
                    View IBAN
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      history
                    </span>
                    History
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-8 bg-charcoal/50 flex flex-col items-center justify-center border-r border-white/10 overflow-y-auto custom-scrollbar">
                  <div className="w-full max-w-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-accent">
                        Document Preview: KBIS Certificate
                      </h5>
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-white/10 rounded">
                          <span className="material-symbols-outlined text-sm">
                            zoom_in
                          </span>
                        </button>
                        <button className="p-1.5 hover:bg-white/10 rounded">
                          <span className="material-symbols-outlined text-sm">
                            download
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="aspect-[1/1.4] bg-white rounded-lg shadow-2xl relative overflow-hidden flex flex-col p-8 group">
                      <div className="border-b-2 border-charcoal/10 pb-4 mb-4 flex justify-between">
                        <div className="w-16 h-16 bg-charcoal/5 rounded" />
                        <div className="space-y-2">
                          <div className="h-2 w-32 bg-charcoal/5 rounded" />
                          <div className="h-2 w-24 bg-charcoal/5 rounded" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 w-1/2 bg-charcoal/10 rounded" />
                        <div className="h-2 w-full bg-charcoal/5 rounded" />
                        <div className="h-2 w-full bg-charcoal/5 rounded" />
                        <div className="h-2 w-3/4 bg-charcoal/5 rounded" />
                        <div className="mt-8 space-y-4">
                          <div className="h-4 w-1/3 bg-charcoal/10 rounded" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-12 bg-charcoal/5 rounded" />
                            <div className="h-12 bg-charcoal/5 rounded" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <span className="bg-white text-charcoal px-6 py-2 rounded-full font-bold shadow-xl">
                          View Full Screen
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-80 p-6 flex flex-col gap-6 bg-white/[0.01]">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                      Checklist
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
                          <span className="material-symbols-outlined text-[14px] text-charcoal font-bold">
                            check
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          KBIS Validity
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
                          <span className="material-symbols-outlined text-[14px] text-charcoal font-bold">
                            check
                          </span>
                        </div>
                        <span className="text-sm font-medium">ID Match</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-accent/30 transition-all cursor-pointer">
                        <div className="w-5 h-5 rounded-md border border-white/20" />
                        <span className="text-sm font-medium">
                          IBAN Confirmed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      className="w-full h-32 bg-charcoal/40 border border-white/10 rounded-xl p-3 text-sm focus:ring-accent focus:border-accent resize-none placeholder:text-white/20"
                      placeholder="Add private notes about this application..."
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/10 flex items-center justify-center gap-2 transition-all">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      Approve Application
                    </button>
                    <button className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary-light text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                      <span className="material-symbols-outlined">cancel</span>
                      Reject / Request Info
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl flex items-center gap-4">
              <span className="material-symbols-outlined text-accent">
                info
              </span>
              <p className="text-sm text-accent/90">
                This organizer has hosted 3 previous events on other platforms
                with a 4.8 star rating.{" "}
                <a className="font-bold underline" href="#">
                  Review report
                </a>
              </p>
            </div>
          </div>
        </main>

        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 hidden">
          <div className="bg-background-dark border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Reject Application</h3>
            <p className="text-white/60 mb-6 text-sm">
              Please select a reason for rejection. This will be sent to the
              organizer.
            </p>

            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                <input
                  className="text-accent focus:ring-accent bg-transparent"
                  name="reason"
                  type="radio"
                />
                <span className="text-sm">Incomplete Documentation</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                <input
                  className="text-accent focus:ring-accent bg-transparent"
                  name="reason"
                  type="radio"
                />
                <span className="text-sm">ID/KBIS Information Mismatch</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                <input
                  className="text-accent focus:ring-accent bg-transparent"
                  name="reason"
                  type="radio"
                />
                <span className="text-sm">Business Type Not Supported</span>
              </label>
              <div className="mt-4">
                <label className="text-xs text-white/40 mb-1 block">
                  Custom Message
                </label>
                <textarea className="w-full h-24 bg-charcoal/40 border border-white/10 rounded-xl p-3 text-sm focus:ring-accent focus:border-accent resize-none" />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-charcoal/50 border-t border-white/5 py-6 px-12">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30 font-bold">
            <span>© 2024 CinéEvent Admin Portal</span>
            <div className="flex gap-6">
              <a className="hover:text-accent transition-colors" href="#">
                Security Audit
              </a>
              <a className="hover:text-accent transition-colors" href="#">
                System Status
              </a>
              <a className="hover:text-accent transition-colors" href="#">
                API Logs
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
