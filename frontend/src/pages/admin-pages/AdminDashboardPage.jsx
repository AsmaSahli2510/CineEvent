import React from "react";

export default function AdminDashboardPage() {
	return (
		<>
			<style>{`
				.admin-dashboard-page {
					font-family: 'Spline Sans', sans-serif;
					background-color: #1C1C1C;
				}

				.admin-dashboard-page .luxury-gradient {
					background: linear-gradient(135deg, #262626 0%, #1C1C1C 100%);
				}

				.admin-dashboard-page .chart-grid {
					background-image: radial-gradient(circle, #ffffff05 1px, transparent 1px);
					background-size: 30px 30px;
				}
			`}</style>

			<div className="admin-dashboard-page text-white">
				<div className="flex min-h-screen bg-background-dark">
					<aside className="w-72 border-r border-white/5 bg-charcoal hidden lg:flex flex-col sticky top-0 h-screen">
						<div className="p-8">
							<div className="flex items-center gap-3 mb-10">
								<div className="text-accent">
									<span className="material-symbols-outlined text-3xl">movie_filter</span>
								</div>
								<h1 className="text-xl font-black tracking-tighter text-white uppercase">
									CINÉ<span className="text-accent">EVENT</span>
								</h1>
							</div>

							<nav className="space-y-2">
								<a className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/20 text-accent border border-primary/30" href="#">
									<span className="material-symbols-outlined">dashboard</span>
									<span className="font-bold text-sm">Dashboard</span>
								</a>
								<a className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all" href="#">
									<span className="material-symbols-outlined">event</span>
									<span className="font-bold text-sm">Event Management</span>
								</a>
								<a className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all" href="#">
									<span className="material-symbols-outlined">group</span>
									<span className="font-bold text-sm">Users &amp; Organizers</span>
								</a>
								<a className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all" href="#">
									<span className="material-symbols-outlined">payments</span>
									<span className="font-bold text-sm">Financials</span>
								</a>
							</nav>
						</div>

						<div className="mt-auto p-8 border-t border-white/5">
							<h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Moderation Alerts</h3>
							<div className="space-y-4">
								<a className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors" href="#">
									<div className="w-2 h-2 rounded-full bg-red-500" />
									<div className="flex-1">
										<p className="text-xs font-bold text-white">12 Flagged Comments</p>
										<p className="text-[10px] text-white/40">Requires review</p>
									</div>
									<span className="material-symbols-outlined text-sm text-white/40">chevron_right</span>
								</a>
								<a className="flex items-center gap-3 p-3 bg-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-colors" href="#">
									<div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
									<div className="flex-1">
										<p className="text-xs font-bold text-white">4 Pending Organizers</p>
										<p className="text-[10px] text-white/40">Identity verification</p>
									</div>
									<span className="material-symbols-outlined text-sm text-white/40">chevron_right</span>
								</a>
							</div>
						</div>
					</aside>

					<main className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
						<header className="flex justify-between items-center mb-10">
							<div>
								<h2 className="text-3xl font-black text-white">Platform Overview</h2>
								<p className="text-white/40 font-medium">Global analytics and performance monitoring</p>
							</div>
							<div className="flex items-center gap-4">
								<div className="relative">
									<span className="material-symbols-outlined text-white/60 hover:text-accent cursor-pointer p-2">notifications</span>
									<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-charcoal" />
								</div>
								<div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-6">
									<div className="text-right">
										<p className="text-sm font-bold text-white leading-none">Admin Profile</p>
										<p className="text-[10px] font-bold text-accent uppercase tracking-tighter">Super Admin</p>
									</div>
									<div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-charcoal font-black">AD</div>
								</div>
							</div>
						</header>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
							<div className="bg-card-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-accent/10" />
								<div className="flex justify-between items-start mb-4">
									<div className="p-3 bg-white/5 rounded-xl">
										<span className="material-symbols-outlined text-accent">group</span>
									</div>
									<span className="text-green-500 text-xs font-bold flex items-center gap-1">
										<span className="material-symbols-outlined text-sm">trending_up</span>
										+12%
									</span>
								</div>
								<h4 className="text-white/40 font-bold text-sm uppercase tracking-wider">Active Users</h4>
								<p className="text-4xl font-black mt-1">42,892</p>
							</div>

							<div className="bg-card-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10" />
								<div className="flex justify-between items-start mb-4">
									<div className="p-3 bg-white/5 rounded-xl">
										<span className="material-symbols-outlined text-primary">live_tv</span>
									</div>
									<span className="text-accent text-xs font-bold flex items-center gap-1">Live Now</span>
								</div>
								<h4 className="text-white/40 font-bold text-sm uppercase tracking-wider">Live Events</h4>
								<p className="text-4xl font-black mt-1">1,204</p>
							</div>

							<div className="bg-card-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-accent/10" />
								<div className="flex justify-between items-start mb-4">
									<div className="p-3 bg-white/5 rounded-xl">
										<span className="material-symbols-outlined text-accent">payments</span>
									</div>
									<span className="text-green-500 text-xs font-bold flex items-center gap-1">
										<span className="material-symbols-outlined text-sm">trending_up</span>
										+24.8%
									</span>
								</div>
								<h4 className="text-white/40 font-bold text-sm uppercase tracking-wider">Global Gross Revenue</h4>
								<p className="text-4xl font-black mt-1">$4.2M</p>
							</div>
						</div>

						<div className="bg-card-dark border border-white/5 rounded-2xl p-8 mb-10 relative chart-grid">
							<div className="flex items-center justify-between mb-10">
								<div>
									<h3 className="text-xl font-black text-white">Platform Growth</h3>
									<p className="text-white/40 text-sm">Monthly active participation &amp; revenue velocity</p>
								</div>
								<div className="flex gap-2">
									<button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">Last 12 Months</button>
									<button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/40">2023</button>
								</div>
							</div>

							<div className="h-[400px] w-full relative flex items-end justify-between px-4">
								<div className="absolute inset-0 flex flex-col justify-between py-2 text-[10px] text-white/20 font-bold">
									<span>$5.0M</span>
									<span>$4.0M</span>
									<span>$3.0M</span>
									<span>$2.0M</span>
									<span>$1.0M</span>
									<span>$0</span>
								</div>

								<svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 400">
									<defs>
										<linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
											<stop offset="0%" stopColor="#800020" stopOpacity="0.3" />
											<stop offset="100%" stopColor="#800020" stopOpacity="0" />
										</linearGradient>
									</defs>
									<path d="M0,350 L100,320 L200,340 L300,280 L400,300 L500,220 L600,240 L700,180 L800,150 L900,100 L1000,120 L1100,50 L1200,50 V400 H0 Z" fill="url(#chartGradient)" />
									<path d="M0,350 L100,320 L200,340 L300,280 L400,300 L500,220 L600,240 L700,180 L800,150 L900,100 L1000,120 L1100,50 L1200,50" fill="none" stroke="#F5C065" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
									<circle cx="100" cy="320" fill="#F5C065" r="5" stroke="#1C1C1C" strokeWidth="2" />
									<circle cx="500" cy="220" fill="#F5C065" r="5" stroke="#1C1C1C" strokeWidth="2" />
									<circle cx="900" cy="100" fill="#F5C065" r="5" stroke="#1C1C1C" strokeWidth="2" />
									<circle cx="1100" cy="50" fill="#800020" r="6" stroke="#F5C065" strokeWidth="2" />
								</svg>

								<div className="w-full flex justify-between text-[10px] text-white/40 font-bold mt-4 border-t border-white/5 pt-4">
									<span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
									<span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
								</div>
							</div>
						</div>

						<div className="bg-card-dark border border-white/5 rounded-2xl overflow-hidden">
							<div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
								<h3 className="text-xl font-black text-white">Pending Approvals</h3>
								<button className="text-accent text-sm font-bold flex items-center gap-1 hover:underline">
									View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
								</button>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full text-left">
									<thead className="bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest">
										<tr>
											<th className="px-8 py-4">Event / Organizer</th>
											<th className="px-8 py-4">Status</th>
											<th className="px-8 py-4">Capacity</th>
											<th className="px-8 py-4">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/5">
										<tr className="hover:bg-white/5 transition-colors">
											<td className="px-8 py-5">
												<div className="flex items-center gap-3">
													<div
														className="w-10 h-10 rounded-lg bg-cover bg-center"
														style={{
															backgroundImage:
																"url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGjukud9xDZmqFsdKG_3BB1LvcnAmHdGNpKCc5dUEvjJUhXw96NtNyVR2jVBUUr7VOMs_tOE3ZDYCStK9Nh5p-BM90Ogb6Trm_TVhWOJsFmKl-ZQTCbdILmOKrxUdP0wQ90QpGraMyP8eXs6q2807Yqmef3vbAq5HvEcXh255uOOEi-wUFiMb8umHdUb_tQZJ4gr80qUooWM2AkvuZ1MybeDxBeWaj_Ivk_bPhOQdYYebe7asC9qdHoyciJqje1Tm8AOYK7OeTNYvE')",
														}}
													/>
													<div>
														<p className="text-sm font-bold text-white">Classic Cinema Gala</p>
														<p className="text-[10px] text-white/40">by Julian V. Estar</p>
													</div>
												</div>
											</td>
											<td className="px-8 py-5">
												<span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-full border border-accent/20">PENDING REVIEW</span>
											</td>
											<td className="px-8 py-5 text-sm text-white/60 font-medium">500 Seats</td>
											<td className="px-8 py-5">
												<div className="flex gap-2">
													<button className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all">
														<span className="material-symbols-outlined text-sm">check</span>
													</button>
													<button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
														<span className="material-symbols-outlined text-sm">close</span>
													</button>
												</div>
											</td>
										</tr>

										<tr className="hover:bg-white/5 transition-colors">
											<td className="px-8 py-5">
												<div className="flex items-center gap-3">
													<div
														className="w-10 h-10 rounded-lg bg-cover bg-center"
														style={{
															backgroundImage:
																"url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzLQL89UD2IhfDwc6Xr7vNurwWykuLyH5vDNHFyvCC7u4bp_tF4oZZFSiEBJLQi3OA_Il5_JMGaYCPjONBFwgcy0RyvSgC3fojRgfvxpVPrZSJR3PstuyikF-ApuOQ3NhalOArVNDKkk5El7fZc0uKNfIU5nAWfvI4OrIW-4eqFIf5TNxcS7rz3E_NYbrJzWpVW4jc1wi4Nw6awSf-UXjASUgMgK9Tj-UuGAuldhwywxjvOQ1vsFBPt105FfxF9mK1BU1yr9DDOQY8')",
														}}
													/>
													<div>
														<p className="text-sm font-bold text-white">Indie Film Collective</p>
														<p className="text-[10px] text-white/40">by Elena Moore</p>
													</div>
												</div>
											</td>
											<td className="px-8 py-5">
												<span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-full border border-accent/20">PENDING REVIEW</span>
											</td>
											<td className="px-8 py-5 text-sm text-white/60 font-medium">120 Seats</td>
											<td className="px-8 py-5">
												<div className="flex gap-2">
													<button className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all">
														<span className="material-symbols-outlined text-sm">check</span>
													</button>
													<button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
														<span className="material-symbols-outlined text-sm">close</span>
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
