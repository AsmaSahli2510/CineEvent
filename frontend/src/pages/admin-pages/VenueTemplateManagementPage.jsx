import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import {
  deleteVenueTemplate,
  getVenueTemplates,
} from "../../api/venueTemplateApi";

const SEAT_COLOR_CLASS = {
  standard: "bg-white/60",
  premium: "bg-primary/90",
  vip: "bg-accent",
  accessible: "bg-pmr-green",
  bench: "bg-amber-400",
};

const ROW_TEXT_CLASS = {
  standard: "text-white",
  premium: "text-primary",
  vip: "text-accent",
  accessible: "text-pmr-green",
  bench: "text-amber-300",
};

const ZONE_BADGE_CLASS = {
  standard: "border-white/25 bg-white/10 text-white",
  premium: "border-primary/40 bg-primary/20 text-primary",
  vip: "border-accent/40 bg-accent/20 text-accent",
  accessible: "border-pmr-green/50 bg-pmr-green/20 text-pmr-green",
  bench: "border-amber-400/50 bg-amber-500/20 text-amber-200",
};

const STRUCTURE_ICON = {
  entrance: "door_front",
  food: "local_dining",
  bar: "local_bar",
  shelter: "roofing",
  restroom: "wc",
  lounge: "weekend",
  projection: "movie",
  backstage: "theater_comedy",
};

function getSeatTypeFromRow(row, seatNumber) {
  const seatOverrides = row?.seatOverrides || {};

  if (Object.prototype.hasOwnProperty.call(seatOverrides, seatNumber)) {
    return seatOverrides[seatNumber];
  }

  const wheelchairSeats = Math.max(0, Number(row?.wheelchair) || 0);
  if (seatNumber <= wheelchairSeats) {
    return "accessible";
  }

  return row?.zoneId || "standard";
}

function dominantZoneForRow(row) {
  const seatCount = Math.max(1, Number(row?.seats) || 1);
  const counts = {};

  for (let seatNumber = 1; seatNumber <= seatCount; seatNumber += 1) {
    const seatType = getSeatTypeFromRow(row, seatNumber);
    counts[seatType] = (counts[seatType] || 0) + 1;
  }

  return (
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "standard"
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "-";
  }
}

function ambienceClass(ambience) {
  if (ambience === "sky") {
    return "from-sky-500/20 via-cyan-400/10 to-background-dark";
  }
  if (ambience === "festival") {
    return "from-primary/30 via-accent/15 to-background-dark";
  }
  return "from-white/15 via-white/5 to-background-dark";
}

function statusClass(status) {
  if (status === "published") {
    return "border-emerald-400/35 bg-emerald-500/15 text-emerald-200";
  }
  return "border-amber-400/35 bg-amber-500/15 text-amber-100";
}

