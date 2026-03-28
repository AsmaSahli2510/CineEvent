import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrganizerPendingValidationPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  // Redirect if not an organizer with pending status
  if (
    !currentUser ||
    currentUser.role !== "organizer" ||
    currentUser.organizerStatus !== "pending_validation"
  ) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-8 md:px-10">
        <div className="flex items-center gap-3 text-accent">
          <span className="material-symbols-outlined text-3xl">
            movie_filter
          </span>
          <h1 className="text-xl font-black tracking-tighter text-white">
            CINEEVENT
          </h1>
        </div>

        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
          to="/">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Return to Home Page
        </Link>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-accent/20 p-6">
                <span className="material-symbols-outlined text-6xl text-accent">
                  hourglass_empty
                </span>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">
              Application Under Review
            </h1>
            <p className="text-lg text-white/60">
              Thank you for registering as a professional organizer on CinéEvent
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
            <div className="p-8 md:p-12 space-y-8">
              {/* Status Card */}
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-2xl text-accent flex-shrink-0">
                    verified_user
                  </span>
                  <div>
                    <h2 className="mb-2 text-lg font-bold text-accent">
                      Pending Validation
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Your organizer profile has been successfully submitted.
                      Our administrative team is reviewing your application to
                      ensure CinéEvent maintains the highest standards of event
                      organization.
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  What Happens Next
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent text-charcoal font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Admin Review (48 hours)
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Our team will verify your documents and organization
                        details
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/20 text-white/40 font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Approval Email
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        You'll receive an email from our admin team with your
                        personalized dashboard access link
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/20 text-white/40 font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Start Organizing
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Once approved, you can fully access your organizer
                        dashboard and create events
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-accent flex-shrink-0">
                    info
                  </span>
                  <div className="text-xs text-white/70 space-y-2">
                    <p className="font-medium text-white">
                      Important: Check Your Email
                    </p>
                    <p>
                      We sent a confirmation to{" "}
                      <strong className="text-white">
                        {currentUser?.email}
                      </strong>
                      . Please check your inbox and spam folder. Do not use the
                      login page yet—wait for the approval email from our admin
                      team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization Details Summary */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Submitted Organization
                </h3>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-white/50 font-medium">
                      Organization Name
                    </p>
                    <p className="text-sm text-white mt-1">
                      {currentUser?.organizerProfile?.organizationName || "N/A"}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-white/50 font-medium">
                      Representative
                    </p>
                    <p className="text-sm text-white mt-1">
                      {currentUser?.name || "N/A"}
                    </p>
                  </div>
                  {currentUser?.organizerProfile?.website && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-xs text-white/50 font-medium">
                        Website
                      </p>
                      <p className="text-sm text-accent mt-1 break-all">
                        {currentUser.organizerProfile.website}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  FAQ
                </h3>
                <div className="space-y-4 text-xs text-white/70">
                  <div>
                    <p className="font-medium text-white mb-1">
                      How long does approval take?
                    </p>
                    <p>
                      Typically within 48 business hours. We work as fast as
                      possible to get you started.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">
                      Can I log in before approval?
                    </p>
                    <p>
                      Not yet. You'll receive a special login link in your
                      approval email. Use that link to access your dashboard for
                      the first time.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">
                      What if my application is rejected?
                    </p>
                    <p>
                      We'll send an email explaining why. You can then update
                      your information and reapply.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">
                      Did not receive an email?
                    </p>
                    <p>
                      Check your spam folder. If still missing,{" "}
                      <a
                        href="mailto:support@cineevent.com"
                        className="text-accent underline">
                        contact our support team
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                <button
                  onClick={() => navigate("/", { replace: true })}
                  className="w-full rounded-xl border border-white/20 px-6 py-4 text-sm font-bold transition-colors hover:bg-white/5">
                  Back to Home
                </button>
                <p className="text-center text-xs text-white/40">
                  Your organizer access will be enabled after admin approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
