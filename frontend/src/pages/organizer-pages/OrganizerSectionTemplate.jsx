import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";

export default function OrganizerSectionTemplate({
  title,
  subtitle,
  badge,
  description,
  ctaTo,
  ctaLabel,
}) {
  const { currentUser } = useSelector((state) => state.auth);
  const organizationName =
    currentUser?.organizerProfile?.organizationName || "Your Organization";

  return (
    <OrganizerPageFrame title={title} subtitle={subtitle}>
      <section className="rounded-2xl border border-accent/20 bg-white/5 p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {badge}
        </p>
        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-white/70">{description}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-background-dark/70 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Organizer
            </p>
            <p className="mt-2 font-bold text-white">
              {currentUser?.name || "Organizer"}
            </p>
          </article>
          <article className="rounded-xl border border-white/10 bg-background-dark/70 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Organization
            </p>
            <p className="mt-2 font-bold text-accent">{organizationName}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-background-dark/70 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Status
            </p>
            <p className="mt-2 font-bold text-green-400">Ready</p>
          </article>
        </div>

        {ctaTo && ctaLabel && (
          <div className="mt-8">
            <Link
              to={ctaTo}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90">
              {ctaLabel}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>
        )}
      </section>
    </OrganizerPageFrame>
  );
}
