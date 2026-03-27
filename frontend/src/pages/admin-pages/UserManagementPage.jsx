import React from "react";

export default function UserManagementPage() {
  return (
    <>
      <style>{`
				.user-management-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.user-management-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.user-management-page .custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.user-management-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}
			`}</style>

      <div className="user-management-page bg-background-dark text-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background-dark/95 backdrop-blur-md px-6 md:px-20 py-4">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-4xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white">
                CINE<span className="text-accent">ADMIN</span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <a
                className="text-white/60 hover:text-accent font-medium text-sm transition-colors"
                href="#">
                Dashboard
              </a>
              <a
                className="text-white hover:text-accent font-medium text-sm transition-colors border-b-2 border-accent pb-1"
                href="#">
                Users
              </a>
              <a
                className="text-white/60 hover:text-accent font-medium text-sm transition-colors"
                href="#">
                Events
              </a>
              <a
                className="text-white/60 hover:text-accent font-medium text-sm transition-colors"
                href="#">
                Revenue
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 mr-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                  AD
                </div>
                <span className="text-sm font-medium">Administrator</span>
              </div>
              <button className="text-white/60 hover:text-white">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-20 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">
                User &amp; Role Management
              </h2>
              <p className="text-white/60">
                Manage permissions, monitor account status, and oversee platform
                participants.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold">
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-bold shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">
                  person_add
                </span>
                Invite User
              </button>
            </div>
          </div>

          <div className="bg-charcoal/50 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  search
                </span>
                <input
                  className="w-full bg-white/5 border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-accent focus:border-accent text-sm text-white placeholder:text-white/40 transition-all"
                  placeholder="Search by name, email, or ID..."
                  type="text"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="relative min-w-[160px]">
                  <select className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent text-sm text-white appearance-none">
                    <option className="bg-charcoal">All Roles</option>
                    <option className="bg-charcoal">Organizers</option>
                    <option className="bg-charcoal">Spectators</option>
                    <option className="bg-charcoal">Editors</option>
                  </select>
                </div>
                <div className="relative min-w-[160px]">
                  <select className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent text-sm text-white appearance-none">
                    <option className="bg-charcoal">Account Status</option>
                    <option className="bg-charcoal text-green-400">
                      Active
                    </option>
                    <option className="bg-charcoal text-yellow-400">
                      Suspended
                    </option>
                    <option className="bg-charcoal text-red-400">Banned</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-accent text-charcoal font-bold rounded-xl hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    filter_alt
                  </span>
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="bg-charcoal/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                      User Details
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                      Role
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                      Registration Date
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                      Status
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                          <span className="material-symbols-outlined text-white/40">
                            person
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            Julianne Moore
                          </div>
                          <div className="text-xs text-white/40">
                            j.moore@cinemail.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-accent/10 text-accent border border-accent/20">
                        Organizer
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60">
                      Oct 12, 2023
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-bold">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all group-hover:visible"
                          title="Change Role">
                          <span className="material-symbols-outlined text-xl">
                            manage_accounts
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-yellow-500 transition-all"
                          title="Suspend">
                          <span className="material-symbols-outlined text-xl">
                            block
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                          title="Delete">
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 text-accent font-bold">
                          AB
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            Alexander Bennett
                          </div>
                          <div className="text-xs text-white/40">
                            a.bennett@spectator.net
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-primary/20 text-white/80 border border-primary/20">
                        Spectator
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60">
                      Nov 05, 2023
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-white/40">
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                        <span className="text-xs font-bold">Inactive</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all"
                          title="Change Role">
                          <span className="material-symbols-outlined text-xl">
                            manage_accounts
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-yellow-500 transition-all"
                          title="Suspend">
                          <span className="material-symbols-outlined text-xl">
                            block
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                          title="Delete">
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors group bg-yellow-400/5">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                          <span className="material-symbols-outlined text-white/40">
                            person
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            Isabella Thorne
                          </div>
                          <div className="text-xs text-white/40">
                            isa.thorne@events.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-accent/10 text-accent border border-accent/20">
                        Organizer
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60">
                      Jan 22, 2024
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-xs font-bold">Suspended</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 bg-yellow-500 text-charcoal rounded-lg font-bold text-xs px-3 py-1 hover:bg-yellow-400 transition-all">
                          Lift Suspension
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                          title="Delete">
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors group border-b-0">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                          <span className="material-symbols-outlined text-white/40">
                            person
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            Dominic Toretto
                          </div>
                          <div className="text-xs text-white/40">
                            fast@famiglia.it
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-primary/20 text-white/80 border border-primary/20">
                        Spectator
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60">
                      Feb 02, 2024
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs font-bold">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all"
                          title="Change Role">
                          <span className="material-symbols-outlined text-xl">
                            manage_accounts
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-yellow-500 transition-all"
                          title="Suspend">
                          <span className="material-symbols-outlined text-xl">
                            block
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                          title="Delete">
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-white/40">
                Showing 4 of 1,284 users
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-charcoal border border-white/10 rounded-md text-white/40 text-xs hover:border-accent transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-accent text-charcoal font-black rounded-md text-xs">
                  1
                </button>
                <button className="px-3 py-1 bg-charcoal border border-white/10 rounded-md text-white/80 text-xs hover:border-accent transition-colors">
                  2
                </button>
                <button className="px-3 py-1 bg-charcoal border border-white/10 rounded-md text-white/80 text-xs hover:border-accent transition-colors">
                  3
                </button>
                <button className="px-3 py-1 bg-charcoal border border-white/10 rounded-md text-white/80 text-xs hover:border-accent transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-charcoal text-white/60 py-8 px-6 md:px-20 border-t border-white/5">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-2xl">
                  movie_filter
                </span>
              </div>
              <p>© 2024 CineEvent International Admin Console.</p>
            </div>
            <div className="flex gap-6">
              <a className="hover:text-accent transition-colors" href="#">
                System Status
              </a>
              <a className="hover:text-accent transition-colors" href="#">
                Internal Wiki
              </a>
              <a className="hover:text-accent transition-colors" href="#">
                Support Desk
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
