import React, { useState, useEffect } from "react";
import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getMyEarnings } from "../../api/walletApi";

export default function OrganizerDashboardPage() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyEarnings();
      setEarnings(data.earnings);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching earnings:", err);
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

  return (
    <>
      <style>{`
        .organizer-dashboard {
          font-family: 'Spline Sans', sans-serif;
        }

        .earnings-card {
          background: linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(245, 192, 101, 0.05) 100%);
          border: 1px solid rgba(245, 192, 101, 0.2);
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 8px;
          font-weight: bold;
          z-index: 9999;
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

      <div className="organizer-dashboard">
        <OrganizerPageFrame
          title="Revenue & Earnings"
          subtitle="Track your pending payout and lifetime earnings">
          <div className="space-y-8">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
                <p className="text-white/60 mt-4">Loading earnings data...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-danger/10 border border-danger/20 rounded-2xl p-6">
                <p className="text-danger font-bold">{error}</p>
              </div>
            )}

            {/* Earnings Summary */}
            {earnings && !loading && (
              <div className="space-y-8">
                {/* Main Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Pending Balance Card */}
                  <div className="earnings-card p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">
                        pending_actions
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Pending Payout
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-accent">
                        {formatCurrency(earnings.currentBalance)}
                      </p>
                    </div>
                    <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                      Waiting for admin approval • {earnings.reservationCount} confirmed reservations
                    </p>
                  </div>

                  {/* Total Revenue (Before Commission) */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">
                        trending_up
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Total Revenue
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-primary">
                        {formatCurrency(earnings.totalRevenue)}
                      </p>
                    </div>
                    <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                      Gross revenue from reservations
                    </p>
                  </div>

                  {/* Platform Commission */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">
                        account_balance
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                      Platform Fee (10%)
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-white/60">
                        {formatCurrency(earnings.adminCommission)}
                      </p>
                    </div>
                    <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                      Processing & service fee
                    </p>
                  </div>

                  {/* Total Earned (Paid Out) */}
                  <div className="bg-success/5 p-6 rounded-2xl border border-success/20 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">
                        check_circle
                      </span>
                    </div>
                    <p className="text-xs font-bold text-success uppercase tracking-wider mb-2">
                      Total Earned
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-success">
                        {formatCurrency(earnings.totalEarned)}
                      </p>
                    </div>
                    <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                      Pending + Already Paid Out
                    </p>
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Already Paid Out */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-2xl text-success">
                        verified
                      </span>
                      Already Paid Out
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <p className="text-white/60 font-medium">Total Received:</p>
                        <p className="text-lg font-black text-white">
                          {formatCurrency(earnings.totalPaidOut)}
                        </p>
                      </div>
                      {earnings.lastPayoutDate && (
                        <>
                          <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <p className="text-white/60 font-medium">Last Payout:</p>
                            <p className="text-sm text-white">
                              {new Date(earnings.lastPayoutDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-white/60 font-medium">Last Amount:</p>
                            <p className="text-lg font-black text-success">
                              {formatCurrency(earnings.lastPayoutAmount)}
                            </p>
                          </div>
                        </>
                      )}
                      {!earnings.lastPayoutDate && (
                        <p className="text-white/40 text-sm italic">No payouts received yet</p>
                      )}
                    </div>
                  </div>

                  {/* What You'll Get */}
                  <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20 shadow-lg">
                    <h3 className="text-lg font-black text-accent mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-2xl text-accent">
                        money
                      </span>
                      Pending Payout Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-accent/20">
                        <p className="text-white/60 font-medium">Gross Revenue:</p>
                        <p className="text-lg font-black text-white">
                          {formatCurrency(earnings.totalRevenue)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-accent/20">
                        <p className="text-white/60 font-medium">Platform Fee (-10%):</p>
                        <p className="text-sm text-danger">
                          -{formatCurrency(earnings.adminCommission)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-2 bg-accent/10 px-4 py-3 rounded-lg">
                        <p className="text-white font-bold">Your Amount:</p>
                        <p className="text-xl font-black text-accent">
                          {formatCurrency(earnings.organizerWillGet)}
                        </p>
                      </div>
                      <p className="text-[10px] text-white/50 italic">
                        You receive 90% after platform fees
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pending Reservations */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                      Pending Reservations
                    </p>
                    <p className="text-4xl font-black text-primary mb-2">
                      {earnings.reservationCount}
                    </p>
                    <p className="text-[10px] text-white/50 italic">
                      Confirmed and paid bookings
                    </p>
                  </div>

                  {/* Status */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                      Payout Status
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-accent">
                        schedule
                      </span>
                      <p className="text-sm font-bold text-accent">
                        Awaiting Admin Approval
                      </p>
                    </div>
                    <p className="text-[10px] text-white/50 italic mt-3">
                      Admin will process payout soon
                    </p>
                  </div>

                  {/* Help */}
                  <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                      ℹ️ How It Works
                    </p>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      The admin takes a 10% platform fee. You receive 90%. Once approved, funds are transferred to your bank account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </OrganizerPageFrame>
      </div>
    </>
  );
}
