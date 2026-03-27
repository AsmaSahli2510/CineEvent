import React from "react";

export default function DonationsPage() {
  return (
    <>
      <style>{`
				.donations-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.donations-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.donations-page .custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.donations-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}

				.donations-page .sidebar-link.active {
					background: rgba(128, 0, 32, 0.1);
					border-right: 3px solid #F5C065;
					color: #F5C065;
				}
			`}</style>

      <div className="donations-page bg-background-dark text-white min-h-screen">
        <div className="flex">
          <aside className="w-64 min-h-screen bg-charcoal border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8">
              <div className="flex items-center gap-3">
                <div className="text-accent">
                  <span className="material-symbols-outlined text-3xl">
                    movie_filter
                  </span>
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                  Ciné<span className="text-accent">Admin</span>
                </h1>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-medium">Overview</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">payments</span>
                <span className="font-medium">Financials</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>
                <span className="font-medium">Organizer Wallets</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                <span className="font-medium">Ticket Sales</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">
                  volunteer_activism
                </span>
                <span className="font-medium">Donations</span>
              </a>
            </nav>

            <div className="p-4 mt-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                    AD
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Finance Dept.</p>
                    <p className="text-white/40 italic text-[10px]">
                      Super Admin Access
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition-colors">
                  Logout Session
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 ml-64 p-10 max-w-[1600px]">
            <header className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Platform Donations Management
                </h2>
                <p className="text-white/60 mt-1">
                  Oversee charitable contributions and impact across all film
                  events.
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all border border-primary shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-sm">
                    add_circle
                  </span>
                  Manage Campaigns
                </button>
                <button className="flex items-center gap-2 bg-white/5 text-accent border border-accent/20 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    receipt_long
                  </span>
                  Reports
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-accent">
                    volunteer_activism
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Total Donations Collected
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-accent">$142,580.00</p>
                  <span className="text-xs font-bold text-success flex items-center">
                    +8.2%
                  </span>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  All-time aggregate platform value
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-white">
                    campaign
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Active Charity Campaigns
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">24</p>
                  <span className="text-xs font-bold text-white/40 flex items-center">
                    Live Now
                  </span>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  Across 12 different NGOs
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">
                    emoji_events
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Top Supporting Organizers
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-primary">
                    Gatsby Events
                  </p>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  Contributed $34,200 this quarter
                </p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full" />
                  Donation Trends Over Time
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-white/60 font-medium">
                      Monthly Contributions
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-6 px-4">
                <div className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-8 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20">
                      $8k
                    </div>
                    <div
                      className="w-12 bg-primary/20 border border-primary/40 rounded-t-lg group-hover:bg-primary/40 transition-all"
                      style={{ height: "35%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    MAR
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-8 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20">
                      $12k
                    </div>
                    <div
                      className="w-12 bg-primary/20 border border-primary/40 rounded-t-lg group-hover:bg-primary/40 transition-all"
                      style={{ height: "55%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    APR
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-8 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20">
                      $10k
                    </div>
                    <div
                      className="w-12 bg-primary/20 border border-primary/40 rounded-t-lg group-hover:bg-primary/40 transition-all"
                      style={{ height: "45%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    MAY
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-8 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20">
                      $18k
                    </div>
                    <div
                      className="w-12 bg-primary/20 border border-primary/40 rounded-t-lg group-hover:bg-primary/40 transition-all"
                      style={{ height: "75%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    JUN
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-8 bg-accent text-charcoal text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      $22k
                    </div>
                    <div
                      className="w-12 bg-accent rounded-t-lg group-hover:brightness-110 transition-all"
                      style={{ height: "95%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-accent uppercase">
                    Current
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group opacity-30">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div
                      className="w-12 bg-white/10 border border-white/20 rounded-t-lg"
                      style={{ height: "40%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    AUG
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3 group opacity-30">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div
                      className="w-12 bg-white/10 border border-white/20 rounded-t-lg"
                      style={{ height: "30%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/40">
                    SEP
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 bg-white/[0.02] flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                      search
                    </span>
                    <input
                      className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-accent outline-none w-64"
                      placeholder="Search donor or event..."
                      type="text"
                    />
                  </div>

                  <select className="bg-charcoal border border-white/10 rounded-lg px-4 py-2 text-xs text-white/60 focus:ring-1 focus:ring-accent outline-none">
                    <option>All Campaign Types</option>
                    <option>Film Restoration</option>
                    <option>Arts Education</option>
                    <option>Climate Action</option>
                    <option>Community Outreach</option>
                  </select>

                  <div className="flex items-center gap-2 bg-charcoal border border-white/10 rounded-lg px-4 py-2">
                    <span className="material-symbols-outlined text-xs text-white/30">
                      calendar_month
                    </span>
                    <span className="text-xs text-white/60">
                      June 1 - June 30, 2024
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      filter_list
                    </span>
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      file_download
                    </span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                        Donor Name
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                        Charity Campaign
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                        Associated Event
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                        Amount
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">
                        Impact Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-sm">Julian Vance</p>
                        <p className="text-[10px] text-white/40 mt-1">
                          Premium Member
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-info" />
                          <p className="text-xs font-medium">
                            Film Restoration Project
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-white/80">
                          The Great Gatsby Gala
                        </p>
                      </td>
                      <td className="p-6 text-right">
                        <p className="font-black text-sm text-accent">
                          $500.00
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                          Processed
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-sm">Clara Montgomery</p>
                        <p className="text-[10px] text-white/40 mt-1">
                          First-time Donor
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <p className="text-xs font-medium">
                            Cinephile Youth Fund
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-white/80">Noir Fest 2024</p>
                      </td>
                      <td className="p-6 text-right">
                        <p className="font-black text-sm text-accent">
                          $1,200.00
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                          Processed
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-sm">Marcus Aurelius</p>
                        <p className="text-[10px] text-white/40 mt-1">
                          Platinum Partner
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          <p className="text-xs font-medium">
                            Archive Preservation
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-white/80">
                          Silent Cinema Night
                        </p>
                      </td>
                      <td className="p-6 text-right">
                        <p className="font-black text-sm text-accent">
                          $250.00
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/10 text-white/40 border border-white/10 uppercase tracking-tighter">
                          Pending
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-sm">Sarah Jenkins</p>
                        <p className="text-[10px] text-white/40 mt-1">
                          Individual
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <p className="text-xs font-medium">
                            Cinephile Youth Fund
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-white/80">
                          Docu-Series Premiere
                        </p>
                      </td>
                      <td className="p-6 text-right">
                        <p className="font-black text-sm text-accent">$50.00</p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                          Processed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  Showing 1-10 of 482 Donations
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-sm leading-none">
                      chevron_left
                    </span>
                  </button>
                  <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg border border-primary/50">
                    1
                  </button>
                  <button className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-bold rounded-lg hover:bg-white/10">
                    2
                  </button>
                  <button className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-bold rounded-lg hover:bg-white/10">
                    3
                  </button>
                  <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-sm leading-none">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
