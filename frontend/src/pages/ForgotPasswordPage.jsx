import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../images/upscalemedia-transformed.png";

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen bg-charcoal p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(28, 28, 28, 0.8), rgba(28, 28, 28, 0.9)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative w-full max-w-md overflow-hidden rounded-lg border border-accent/20 p-10 shadow-2xl"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(28, 28, 28, 0.85)",
          }}>
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="mb-10 flex flex-col items-center">
            <div className="mb-2 text-accent">
              <span className="material-symbols-outlined text-5xl">
                movie_filter
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              CINÉ<span className="text-accent">EVENT</span>
            </h1>
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Reset Your Password
            </h2>
            <p className="text-sm leading-relaxed text-white/60">
              Enter your registered email address and we&apos;ll send you a
              secure link to reset your password.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                className="ml-1 block text-xs font-bold uppercase tracking-widest text-accent"
                htmlFor="email">
                Email Address
              </label>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
                  mail
                </span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-accent focus:ring-accent/50"
                  id="email"
                  placeholder="e.g. julian@cinema-luxe.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <button
              className="w-full rounded-xl border border-accent/10 bg-primary py-4 text-sm font-bold tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
              type="submit">
              SEND RESET LINK
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-accent"
              to="/login">
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Return to Login
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 flex w-full items-center justify-between p-8 opacity-40">
        <div className="text-xs font-light tracking-widest text-white/40">
          EST. 2024
        </div>
        <div className="flex gap-4">
          <div className="h-1 w-1 rounded-full bg-accent" />
          <div className="h-1 w-1 rounded-full bg-accent" />
          <div className="h-1 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