function MiniVenueMap({ rows = [], structures = [], screenLabel = "SCREEN" }) {
  const mapRows = Array.isArray(rows) ? rows : [];
  const rowCount = mapRows.length;
  const seatSampleSize =
    rowCount > 30 ? 8 : rowCount > 20 ? 10 : rowCount > 12 ? 12 : 14;
  const rowGap =
    rowCount > 30 ? "0.1rem" : rowCount > 20 ? "0.15rem" : "0.25rem";
  const dotSize =
    rowCount > 30 ? "0.2rem" : rowCount > 20 ? "0.22rem" : "0.25rem";
  const rowLabelClass = rowCount > 20 ? "text-[8px]" : "text-[9px]";

  return (
    <div className="relative h-32 overflow-hidden rounded-2xl border border-white/10 bg-charcoal p-2.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,192,101,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="relative mb-1.5">
        <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-accent/75 via-accent/40 to-transparent shadow-[0_0_12px_rgba(245,192,101,0.35)]" />
        <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-accent/80">
          {screenLabel}
        </p>
      </div>
      <div
        className="relative"
        style={{
          display: "grid",
          rowGap,
        }}>
        {mapRows.length ? (
          mapRows.map((row, index) => {
            const seats = Math.max(1, Number(row?.seats) || 1);
            const dots = Math.min(seatSampleSize, seats);
            const rowZone = dominantZoneForRow(row);
            return (
              <div
                key={`${row.editorId || row.label}-${index}`}
                className="mx-auto flex w-full items-center">
                <span
                  className={`w-6 flex-shrink-0 pr-1 text-right font-mono font-black leading-none ${rowLabelClass} ${ROW_TEXT_CLASS[rowZone] || "text-white"}`}>
                  {row?.label || String.fromCharCode(65 + index)}
                </span>
                <div
                  className="flex flex-1 items-center justify-start pl-0.5"
                  style={{ gap: rowCount > 24 ? "0.14rem" : "0.2rem" }}>
                  {Array.from({ length: dots }).map((_, seatIndex) => {
                    const sourceSeatNumber =
                      Math.floor((seatIndex / dots) * seats) + 1;
                    const seatType = getSeatTypeFromRow(row, sourceSeatNumber);

                    return (
                      <span
                        key={seatIndex}
                        className={`rounded-[3px] border border-black/25 shadow-[0_1px_2px_rgba(0,0,0,0.35)] ${SEAT_COLOR_CLASS[seatType] || "bg-white/60"}`}
                        style={{ width: dotSize, height: dotSize }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-white/20 px-3 py-6 text-center text-xs text-white/35">
            Blank layout
          </div>
        )}
      </div>

      {structures.length ? (
        <div className="absolute bottom-1.5 right-1.5 flex max-w-[65%] flex-wrap justify-end gap-1">
          {structures.slice(0, 4).map((structure, index) => {
            const icon = STRUCTURE_ICON[structure?.type] || "category";
            return (
              <span
                key={`${structure?.editorId || structure?.name || "s"}-${index}`}
                className="inline-flex h-4 items-center rounded-full border border-white/20 bg-black/35 px-1.5 text-[8px] text-white/70">
                <span className="material-symbols-outlined text-[10px] leading-none">
                  {icon}
                </span>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function TemplateCard({ template, onDelete, isDeleting }) {
  const zoneKeys = Object.keys(template?.stats?.zones || {});

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-charcoal/70 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div
        className={`relative border-b border-white/10 bg-gradient-to-br ${ambienceClass(template.ambience)} p-4`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {template.name}
            </h3>
            <p className="text-[11px] text-white/55">
              {template.subtitle || "No subtitle"}
            </p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${statusClass(template.status)}`}>
            {template.status}
          </span>
        </div>

        <MiniVenueMap
          rows={template.rows || []}
          screenLabel={template.screenLabel}
          structures={template.structures || []}
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Capacity
            </p>
            <p className="text-lg font-black text-white">
              {template?.stats?.capacity || 0}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Rows
            </p>
            <p className="text-lg font-black text-white">
              {template?.stats?.rows || 0}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {zoneKeys.length ? (
            zoneKeys.slice(0, 4).map((zone) => (
              <span
                key={`${template._id}-${zone}`}
                className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-wide ${ZONE_BADGE_CLASS[zone] || "border-white/15 bg-white/5 text-white/70"}`}>
                {zone}: {template.stats.zones[zone]}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-white/50">
              no zones yet
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/45">
          <span>Structures: {template?.structures?.length || 0}</span>
          <span>Updated: {formatDate(template.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="flex-1 rounded-lg border border-accent/35 bg-accent/15 px-3 py-2 text-center text-xs font-bold text-accent transition-colors hover:bg-accent/25"
            to={`/admin/rooms/templates?templateId=${template._id}`}>
            Open Builder
          </Link>
          <button
            className="rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isDeleting}
            onClick={() => onDelete(template)}
            type="button">
            {isDeleting ? "Deleting" : "Delete"}
          </button>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/55">
            {template.presetId || "custom"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function VenueTemplateManagementPage() {
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);

    return () => window.clearTimeout(timer);
  }, [query]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getVenueTemplates({
        status: statusFilter === "all" ? undefined : statusFilter,
        q: debouncedQuery || undefined,
        page: 1,
        limit: 48,
      });

      setTemplates(result.templates || []);
      setPagination(result.pagination || null);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load templates");
      setTemplates([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [statusFilter, debouncedQuery]);

  const handleDeleteTemplate = async (template) => {
    const confirmed = window.confirm(
      `Delete template "${template.name}"? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingTemplateId(template._id);
      setError("");
      await deleteVenueTemplate(template._id);
      setTemplates((prev) => prev.filter((item) => item._id !== template._id));
      setPagination((prev) =>
        prev
          ? {
              ...prev,
              total: Math.max(0, Number(prev.total || 0) - 1),
            }
          : prev,
      );
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete template");
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const summary = useMemo(() => {
    const published = templates.filter(
      (item) => item.status === "published",
    ).length;
    const drafts = templates.filter((item) => item.status === "draft").length;
    return { published, drafts };
  }, [templates]);

  return (
    <>
      <style>{`
        .venue-template-management-page {
          font-family: 'Spline Sans', sans-serif;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar-track {
          background: #1C1C1C;
        }

        .venue-template-management-page .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F5C065;
          border-radius: 10px;
        }
      `}</style>

      <div className="venue-template-management-page min-h-screen bg-background-dark text-white">
        <AdminPageFrame
          title=" Venue Template Catalog"
          subtitle="Live templates from database">
          <main className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-charcoal/60 p-4 lg:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
                      search
                    </span>
                    <input
                      className="h-11 w-full rounded-xl border border-white/10 bg-background-dark pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search template name..."
                      type="text"
                      value={query}
                    />
                  </div>
                  <select
                    className="h-11 rounded-xl border border-white/10 bg-background-dark px-3 text-sm text-white focus:border-accent focus:outline-none"
                    onChange={(event) => setStatusFilter(event.target.value)}
                    value={statusFilter}>
                    <option value="all">All status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <button
                    className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/10"
                    onClick={loadTemplates}
                    type="button">
                    Refresh
                  </button>
                </div>

                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-xs font-black uppercase tracking-wide text-charcoal transition-opacity hover:opacity-90"
                  to="/admin/rooms/templates">
                  Create Template
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/60">
                  total: {pagination?.total ?? templates.length}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-200">
                  published: {summary.published}
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-100">
                  drafts: {summary.drafts}
                </span>
              </div>
            </section>

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-charcoal/50 px-4 py-10 text-center text-sm text-white/50">
                Loading templates...
              </div>
            ) : templates.length ? (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    isDeleting={deletingTemplateId === template._id}
                    onDelete={handleDeleteTemplate}
                    template={template}
                  />
                ))}
              </section>
            ) : (
              <section className="rounded-2xl border border-dashed border-white/15 bg-charcoal/30 px-6 py-12 text-center">
                <p className="text-lg font-bold text-white/70">
                  No templates found
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Publish one from the Room Template editor and it will appear
                  here.
                </p>
                <Link
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs font-black uppercase tracking-wide text-charcoal transition-opacity hover:opacity-90"
                  to="/admin/rooms/templates">
                  Go To Editor
                </Link>
              </section>
            )}
          </main>
        </AdminPageFrame>
      </div>
    </>
  );
}
