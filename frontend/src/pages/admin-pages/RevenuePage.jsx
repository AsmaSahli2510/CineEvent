import React from "react";
import { Link } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";

export default function RevenuePage() {
  return (
    <>
      <style>{`
				.revenue-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.revenue-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.revenue-page .custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.revenue-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}

				.revenue-page .sidebar-link.active {
					background: rgba(128, 0, 32, 0.1);
					border-right: 3px solid #F5C065;
					color: #F5C065;
				}

				.revenue-page .chart-bar {
					transition: height 0.3s ease;
				}
			`}</style>

      <div className="revenue-page bg-background-dark text-white min-h-screen">
        <AdminPageFrame
          title="Revenue"
          subtitle="Track platform financial performance">
          <div className="flex">
            <aside className="hidden w-64 min-h-screen bg-charcoal border-r border-white/5 flex-col fixed left-0 top-0">
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">
                      movie_filter
                    </span>
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                    CINÉ<span className="text-accent">ADMIN</span>
                  </h1>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/dashboard">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                  to="/admin/revenue">
                  <span className="material-symbols-outlined">payments</span>
                  <span className="font-medium">Revenue</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/organizers/wallet">
                  <span className="material-symbols-outlined">
                    account_balance_wallet
                  </span>
                  <span className="font-medium">Organizer Wallets</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/events/validation">
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  <span className="font-medium">Event Validation</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/donations">
                  <span className="material-symbols-outlined">
                    volunteer_activism
                  </span>
                  <span className="font-medium">Donations</span>
                </Link>
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

            <main className="flex-1 ml-0 p-10 max-w-[1600px]">
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Global Financials &amp; Donation Tracking
                  </h2>
                  <p className="text-white/60 mt-1">
                    Real-time revenue monitoring and organizer payout
                    management.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all border border-primary shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
                    Export Ledger
                  </button>
                  <button className="flex items-center gap-2 bg-white/5 text-accent border border-accent/20 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      settings
                    </span>
                    Commission Rules
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      payments
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Total Platform Revenue
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-accent">
                      $482,904.50
                    </p>
                    <span className="text-xs font-bold text-success flex items-center">
                      +12.4%
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Includes commissions &amp; service fees
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      volunteer_activism
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Total Donations Collected
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-white">$94,210.00</p>
                    <span className="text-xs font-bold text-success flex items-center">
                      +5.2%
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Across 14 active charity campaigns
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      account_balance
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Pending Payouts
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-primary">
                      $128,450.00
                    </p>
                    <span className="text-xs font-bold text-white/40 flex items-center">
                      8 Organizers
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Scheduled for Friday disbursement
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white/5 p-8 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="w-1 h-6 bg-accent rounded-full" />
                      Revenue vs. Donations Volume
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-xs text-white/60 font-medium tracking-wide">
                          Tickets
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-white/60 font-medium tracking-wide">
                          Donations
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 px-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div
                          className="chart-bar w-6 bg-accent rounded-t-sm"
                          style={{ height: "60%" }}
                        />
                        <div
                          className="chart-bar w-6 bg-primary rounded-t-sm"
                          style={{ height: "20%" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/40">
                        MON
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div
                          className="chart-bar w-6 bg-accent rounded-t-sm"
                          style={{ height: "85%" }}
                        />
                        <div
                          className="chart-bar w-6 bg-primary rounded-t-sm"
                          style={{ height: "35%" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/40">
                        TUE
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div
                          className="chart-bar w-6 bg-accent rounded-t-sm"
                          style={{ height: "70%" }}
                        />
                        <div
                          className="chart-bar w-6 bg-primary rounded-t-sm"
                          style={{ height: "25%" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/40">
                        WED
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div
                          className="chart-bar w-6 bg-accent rounded-t-sm"
                          style={{ height: "95%" }}
                        />
                        <div
                          className="chart-bar w-6 bg-primary rounded-t-sm"
                          style={{ height: "45%" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/40 text-accent uppercase">
                        Today
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 opacity-30">
                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div
                          className="chart-bar w-6 bg-accent rounded-t-sm"
                          style={{ height: "40%" }}
                        />
                        <div
                          className="chart-bar w-6 bg-primary rounded-t-sm"
                          style={{ height: "10%" }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/40">
                        FRI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Organizer Wallets</h3>
                    <button className="text-accent text-xs font-bold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                          <span className="material-symbols-outlined text-accent text-sm">
                            stars
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold">Lumière Cinema</p>
                          <p className="text-[10px] text-white/40">Comm: 15%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-white">$42,900</p>
                        <button className="text-[9px] uppercase font-black text-accent mt-1 tracking-tighter hover:brightness-125">
                          Trigger Payout
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                          <span className="material-symbols-outlined text-primary text-sm">
                            theater_comedy
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold">Noir Collective</p>
                          <p className="text-[10px] text-white/40">Comm: 12%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-white">$18,450</p>
                        <button className="text-[9px] uppercase font-black text-accent mt-1 tracking-tighter hover:brightness-125">
                          Trigger Payout
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                          <span className="material-symbols-outlined text-white/60 text-sm">
                            stadium
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold">Gatsby Events</p>
                          <p className="text-[10px] text-white/40">Comm: 10%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-white">$67,100</p>
                        <button className="text-[9px] uppercase font-black text-accent mt-1 tracking-tighter hover:brightness-125">
                          Trigger Payout
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-[10px] text-center text-white/30 italic">
                      All payouts require dual admin authorization
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-bold">Recent Global Transactions</h3>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-accent/10 text-[10px] font-bold text-accent border border-accent/20">
                      Ticket Sales
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-primary/10 text-[10px] font-bold text-primary border border-primary/20">
                      Donations
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                          Ref ID
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                          Transaction Details
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                          Organizer
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">
                          Type
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                          Net Amount
                        </th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                          Platform Fee
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-6 text-xs font-mono text-white/40">
                          TXN-9281-01
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-sm">
                            2x VIP - The Great Gatsby Gala
                          </p>
                          <p className="text-[10px] text-white/40 mt-1">
                            Buyer: julian.vance@mail.com
                          </p>
                        </td>
                        <td className="p-6">
                          <p className="text-xs font-medium">Gatsby Events</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-accent/20 text-accent border border-accent/20 uppercase tracking-tighter">
                            Ticket Sale
                          </span>
                        </td>
                        <td className="p-6 text-right font-black text-sm">
                          $450.00
                        </td>
                        <td className="p-6 text-right text-xs text-white/40 font-bold">
                          $45.00
                        </td>
                      </tr>

                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-6 text-xs font-mono text-white/40">
                          TXN-8842-99
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-sm">
                            Direct Donation (Dons)
                          </p>
                          <p className="text-[10px] text-white/40 mt-1">
                            Campaign: Cinephile Youth Fund
                          </p>
                        </td>
                        <td className="p-6">
                          <p className="text-xs font-medium">Platform Global</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-primary/20 text-primary border border-primary/20 uppercase tracking-tighter">
                            Donation
                          </span>
                        </td>
                        <td className="p-6 text-right font-black text-sm text-primary">
                          $1,200.00
                        </td>
                        <td className="p-6 text-right text-xs text-white/40 font-bold">
                          $0.00 (Waived)
                        </td>
                      </tr>

                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-6 text-xs font-mono text-white/40">
                          TXN-9174-22
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-sm">
                            Standard Ticket - Noir Fest
                          </p>
                          <p className="text-[10px] text-white/40 mt-1">
                            Buyer: anonymous@guest.com
                          </p>
                        </td>
                        <td className="p-6">
                          <p className="text-xs font-medium">Noir Collective</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-accent/20 text-accent border border-accent/20 uppercase tracking-tighter">
                            Ticket Sale
                          </span>
                        </td>
                        <td className="p-6 text-right font-black text-sm">
                          $85.00
                        </td>
                        <td className="p-6 text-right text-xs text-white/40 font-bold">
                          $10.20
                        </td>
                      </tr>

                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-6 text-xs font-mono text-white/40">
                          TXN-9302-15
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-sm">
                            Direct Donation (Dons)
                          </p>
                          <p className="text-[10px] text-white/40 mt-1">
                            Campaign: Film Restoration project
                          </p>
                        </td>
                        <td className="p-6">
                          <p className="text-xs font-medium">Lumière Cinema</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-primary/20 text-primary border border-primary/20 uppercase tracking-tighter">
                            Donation
                          </span>
                        </td>
                        <td className="p-6 text-right font-black text-sm text-primary">
                          $50.00
                        </td>
                        <td className="p-6 text-right text-xs text-white/40 font-bold">
                          $1.50 (Process)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Page 1 of 84 Ledger
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
        </AdminPageFrame>
      </div>
    </>
  );
}
