import React from "react";

export default function OrganizerWalletPage() {
  return (
    <>
      <style>{`
				.organizer-wallet-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.organizer-wallet-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.organizer-wallet-page .custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.organizer-wallet-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}

				.organizer-wallet-page .sidebar-link.active {
					background: rgba(128, 0, 32, 0.1);
					border-right: 3px solid #F5C065;
					color: #F5C065;
				}
			`}</style>

      <div className="organizer-wallet-page bg-background-dark text-white min-h-screen">
        <div className="flex">
          <aside className="w-64 min-h-screen bg-charcoal border-r border-white/5 flex flex-col fixed left-0 top-0">
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
                className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
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
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
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
                  Organizer Payout Management
                </h2>
                <p className="text-white/60 mt-1">
                  Review balances, verify bank details, and execute
                  disbursements.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-white/5 text-white/60 border border-white/10 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    history
                  </span>
                  Payout History
                </button>
                <button className="flex items-center gap-2 bg-accent text-charcoal px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all border border-accent shadow-lg shadow-accent/10">
                  <span className="material-symbols-outlined text-sm">
                    account_balance
                  </span>
                  Batch Payout
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">
                    pending_actions
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Total Outstanding Balance
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-accent">$128,450.00</p>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  Owed to 42 active organizers
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">
                    verified_user
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Total Paid to Date
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">
                    $2,145,900.00
                  </p>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  Fiscal year 2024 disbursements
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">
                    calendar_today
                  </span>
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                  Last Payout Cycle Date
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-primary">
                    Oct 24, 2023
                  </p>
                </div>
                <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                  Weekly cycle: Every Friday
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-4">
                    Sort &amp; Filter
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">
                        Balance Priority
                      </label>
                      <select className="w-full bg-white/5 border-white/10 rounded-lg text-xs text-white focus:ring-accent focus:border-accent">
                        <option>High Balance First</option>
                        <option>Low Balance First</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">
                        Verification Status
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            type="checkbox"
                          />
                          <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                            Pending Verification
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            defaultChecked
                            className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            type="checkbox"
                          />
                          <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                            Verified Only
                          </span>
                        </label>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-black rounded-lg transition-colors border border-primary/30">
                      Apply Filters
                    </button>
                  </div>
                </div>

                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <span className="material-symbols-outlined text-sm">
                      info
                    </span>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">
                      Compliance Note
                    </h4>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed italic">
                    Payouts are only allowed for organizers with "Bank Details
                    Verified" status. Payouts over $10,000 require manual CFO
                    override.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold flex items-center gap-2">
                      <span className="w-1 h-5 bg-accent rounded-full" />
                      Organizer List
                    </h3>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                        search
                      </span>
                      <input
                        className="bg-white/5 border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs w-64 focus:ring-accent focus:border-accent"
                        placeholder="Search organizer..."
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                            Organizer
                          </th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                            Status
                          </th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                            Comm. Rate
                          </th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                            Current Balance
                          </th>
                          <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent text-xl">
                                  stars
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">
                                  Lumière Cinema
                                </p>
                                <p className="text-[10px] text-white/40">
                                  ID: ORG-4921
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                verified
                              </span>
                              Bank Verified
                            </span>
                          </td>
                          <td className="p-4 text-xs font-medium text-white/60">
                            15.0%
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-black text-white">
                              $42,900.00
                            </p>
                            <p className="text-[9px] text-white/30">
                              Last payout: 12 days ago
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <button className="bg-accent hover:brightness-110 text-charcoal px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all shadow-lg shadow-accent/5">
                              Trigger Payout
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-xl">
                                  theater_comedy
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">
                                  Noir Collective
                                </p>
                                <p className="text-[10px] text-white/40">
                                  ID: ORG-8842
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                verified
                              </span>
                              Bank Verified
                            </span>
                          </td>
                          <td className="p-4 text-xs font-medium text-white/60">
                            12.5%
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-black text-white">
                              $18,450.50
                            </p>
                            <p className="text-[9px] text-white/30">
                              Last payout: 7 days ago
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <button className="bg-accent hover:brightness-110 text-charcoal px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all shadow-lg shadow-accent/5">
                              Trigger Payout
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white/40 text-xl">
                                  stadium
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">
                                  Gatsby Events
                                </p>
                                <p className="text-[10px] text-white/40">
                                  ID: ORG-9174
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-danger/20 text-danger border border-danger/20 uppercase tracking-tighter">
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                warning
                              </span>
                              Verification Pending
                            </span>
                          </td>
                          <td className="p-4 text-xs font-medium text-white/60">
                            10.0%
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-black text-white">
                              $67,100.00
                            </p>
                            <p className="text-[9px] text-white/30">
                              Never paid
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              className="bg-white/5 text-white/20 cursor-not-allowed px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                              disabled>
                              Trigger Payout
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent text-xl">
                                  camera_roll
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">
                                  Vintage Film Club
                                </p>
                                <p className="text-[10px] text-white/40">
                                  ID: ORG-1102
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                verified
                              </span>
                              Bank Verified
                            </span>
                          </td>
                          <td className="p-4 text-xs font-medium text-white/60">
                            15.0%
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-black text-white">
                              $4,210.00
                            </p>
                            <p className="text-[9px] text-white/30">
                              Last payout: 1 month ago
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <button className="bg-accent hover:brightness-110 text-charcoal px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all shadow-lg shadow-accent/5">
                              Trigger Payout
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Showing 4 of 42 Organizers
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-sm leading-none">
                          chevron_left
                        </span>
                      </button>
                      <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg border border-primary/50 shadow-sm">
                        1
                      </button>
                      <button className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-bold rounded-lg hover:bg-white/10">
                        2
                      </button>
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-sm leading-none">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
