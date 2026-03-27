import React from "react";

export default function EventValidationPage() {
  return (
    <>
      <style>{`
				.event-validation-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.event-validation-page .custom-scrollbar::-webkit-scrollbar {
					width: 5px;
				}

				.event-validation-page .custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
				}

				.event-validation-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}

				.event-validation-page .sidebar-link.active {
					background: rgba(128, 0, 32, 0.2);
					border-right: 3px solid #F5C065;
					color: #F5C065;
				}

				.event-validation-page .event-card.active {
					border-color: #F5C065;
					background: rgba(245, 192, 101, 0.05);
				}
			`}</style>

      <div className="event-validation-page bg-background-dark text-white min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 flex-shrink-0 bg-charcoal border-r border-white/5 flex flex-col">
            <div className="p-8">
              <div className="flex items-center gap-3">
                <div className="text-accent">
                  <span className="material-symbols-outlined text-3xl">
                    movie_filter
                  </span>
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white uppercase">
                  Ciné<span className="text-accent">Admin</span>
                </h1>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-medium">Dashboard</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                <span className="font-medium">Validation Queue</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">flag</span>
                <span className="font-medium">Moderation</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">group</span>
                <span className="font-medium">Organizers</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-medium">System Settings</span>
              </a>
            </nav>

            <div className="p-4 mt-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                    AD
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Admin Panel</p>
                    <p className="text-white/40 italic text-[10px]">
                      Super Admin
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <aside className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-black/20">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
                Awaiting Review (12)
              </h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                  search
                </span>
                <input
                  className="w-full bg-white/5 border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs focus:border-accent focus:ring-0"
                  placeholder="Search events..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              <div className="event-card active border border-white/10 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-tighter">
                    High Priority
                  </span>
                  <span className="text-[10px] text-white/40">2h ago</span>
                </div>
                <h3 className="text-sm font-bold text-accent mb-1">
                  Interstellar: 10th Anniversary
                </h3>
                <p className="text-xs text-white/60 mb-3 truncate">
                  Grand Cinema Hall • IMAX Experience
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtNM216UREDZ1r9Uiamx_r5zDa91f1tXWsp808sdBZMm2jl4Gc_jibiFOyIeB5R6H4ye349qZ6kYlCpDP0EmR7zpqMWlVbZpLgj3IeKmls9pk5liLqFnaeJNYlslC43QXXvs6NLFQgXcH3UVRXA5NJb2wd75tcH3iY51sQ74lvFttytzk0mATrShhsSS923oQZt26K5DcK3TMYt4zFlOJsFA9CS7HIlw6CSwYkeh85snBGW4t-qm8HQGOZWnROvKljEQBCcO605BEM')",
                    }}
                  />
                  <span className="text-[10px] text-white/40 font-medium">
                    Warner Bros. Events
                  </span>
                </div>
              </div>

              <div className="event-card border border-white/5 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/60 border border-white/10 uppercase tracking-tighter">
                    Normal
                  </span>
                  <span className="text-[10px] text-white/40">5h ago</span>
                </div>
                <h3 className="text-sm font-bold text-white/90 mb-1">
                  Classic Noir Night
                </h3>
                <p className="text-xs text-white/60 mb-3 truncate">
                  Boutique Screen 4 • Velvet Seats
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzFbV-Mox4DG-qQdyfcs0qg2hJ-v0Xzad6Bkx7AE9mcsBAs3QB85wOFEKeNUnTDEfRKstY24HO0WQ4zwfuKuZBIDXiy9aewGxps6UPjMhxCqLLSCThxzeDlUye1FJdGqhj-GrEVBlylZITCehMI3FlAPAatHUT0s3G32c0Pc5ta62CaLDksNu4Tw408NHx_hMgIC0pTTX9hdNLzb9zwgDhsnKbt8iCXV7CKP3syYGFPjVZb-t93dY3ePnsrvZVIh9wtWUy-nbo5KAQ')",
                    }}
                  />
                  <span className="text-[10px] text-white/40 font-medium">
                    Vintage Collective
                  </span>
                </div>
              </div>

              <div className="event-card border border-white/5 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/60 border border-white/10 uppercase tracking-tighter">
                    Normal
                  </span>
                  <span className="text-[10px] text-white/40">8h ago</span>
                </div>
                <h3 className="text-sm font-bold text-white/90 mb-1">
                  Anime Expo 2024
                </h3>
                <p className="text-xs text-white/60 mb-3 truncate">
                  Main Hall • Convention Center
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5RhuuqcbywCqh29mgLDmqewSf22M2dvHFUOHyun2AymshCzmRAmNw0MWdnA-HfFC-K7b64CFJ5CKfwkxZSrH0_HOFh_AdbAz1pYGNMwJe-COmRM0SvxQ4xl70n4LHCdEr3muobEsPGyCQKTjRRbKWi5W_AQA3mz6IdFZT7TcUyQ4P6-jVI2naqFv0XsV3t1bOd9L-pV4jYUkLCd9mDA8jMm6jjDDyvMEP3gr9iNFndLERRAVvZKZNg0jSxCXL9K1QEJzk7j13kKIr')",
                    }}
                  />
                  <span className="text-[10px] text-white/40 font-medium">
                    Global Media Inc.
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-charcoal/50 border-b border-white/5 p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-white/40">
                  chevron_left
                </span>
                <h2 className="text-xl font-bold tracking-tight">
                  Review Submission: Interstellar 10th Anniversary
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/5 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    edit_note
                  </span>
                  Request Changes
                </button>
                <button className="flex items-center gap-2 bg-primary text-white border border-primary/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/80 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    block
                  </span>
                  Reject Submission
                </button>
                <button className="flex items-center gap-2 bg-accent text-charcoal px-6 py-2 rounded-lg font-black text-sm hover:bg-accent/90 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    publish
                  </span>
                  Publish Event
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 max-w-6xl mx-auto space-y-10">
                <section>
                  <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-6 group">
                    <img
                      alt="Event Hero"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwdIrF1MJfxDM_8N2yaq11VEakmZ-OS_QYpvbYkJRfSzkm-P5m-EKiAzZOzpMXgoxztbiXrajQo5dx1MLydSP-d1HWRF9bq2AUNZDJ_kIk5OgcMILKh2jmsIxZOXzd2ygvbQP35GjlmNlxTrNbtZ9veUgK6PLVsR6L7RgE1zAXIUKnXpwycKYrPk13HakdRJtsWfiihQWBtyHeX82OcGHF1QmSoVQwcG5U3ikMZuHVZbW1blQ3wKtu71LA5oH0a1Zj3EML1y90I2bF"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-4xl font-black mb-2">
                            Interstellar: 10th Anniversary IMAX
                          </h3>
                          <div className="flex gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                calendar_today
                              </span>{" "}
                              Oct 24, 2024
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                schedule
                              </span>{" "}
                              19:00 - 22:45
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                location_on
                              </span>{" "}
                              Grand Cinema Hall, London
                            </span>
                          </div>
                        </div>
                        <div className="bg-accent/20 backdrop-blur-md border border-accent/30 p-4 rounded-xl text-center min-w-[120px]">
                          <p className="text-[10px] text-accent uppercase font-black tracking-widest">
                            Base Price
                          </p>
                          <p className="text-2xl font-black text-accent">
                            £24.99
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                      <div>
                        <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-4">
                          Event Description
                        </h4>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 leading-relaxed text-white/80 space-y-4">
                          <p>
                            Experience Christopher Nolan's masterpiece like
                            never before. This exclusive 10th-anniversary
                            screening will be presented in full 15/70mm IMAX
                            film format. The event includes a 15-minute
                            introductory piece on the film's scientific legacy
                            and soundtrack production.
                          </p>
                          <p>
                            All attendees will receive a limited edition
                            10th-anniversary commemorative film cell and a
                            high-quality poster of the event. Dress code: Smart
                            Casual.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-4">
                            Pricing Tiers
                          </h4>
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                              <span className="text-sm font-bold text-white/60">
                                Standard Admission
                              </span>
                              <span className="text-sm font-black">£24.99</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                              <span className="text-sm font-bold text-white/60">
                                Premium Royal Box
                              </span>
                              <span className="text-sm font-black text-accent">
                                £45.00
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-white/60">
                                Student / Senior
                              </span>
                              <span className="text-sm font-black">£18.50</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-4">
                            Venue Info
                          </h4>
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
                            <p className="text-sm font-bold">
                              Grand Cinema Hall
                            </p>
                            <p className="text-xs text-white/60">
                              Leicester Square, London WC2H 7NA
                            </p>
                            <div className="pt-3">
                              <span className="flex items-center gap-2 text-xs text-success bg-success/10 px-3 py-1 rounded-lg w-fit">
                                <span className="material-symbols-outlined text-[14px]">
                                  verified_user
                                </span>
                                Verified Venue
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-4">
                        Seating Plan
                      </h4>
                      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="bg-white/5 p-3 text-center border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-white/40">
                          Screen Area
                        </div>
                        <div className="p-6 aspect-square flex flex-col items-center justify-center gap-2">
                          <div className="grid grid-cols-8 gap-1.5">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={`vip-${i}`}
                                className="w-4 h-4 rounded-sm bg-accent/40"
                              />
                            ))}
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={`std-${i}`}
                                className="w-4 h-4 rounded-sm bg-white/10"
                              />
                            ))}
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={`box-${i}`}
                                className="w-4 h-4 rounded-sm bg-primary/40"
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-white/40 mt-4 italic text-center">
                            Standard Layout • 254 Total Capacity
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 flex justify-around border-t border-white/10">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-accent/40" />
                            <span className="text-[10px]">VIP</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <span className="text-[10px]">STD</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            <span className="text-[10px]">BOX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>

          <aside className="w-80 flex-shrink-0 bg-charcoal border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-white/5">
              <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-6">
                Organizer Profile
              </h4>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl bg-cover bg-center border border-accent/20"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtNM216UREDZ1r9Uiamx_r5zDa91f1tXWsp808sdBZMm2jl4Gc_jibiFOyIeB5R6H4ye349qZ6kYlCpDP0EmR7zpqMWlVbZpLgj3IeKmls9pk5liLqFnaeJNYlslC43QXXvs6NLFQgXcH3UVRXA5NJb2wd75tcH3iY51sQ74lvFttytzk0mATrShhsSS923oQZt26K5DcK3TMYt4zFlOJsFA9CS7HIlw6CSwYkeh85snBGW4t-qm8HQGOZWnROvKljEQBCcO605BEM')",
                  }}
                />
                <div>
                  <p className="font-bold text-sm">Warner Bros. Events</p>
                  <p className="text-xs text-white/40 italic">
                    Member since Jan 2021
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-[10px] font-bold text-white/40 uppercase">
                    Past Events
                  </p>
                  <p className="text-lg font-black">142</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-[10px] font-bold text-white/40 uppercase">
                    Rating
                  </p>
                  <p className="text-lg font-black text-accent">4.9/5</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-[10px] text-success font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    verified
                  </span>
                  Trusted Partner Status
                </p>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-xs font-black uppercase text-accent tracking-widest mb-6">
                Validation Checklist
              </h4>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    defaultChecked
                    className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">
                      Media Quality
                    </p>
                    <p className="text-[10px] text-white/40">
                      Hero images &amp; trailers meet UHD standards.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    defaultChecked
                    className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">
                      Pricing Range
                    </p>
                    <p className="text-[10px] text-white/40">
                      Fees are within platform-approved margins.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">
                      Legal Compliance
                    </p>
                    <p className="text-[10px] text-white/40">
                      Terms and licensing documentation present.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    className="mt-0.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">
                      Venue Booking
                    </p>
                    <p className="text-[10px] text-white/40">
                      Confirmation of space from Grand Cinema.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-10">
                <h4 className="text-xs font-black uppercase text-white/40 tracking-widest mb-4">
                  Internal Notes
                </h4>
                <textarea
                  className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-xs h-32 focus:border-accent focus:ring-0"
                  placeholder="Add a note for other administrators..."
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
