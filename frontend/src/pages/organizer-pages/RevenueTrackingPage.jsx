import React, { useState, useEffect } from "react";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getMyEarnings, getMyPayoutHistory } from "../../api/walletApi";

export default function RevenueTrackingPage() {
  const [earnings, setEarnings] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [earningsData, payoutsData] = await Promise.all([
        getMyEarnings(),
        getMyPayoutHistory(page, limit),
      ]);
      setEarnings(earningsData.earnings);
      setPayouts(payoutsData.payouts || []);
      setPagination(payoutsData.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `TND ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{`
        .revenue-tracking {
          font-family: 'Spline Sans', sans-serif;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .payout-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .payout-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-pending {
          background: rgba(245, 192, 101, 0.2);
          color: #F5C065;
          border: 1px solid rgba(245, 192, 101, 0.3);
        }

        .status-failed {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #F5C065;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="revenue-tracking">
        <OrganizerPageFrame
          title="Revenue Tracking"
          subtitle="Detailed breakdown of your earnings and payout history">
          <div className="space-y-8">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
                <p className="text-white/60 mt-4">Loading revenue data...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-danger/10 border border-danger/20 rounded-2xl p-6">
                <p className="text-danger font-bold">{error}</p>
              </div>
            )}

            {/* Content */}
            {earnings && !loading && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="stat-card p-4 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Total Earned
                    </p>
                    <p className="text-2xl font-black text-success">
                      {formatCurrency(earnings.totalEarned)}
                    </p>
                    <p className="text-[9px] text-white/30 mt-2">
                      Pending + Paid Out
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Pending Payout
                    </p>
                    <p className="text-2xl font-black text-accent">
                      {formatCurrency(earnings.currentBalance)}
                    </p>
                    <p className="text-[9px] text-white/30 mt-2">
                      {earnings.reservationCount} reservations
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Already Paid
                    </p>
                    <p className="text-2xl font-black text-white">
                      {formatCurrency(earnings.totalPaidOut)}
                    </p>
                    <p className="text-[9px] text-white/30 mt-2">
                      Lifetime earnings
                    </p>
                  </div>

                  <div className="stat-card p-4 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Platform Fee
                    </p>
                    <p className="text-2xl font-black text-white/60">
                      {formatCurrency(earnings.adminCommission)}
                    </p>
                    <p className="text-[9px] text-white/30 mt-2">
                      10% on pending
                    </p>
                  </div>
                </div>

                {/* Pending Payout Breakdown */}
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    Pending Payout Breakdown
                  </h3>

                  <div className="space-y-4">
                    {/* Revenue Breakdown */}
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white/60 font-medium">Gross Revenue:</span>
                        <span className="text-lg font-black text-white">
                          {formatCurrency(earnings.totalRevenue)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                          {/* Your portion (90%) */}
                          <div
                            className="bg-accent flex items-center justify-center"
                            style={{ width: "90%" }}>
                            <span className="text-[10px] font-black text-charcoal">
                              Your 90%
                            </span>
                          </div>
                          {/* Platform portion (10%) */}
                          <div
                            className="bg-primary/40 flex items-center justify-center"
                            style={{ width: "10%" }}>
                            <span className="text-[9px] font-black text-white">
                              10%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Breakdown Details */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <p className="text-xs font-bold text-white/40 uppercase mb-2">
                            Your Amount (90%)
                          </p>
                          <p className="text-2xl font-black text-accent">
                            {formatCurrency(earnings.organizerWillGet)}
                          </p>
                        </div>

                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                          <p className="text-xs font-bold text-white/40 uppercase mb-2">
                            Platform Fee (10%)
                          </p>
                          <p className="text-2xl font-black text-primary">
                            {formatCurrency(earnings.adminCommission)}
                          </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                          <p className="text-xs font-bold text-white/40 uppercase mb-2">
                            Total Revenue
                          </p>
                          <p className="text-2xl font-black text-white">
                            {formatCurrency(earnings.totalRevenue)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Calculation Explanation */}
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold">How it works:</span> Your {earnings.reservationCount} confirmed reservations generated{" "}
                        <span className="font-bold text-white">{formatCurrency(earnings.totalRevenue)}</span> in total
                        revenue. The platform takes 10% ({formatCurrency(earnings.adminCommission)}) as a service fee,
                        leaving you with {formatCurrency(earnings.organizerWillGet)} (90%).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payout History */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    Payout History
                  </h3>

                  {payouts.length === 0 ? (
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
                      <p className="text-white/40 font-medium">
                        No payouts yet. Your first payout will appear here once the admin processes it.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payouts.map((payout) => (
                        <div key={payout._id} className="payout-item p-6 rounded-xl">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-bold text-white">
                                  {payout.transactionReference}
                                </p>
                                <span className={`status-badge status-${payout.status}`}>
                                  <span className="material-symbols-outlined text-sm">
                                    {payout.status === "completed"
                                      ? "check_circle"
                                      : payout.status === "pending"
                                        ? "schedule"
                                        : "error"}
                                  </span>
                                  {payout.status}
                                </span>
                              </div>
                              <p className="text-xs text-white/40">
                                {formatDate(payout.createdAt)}
                              </p>
                            </div>
                            <p className="text-2xl font-black text-success">
                              +{formatCurrency(payout.organizerAmount)}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div>
                              <p className="text-[9px] font-bold text-white/40 uppercase mb-1">
                                Total Revenue
                              </p>
                              <p className="font-bold text-white">
                                {formatCurrency(payout.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-white/40 uppercase mb-1">
                                Platform Fee
                              </p>
                              <p className="font-bold text-red-400">
                                -{formatCurrency(payout.adminCommission)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-white/40 uppercase mb-1">
                                Your Amount
                              </p>
                              <p className="font-bold text-emerald-400">
                                {formatCurrency(payout.organizerAmount)}
                              </p>
                            </div>
                          </div>

                          {payout.bankAccountDetails && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-[9px] font-bold text-white/40 uppercase mb-2">
                                Bank Transfer Details
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-white/60">Account Holder:</p>
                                  <p className="text-sm font-bold text-white">
                                    {payout.bankAccountDetails.accountHolder}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-white/60">IBAN:</p>
                                  <p className="text-sm font-bold text-white font-mono">
                                    {payout.bankAccountDetails.iban?.substring(0, 4)}...{payout.bankAccountDetails.iban?.substring(-4)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {payout.failureReason && (
                            <div className="mt-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                              <p className="text-xs font-bold text-danger">Failure Reason:</p>
                              <p className="text-sm text-danger/80">{payout.failureReason}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[10px] text-white/40 font-bold uppercase">
                        Showing {(page - 1) * limit + 1} to{" "}
                        {Math.min(page * limit, pagination.total)} of{" "}
                        {pagination.total} payouts
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          <span className="material-symbols-outlined text-sm">
                            chevron_left
                          </span>
                        </button>

                        {Array.from(
                          { length: Math.min(5, pagination.pages) },
                          (_, i) => i + 1
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              page === p
                                ? "bg-primary text-white border border-primary/50"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            }`}>
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                          disabled={page === pagination.pages}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          <span className="material-symbols-outlined text-sm">
                            chevron_right
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                  <p className="text-sm text-white/70 leading-relaxed">
                    <span className="font-bold text-primary">💡 Important:</span> Your balance shows
                    confirmed and paid reservations. Admin will process your payout within 5-7 business
                    days. You'll receive 90% of total revenue after platform fees.
                  </p>
                </div>
              </>
            )}
          </div>
        </OrganizerPageFrame>
      </div>
    </>
  );
}
