import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-charcoal px-6 py-16 text-white/60 md:px-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="text-accent">
                <span className="material-symbols-outlined text-3xl">
                  movie_filter
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                CINÉ<span className="text-accent">EVENT</span>
              </h1>
            </div>
            <p className="text-sm leading-relaxed">
              Defining the future of luxury cinema events. Experience the magic
              of the big screen like never before.
            </p>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-white">Quick Links</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Browse Events
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Top Venues
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-white">Company</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-accent" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-white">Newsletter</h5>
            <p className="mb-4 text-sm">
              Stay updated with the latest premieres.
            </p>
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm focus:border-accent focus:ring-accent"
                placeholder="Your email"
                type="email"
              />
              <button className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary/90">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs md:flex-row">
          <p>© 2024 CinéEvent International. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-white" href="#">
              Instagram
            </a>
            <a className="hover:text-white" href="#">
              LinkedIn
            </a>
            <a className="hover:text-white" href="#">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
