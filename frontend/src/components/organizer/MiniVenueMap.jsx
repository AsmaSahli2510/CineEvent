import React from "react";

// These should be copied from the admin VenueTemplateManagementPage.jsx
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

export default function MiniVenueMap({ rows = [], screenLabel = "SCREEN" }) {
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
          <div className="rounded-lg border border-dashed border-white/20 px-3 py-4 text-center text-[10px] text-white/40">
            No rows
          </div>
        )}
      </div>
    </div>
  );
}
