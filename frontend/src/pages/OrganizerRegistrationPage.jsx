import React from "react";

export default function OrganizerRegistrationPage() {
  return (
    <div className="flex-1 bg-background-dark text-white">
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <div className="relative mb-12 flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-px w-full -translate-y-1/2 bg-white/10" />
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-background-dark font-bold text-accent">
                1
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Organization
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-background-dark font-bold text-accent">
                2
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Financial
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-background-dark font-bold text-accent">
                3
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Legal
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="mb-10">
                <h2 className="mb-2 text-3xl font-bold">
                  Professional Organizer Registration
                </h2>
                <p className="text-white/50">
                  Complete your profile to start hosting premium cinema events
                  on CinéEvent.
                </p>
              </div>

              <form className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <span className="material-symbols-outlined text-accent">
                      business
                    </span>
                    <h3 className="text-lg font-bold">Organization Details</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-medium text-white/70">
                        Organization Name
                      </label>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                        placeholder="e.g. Vintage Film Society"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-medium text-white/70">
                        Website (Optional)
                      </label>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                        placeholder="https://"
                        type="url"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="ml-1 text-sm font-medium text-white/70">
                        Short Bio
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                        placeholder="Tell us about your experience in organizing cinema events..."
                        rows="3"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <span className="material-symbols-outlined text-accent">
                      payments
                    </span>
                    <h3 className="text-lg font-bold">Financial Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
                      <span className="material-symbols-outlined text-accent">
                        info
                      </span>
                      <p className="text-xs leading-relaxed text-white/70">
                        Your IBAN is required for automated payouts of ticket
                        sales. We use enterprise-grade encryption to ensure your
                        financial data remains secure.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-medium text-white/70">
                        IBAN for Future Payouts
                      </label>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white focus:border-accent focus:ring-accent"
                        placeholder="GB00 0000 0000 0000 0000 00"
                        type="text"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <span className="material-symbols-outlined text-accent">
                      gavel
                    </span>
                    <h3 className="text-lg font-bold">Legal Verification</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <p className="text-sm text-white/60">
                        Please upload your business registration or ID documents
                        for verification.
                      </p>
                      <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8 transition-colors hover:border-accent/50">
                        <span className="material-symbols-outlined mb-2 text-4xl text-white/20 group-hover:text-accent">
                          upload_file
                        </span>
                        <span className="text-sm font-bold">
                          Upload Documents
                        </span>
                        <span className="mt-1 text-xs text-white/40">
                          PDF, JPG or PNG (Max 5MB)
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
                        Required:
                      </h4>
                      <ul className="space-y-2 text-xs text-white/60">
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-green-500">
                            check_circle
                          </span>
                          Company Registration Certificate
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-green-500">
                            check_circle
                          </span>
                          Proof of Address (Last 3 months)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-green-500">
                            check_circle
                          </span>
                          Identity Document of Representative
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="space-y-6 border-t border-white/10 pt-8">
                  <div className="flex items-start gap-4 rounded-xl border border-accent/20 bg-charcoal p-4">
                    <span className="material-symbols-outlined mt-0.5 text-accent">
                      verified_user
                    </span>
                    <div>
                      <p className="mb-1 text-sm font-bold text-accent">
                        Account Validation Notice
                      </p>
                      <p className="text-xs leading-relaxed text-white/50">
                        Your account will be set to{" "}
                        <strong className="text-white">
                          Pending Validation
                        </strong>{" "}
                        upon completion. Our team will review your application
                        within 48 business hours. You will receive an email
                        confirmation once your organizer status is active.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row">
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-4 text-sm font-black text-charcoal transition-all hover:scale-[1.02] hover:bg-white"
                      type="submit">
                      COMPLETE REGISTRATION
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                    <button
                      className="rounded-xl border border-white/20 px-8 py-4 text-sm font-bold transition-colors hover:bg-white/5"
                      type="button">
                      Save Progress
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-white/30">
            By registering, you agree to CinéEvent&apos;s{" "}
            <a className="underline hover:text-accent" href="#">
              Organizer Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline hover:text-accent" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
