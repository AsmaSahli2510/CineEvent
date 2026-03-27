import React from "react";

export default function StatisticsPage() {
  return (
    <>
      <style>{`
				.statistics-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.statistics-page .custom-scrollbar::-webkit-scrollbar {
					width: 4px;
				}

				.statistics-page .custom-scrollbar::-webkit-scrollbar-track {
					background: #1C1C1C;
				}

				.statistics-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #F5C065;
					border-radius: 10px;
				}

				.statistics-page .chart-gradient-burgundy {
					background: linear-gradient(180deg, rgba(128, 0, 32, 0.4) 0%, rgba(128, 0, 32, 0) 100%);
				}

				.statistics-page .chart-gradient-gold {
					background: linear-gradient(180deg, rgba(245, 192, 101, 0.4) 0%, rgba(245, 192, 101, 0) 100%);
				}
			`}</style>

      <div className="statistics-page bg-background-dark text-white min-h-screen flex">
        <aside className="w-72 border-r border-white/10 flex flex-col fixed h-full bg-charcoal z-50">
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-4xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white">
                CINÉ<span className="text-accent">EVENT</span>
              </h1>
            </div>
            <p className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase mt-1 opacity-80">
              Admin Console
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-white font-bold"
              href="#">
              <span className="material-symbols-outlined">dashboard</span>
              Global Analytics
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">payments</span>
              Financial Reports
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">theater_comedy</span>
              Event Performance
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">group</span>
              User Management
            </a>
            <a
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
              href="#">
              <span className="material-symbols-outlined">map</span>
              Market Heatmaps
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
                Platform Global Analytics
              </h2>
              <p className="text-white/40 text-sm">
                Real-time performance metrics and executive financial oversight.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
                <span className="material-symbols-outlined text-sm">
                  picture_as_pdf
                </span>
                Export PDF
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-charcoal hover:opacity-90 rounded-xl text-sm font-black transition-all">
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Export Excel
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-accent text-3xl">
                  monetization_on
                </span>
                <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +12.5%
                </span>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">
                Total Gross Revenue
              </p>
              <h3 className="text-3xl font-black">$4,285,900</h3>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-accent text-3xl">
                  confirmation_number
                </span>
                <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +8.2%
                </span>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">
                Total Bookings
              </p>
              <h3 className="text-3xl font-black">152,430</h3>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-accent text-3xl">
                  groups
                </span>
                <span className="text-red-400 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_down
                  </span>
                  -2.1%
                </span>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">
                Active Organizers
              </p>
              <h3 className="text-3xl font-black">1,842</h3>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-accent text-3xl">
                  insights
                </span>
                <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +5.4%
                </span>
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">
                Avg. Ticket Value
              </p>
              <h3 className="text-3xl font-black">$68.50</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-charcoal border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-bold">Year-Over-Year Revenue</h4>
                  <p className="text-white/40 text-xs">
                    Comparison between 2023 (Burgundy) and 2024 (Gold)
                  </p>
                </div>
                <select className="bg-white/5 border-none text-xs rounded-lg focus:ring-accent">
                  <option>Monthly View</option>
                  <option>Quarterly View</option>
                </select>
              </div>

              <div className="relative h-64 flex items-end gap-3 px-2">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[40%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[65%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">JAN</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[45%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[70%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">FEB</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[55%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[85%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">MAR</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[50%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[75%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">APR</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[60%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[90%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">MAY</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="w-1/2 bg-primary/40 h-[65%] rounded-t-sm" />
                    <div className="w-1/2 bg-accent h-[95%] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] text-white/40">JUN</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-l border-white/10 pl-2">
                  <div className="w-full border-t border-white/5 text-[9px] text-white/20 pt-1">
                    $1.2M
                  </div>
                  <div className="w-full border-t border-white/5 text-[9px] text-white/20 pt-1">
                    $800k
                  </div>
                  <div className="w-full border-t border-white/5 text-[9px] text-white/20 pt-1">
                    $400k
                  </div>
                  <div className="w-full h-0" />
                </div>
              </div>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-8">Conversion Funnel</h4>
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold">Website Visits</span>
                    <span className="text-white/60">842,000</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-full" />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold">Event Viewers</span>
                    <span className="text-white/60">312,500 (37%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent/80 w-[37%]" />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold">Checkout Init</span>
                    <span className="text-white/60">98,200 (11%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent/60 w-[11%]" />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold">Successful Booking</span>
                    <span className="text-white/60">42,300 (5%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[5%]" />
                  </div>
                </div>
              </div>

              <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">
                  Avg. Conversion Rate
                </p>
                <p className="text-2xl font-black text-accent">5.02%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-charcoal border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold">City Activity Heatmap</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] text-white/40">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[10px] text-white/40">High</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] tracking-widest">
                      <th className="pb-4 font-bold">City Location</th>
                      <th className="pb-4 font-bold">Active Events</th>
                      <th className="pb-4 font-bold">Ticket Volume</th>
                      <th className="pb-4 font-bold">Market Intensity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-4 font-bold">New York City</td>
                      <td className="py-4">124</td>
                      <td className="py-4">12,450</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full">
                          <div className="bg-accent h-full w-[95%] rounded-full shadow-[0_0_8px_rgba(245,192,101,0.4)]" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">London</td>
                      <td className="py-4">98</td>
                      <td className="py-4">8,920</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full">
                          <div className="bg-accent h-full w-[82%] rounded-full shadow-[0_0_8px_rgba(245,192,101,0.4)]" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">Paris</td>
                      <td className="py-4">76</td>
                      <td className="py-4">7,100</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full">
                          <div className="bg-accent h-full w-[74%] rounded-full shadow-[0_0_8px_rgba(245,192,101,0.4)]" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">Los Angeles</td>
                      <td className="py-4">112</td>
                      <td className="py-4">10,800</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full">
                          <div className="bg-accent h-full w-[88%] rounded-full shadow-[0_0_8px_rgba(245,192,101,0.4)]" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">Tokyo</td>
                      <td className="py-4">45</td>
                      <td className="py-4">3,200</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full">
                          <div className="bg-primary h-full w-[35%] rounded-full shadow-[0_0_8px_rgba(128,0,32,0.4)]" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-6">Traffic Sources</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Organic Search</span>
                      <span className="text-xs text-white/60">45%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[45%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">share</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Social Media</span>
                      <span className="text-xs text-white/60">28%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[28%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Newsletter</span>
                      <span className="text-xs text-white/60">15%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[15%]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined">ads_click</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold">Direct/Ads</span>
                      <span className="text-xs text-white/60">12%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[12%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/20">
                <h5 className="text-sm font-bold text-accent mb-2">
                  Executive Summary
                </h5>
                <p className="text-xs text-white/70 leading-relaxed">
                  Overall performance has increased by{" "}
                  <span className="text-white font-bold">18.4%</span> since the
                  introduction of premium gala series in metropolitan hubs.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
