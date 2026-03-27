import React from "react";

export default function CommentModerationPage() {
  return (
    <>
      <style>{`
				.comment-moderation-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.comment-moderation-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.comment-moderation-page .custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.comment-moderation-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #800020;
					border-radius: 10px;
				}

				.comment-moderation-page .sidebar-link.active {
					background: rgba(128, 0, 32, 0.1);
					border-right: 3px solid #F5C065;
					color: #F5C065;
				}
			`}</style>

      <div className="comment-moderation-page bg-background-light dark:bg-background-dark text-charcoal dark:text-white min-h-screen">
        <div className="flex">
          <aside className="w-64 min-h-screen bg-charcoal border-r border-white/5 flex flex-col fixed left-0 top-0">
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
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                <span className="font-medium">Event Management</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">flag</span>
                <span className="font-medium">Moderation Queue</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">group</span>
                <span className="font-medium">User Access</span>
              </a>
              <a
                className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                href="#">
                <span className="material-symbols-outlined">analytics</span>
                <span className="font-medium">Reports</span>
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
                    <p className="text-white/40 italic">Super Admin</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 ml-64 p-10 max-w-[1440px]">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-charcoal dark:text-white tracking-tight">
                  Reported Comment Moderation
                </h2>
                <p className="text-charcoal/60 dark:text-white/60 mt-1">
                  Review and manage flagged content to maintain CinéEvent
                  standards.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-success/10 text-success border border-success/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-success/20 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                  Mass Approve
                </button>
                <button className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-sm">
                    visibility_off
                  </span>
                  Mass Hide
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-charcoal/5 dark:border-white/10 shadow-sm">
                <p className="text-xs font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">
                  Total Flagged
                </p>
                <p className="text-2xl font-black text-primary dark:text-accent">
                  1,284
                </p>
              </div>
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-charcoal/5 dark:border-white/10 shadow-sm">
                <p className="text-xs font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">
                  Harassment
                </p>
                <p className="text-2xl font-black">422</p>
              </div>
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-charcoal/5 dark:border-white/10 shadow-sm">
                <p className="text-xs font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">
                  Spam
                </p>
                <p className="text-2xl font-black">715</p>
              </div>
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-charcoal/5 dark:border-white/10 shadow-sm">
                <p className="text-xs font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">
                  Average Response
                </p>
                <p className="text-2xl font-black">4.2 hrs</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-2xl border border-charcoal/5 dark:border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-charcoal/5 dark:bg-white/5 border-b border-charcoal/5 dark:border-white/10">
                    <tr>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-charcoal/40 dark:text-white/40 w-12 text-center">
                        <input
                          className="rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                          type="checkbox"
                        />
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-charcoal/40 dark:text-white/40">
                        Reporter Profile
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-charcoal/40 dark:text-white/40">
                        Original Comment
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-charcoal/40 dark:text-white/40">
                        Reason / Risk
                      </th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-charcoal/40 dark:text-white/40 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-charcoal/5 dark:divide-white/10">
                    <tr className="hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-6 text-center">
                        <input
                          className="rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                          type="checkbox"
                        />
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border border-accent/30"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtNM216UREDZ1r9Uiamx_r5zDa91f1tXWsp808sdBZMm2jl4Gc_jibiFOyIeB5R6H4ye349qZ6kYlCpDP0EmR7zpqMWlVbZpLgj3IeKmls9pk5liLqFnaeJNYlslC43QXXvs6NLFQgXcH3UVRXA5NJb2wd75tcH3iY51sQ74lvFttytzk0mATrShhsSS923oQZt26K5DcK3TMYt4zFlOJsFA9CS7HIlw6CSwYkeh85snBGW4t-qm8HQGOZWnROvKljEQBCcO605BEM')",
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm">Julian Vance</p>
                            <p className="text-xs text-charcoal/50 dark:text-white/40">
                              Member since 2022
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 max-w-md">
                        <p className="text-sm font-medium leading-relaxed italic">
                          "This event was a complete scam. They didn't even have
                          the champagne promised and the staff was rude. Avoid
                          at all costs!"
                        </p>
                        <p className="text-[10px] mt-2 text-charcoal/40 dark:text-white/30">
                          Event: The Great Gatsby Gala • 2 hours ago
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            Negative Sentiment
                          </span>
                          <p className="text-xs font-bold text-danger flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              report
                            </span>
                            Potential Defamation
                          </p>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 hover:bg-success/10 text-success rounded-lg transition-colors"
                            title="Approve">
                            <span className="material-symbols-outlined">
                              check
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Hide">
                            <span className="material-symbols-outlined">
                              visibility_off
                            </span>
                          </button>
                          <button className="p-2 hover:bg-charcoal/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-6 text-center">
                        <input
                          className="rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                          type="checkbox"
                        />
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border border-accent/30"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzFbV-Mox4DG-qQdyfcs0qg2hJ-v0Xzad6Bkx7AE9mcsBAs3QB85wOFEKeNUnTDEfRKstY24HO0WQ4zwfuKuZBIDXiy9aewGxps6UPjMhxCqLLSCThxzeDlUye1FJdGqhj-GrEVBlylZITCehMI3FlAPAatHUT0s3G32c0Pc5ta62CaLDksNu4Tw408NHx_hMgIC0pTTX9hdNLzb9zwgDhsnKbt8iCXV7CKP3syYGFPjVZb-t93dY3ePnsrvZVIh9wtWUy-nbo5KAQ')",
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm">Elena Rodriguez</p>
                            <p className="text-xs text-charcoal/50 dark:text-white/40">
                              VIP Member
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 max-w-md">
                        <p className="text-sm font-medium leading-relaxed italic">
                          "Buy cheap tickets here -&gt;
                          http://not-a-scam-tickets.ru/deals Best price
                          guaranteed for CinéEvent members."
                        </p>
                        <p className="text-[10px] mt-2 text-charcoal/40 dark:text-white/30">
                          Event: Midnight in Paris • 5 hours ago
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-charcoal/10 dark:bg-white/10 text-charcoal/60 dark:text-white/60 border border-charcoal/10 dark:border-white/10">
                            External Link
                          </span>
                          <p className="text-xs font-bold text-danger flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              warning
                            </span>
                            High Risk: Spam/Phishing
                          </p>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 hover:bg-success/10 text-success rounded-lg transition-colors"
                            title="Approve">
                            <span className="material-symbols-outlined">
                              check
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Hide">
                            <span className="material-symbols-outlined">
                              visibility_off
                            </span>
                          </button>
                          <button className="p-2 hover:bg-charcoal/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-6 text-center">
                        <input
                          className="rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                          type="checkbox"
                        />
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border border-accent/30"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5RhuuqcbywCqh29mgLDmqewSf22M2dvHFUOHyun2AymshCzmRAmNw0MWdnA-HfFC-K7b64CFJ5CKfwkxZSrH0_HOFh_AdbAz1pYGNMwJe-COmRM0SvxQ4xl70n4LHCdEr3muobEsPGyCQKTjRRbKWi5W_AQA3mz6IdFZT7TcUyQ4P6-jVI2naqFv0XsV3t1bOd9L-pV4jYUkLCd9mDA8jMm6jjDDyvMEP3gr9iNFndLERRAVvZKZNg0jSxCXL9K1QEJzk7j13kKIr')",
                            }}
                          />
                          <div>
                            <p className="font-bold text-sm">Marcus Thorne</p>
                            <p className="text-xs text-charcoal/50 dark:text-white/40">
                              Spectator
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 max-w-md">
                        <p className="text-sm font-medium leading-relaxed italic">
                          "I didn't like the seating arrangement. It felt too
                          crowded for a 'premium' experience."
                        </p>
                        <p className="text-[10px] mt-2 text-charcoal/40 dark:text-white/30">
                          Event: Noir Film Festival • 12 hours ago
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                            Low Sentiment
                          </span>
                          <p className="text-xs font-bold text-white/40 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              info
                            </span>
                            General Feedback
                          </p>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 hover:bg-success/10 text-success rounded-lg transition-colors"
                            title="Approve">
                            <span className="material-symbols-outlined">
                              check
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Hide">
                            <span className="material-symbols-outlined">
                              visibility_off
                            </span>
                          </button>
                          <button className="p-2 hover:bg-charcoal/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-charcoal/5 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-t border-charcoal/5 dark:border-white/10">
                <span className="text-xs text-charcoal/60 dark:text-white/40">
                  Showing 1-10 of 1,284 reports
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-white/10 rounded-lg hover:bg-charcoal/5 transition-colors">
                    <span className="material-symbols-outlined text-sm leading-none">
                      chevron_left
                    </span>
                  </button>
                  <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg">
                    1
                  </button>
                  <button className="px-3 py-1 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-xs font-bold rounded-lg hover:bg-charcoal/5">
                    2
                  </button>
                  <button className="px-3 py-1 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-xs font-bold rounded-lg hover:bg-charcoal/5">
                    3
                  </button>
                  <button className="p-2 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-white/10 rounded-lg hover:bg-charcoal/5 transition-colors">
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
