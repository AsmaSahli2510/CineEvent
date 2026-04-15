import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import {
  getAllOrganizersWallet,
  triggerPayout,
  verifyBankDetails,
} from "../../api/walletApi";

export default function OrganizerWalletPage() {
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("balance_desc");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [processingPayoutId, setProcessingPayoutId] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch organizers on component mount
  useEffect(() => {
    fetchOrganizers();
  }, [page, limit, sortBy, verificationFilter]);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrganizersWallet(
        page,
        limit,
        sortBy,
        verificationFilter,
      );
      setOrganizers(data.organizers || []);
      setPagination(data.pagination);
      setFilteredOrganizers(data.organizers || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching organizers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter organizers by search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrganizers(organizers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = organizers.filter(
        (org) =>
          org.name?.toLowerCase().includes(lowercaseSearch) ||
          org.email?.toLowerCase().includes(lowercaseSearch) ||
          org.organizerProfile?.organizationName
            ?.toLowerCase()
            .includes(lowercaseSearch),
      );
      setFilteredOrganizers(filtered);
    }
  }, [searchTerm, organizers]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle trigger payout
  const handleTriggerPayout = async (organizerId) => {
    try {
      setProcessingPayoutId(organizerId);
      const result = await triggerPayout(organizerId);
      showToast(
        `Payout triggered successfully! Ref: ${result.payout.transactionReference}`,
      );
      // Refresh the list
      fetchOrganizers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessingPayoutId(null);
    }
  };

  // Handle verify bank details
  const handleVerifyBankDetails = async (organizerId, currentStatus) => {
    try {
      await verifyBankDetails(organizerId, !currentStatus);
      showToast(
        currentStatus
          ? "Bank verification removed"
          : "Bank details verified successfully",
      );
      fetchOrganizers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Helper function to format currency as TND
  const formatCurrency = (amount) => {
    return `TND ${amount.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  // Calculate totals
  const totalOutstandingBalance = filteredOrganizers.reduce(
    (sum, org) => sum + (org.wallet?.currentBalance || 0),
    0,
  );

  const totalVerifiedBalance = filteredOrganizers
    .filter((org) => org.wallet?.bankDetailsVerified)
    .reduce((sum, org) => sum + (org.wallet?.currentBalance || 0), 0);

  const activeOrganizers = filteredOrganizers.filter(
    (org) => org.wallet?.bankDetailsVerified,
  ).length;

  // Calculate platform commission (10%) from organizer payouts (90%)
  // If organizers get 90%, then: totalRevenue = balance / 0.9, platformCommission = totalRevenue * 0.1
  const platformCommission = totalOutstandingBalance / 9; // This equals (balance / 0.9) * 0.1
  const totalRevenue = totalOutstandingBalance + platformCommission;

  return (
    <>
      <style>{`
        .organizer-wallet-page {
          font-family: 'Spline Sans', sans-serif;
        }

        .organizer-wallet-page .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .organizer-wallet-page .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .organizer-wallet-page .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #800020;
          border-radius: 10px;
        }

        .organizer-wallet-page .sidebar-link.active {
          background: rgba(128, 0, 32, 0.1);
          border-right: 3px solid #F5C065;
          color: #F5C065;
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 8px;
          font-weight: bold;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }

        .toast.success {
          background: #10b981;
          color: white;
        }

        .toast.error {
          background: #ef4444;
          color: white;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
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

      {/* Toast Notification */}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="organizer-wallet-page bg-background-dark text-white min-h-screen">
        <AdminPageFrame
          title="Organizer Wallet"
          subtitle="Manage payouts and organizer balances">
          <div className="flex">
            <aside className="hidden w-64 min-h-screen bg-charcoal border-r border-white/5 flex-col fixed left-0 top-0">
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">
                      movie_filter
                    </span>
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                    CINÉ<span className="text-accent">ADMIN</span>
                  </h1>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/dashboard">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/revenue">
                  <span className="material-symbols-outlined">payments</span>
                  <span className="font-medium">Revenue</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 sidebar-link active rounded-lg group"
                  to="/admin/organizers/wallet">
                  <span className="material-symbols-outlined">
                    account_balance_wallet
                  </span>
                  <span className="font-medium">Organizer Wallets</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/events/validation">
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  <span className="font-medium">Event Validation</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-accent hover:bg-white/5 transition-all rounded-lg group"
                  to="/admin/donations">
                  <span className="material-symbols-outlined">
                    volunteer_activism
                  </span>
                  <span className="font-medium">Donations</span>
                </Link>
              </nav>

              <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                      AD
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Finance Dept.</p>
                      <p className="text-white/40 italic text-[10px]">
                        Super Admin Access
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-lg transition-colors">
                    Logout Session
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 ml-0 p-10 max-w-[1600px]">
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Organizer Payout Management
                  </h2>
                  <p className="text-white/60 mt-1">
                    Review balances, verify bank details, and execute
                    disbursements.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => fetchOrganizers()}
                    className="flex items-center gap-2 bg-white/5 text-white/60 border border-white/10 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">
                      refresh
                    </span>
                    Refresh
                  </button>
                  <button className="flex items-center gap-2 bg-accent text-charcoal px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all border border-accent shadow-lg shadow-accent/10">
                    <span className="material-symbols-outlined text-sm">
                      account_balance
                    </span>
                    Batch Payout
                  </button>
                </div>
              </header>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      account_balance
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Platform Commission (10%)
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-primary">
                      {formatCurrency(platformCommission)}
                    </p>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Your earnings from all reservations
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      pending_actions
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Organizer Payouts (90%)
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-accent">
                      {formatCurrency(totalOutstandingBalance)}
                    </p>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Owed to {filteredOrganizers.length} organizer
                    {filteredOrganizers.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      calendar_today
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                    Total Organizers
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-white">
                      {pagination?.total || 0}
                    </p>
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 italic font-medium">
                    Active accounts on platform
                  </p>
                </div>
              </div>

              {/* Filter and Table Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-4">
                      Sort &amp; Filter
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">
                          Balance Priority
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:ring-accent focus:border-accent p-2">
                          <option value="balance_desc">
                            High Balance First
                          </option>
                          <option value="balance_asc">Low Balance First</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase block mb-2">
                          Verification Status
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="verification"
                              value="unverified"
                              checked={verificationFilter === "unverified"}
                              onChange={(e) => {
                                setVerificationFilter(e.target.value);
                                setPage(1);
                              }}
                              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                              Pending Verification
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="verification"
                              value="verified"
                              checked={verificationFilter === "verified"}
                              onChange={(e) => {
                                setVerificationFilter(e.target.value);
                                setPage(1);
                              }}
                              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                              Verified Only
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="verification"
                              value="all"
                              checked={verificationFilter === "all"}
                              onChange={(e) => {
                                setVerificationFilter(e.target.value);
                                setPage(1);
                              }}
                              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                              All Accounts
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <span className="material-symbols-outlined text-sm">
                        info
                      </span>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">
                        Compliance Note
                      </h4>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed italic">
                      Payouts are only allowed for organizers with "Bank Details
                      Verified" status. Admin receives 10% commission on all
                      transactions.
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-3">
                  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                      <h3 className="font-bold flex items-center gap-2">
                        <span className="w-1 h-5 bg-accent rounded-full" />
                        Organizer List
                      </h3>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                          search
                        </span>
                        <input
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                          }}
                          className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs w-64 focus:ring-accent focus:border-accent text-white placeholder-white/30"
                          placeholder="Search organizer..."
                          type="text"
                        />
                      </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                      <div className="p-8 text-center">
                        <div
                          className="loading-spinner"
                          style={{ margin: "0 auto" }}></div>
                        <p className="text-white/60 mt-4">
                          Loading organizers...
                        </p>
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <div className="p-8 text-center bg-danger/10 border-t border-danger/20">
                        <p className="text-danger font-bold">{error}</p>
                      </div>
                    )}

                    {/* Table Content */}
                    {!loading && !error && (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                                  Organizer
                                </th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                                  Status
                                </th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">
                                  Comm. Rate
                                </th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">
                                  Current Balance
                                </th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {filteredOrganizers.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="5"
                                    className="p-8 text-center text-white/40">
                                    No organizers found
                                  </td>
                                </tr>
                              ) : (
                                filteredOrganizers.map((org) => (
                                  <tr
                                    key={org._id}
                                    className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                                          <span className="material-symbols-outlined text-accent text-xl">
                                            business
                                          </span>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold">
                                            {org.organizerProfile
                                              ?.organizationName || org.name}
                                          </p>
                                          <p className="text-[10px] text-white/40">
                                            {org.email}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {org.wallet?.bankDetailsVerified ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-tighter">
                                          <span className="material-symbols-outlined text-[10px] font-bold">
                                            verified
                                          </span>
                                          Bank Verified
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-danger/20 text-danger border border-danger/20 uppercase tracking-tighter">
                                          <span className="material-symbols-outlined text-[10px] font-bold">
                                            warning
                                          </span>
                                          Pending
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-4 text-xs font-medium text-white/60">
                                      {org.wallet?.commissionRate || 10}%
                                    </td>
                                    <td className="p-4 text-right">
                                      <p className="text-sm font-black text-white">
                                        {formatCurrency(
                                          org.wallet?.currentBalance || 0,
                                        )}
                                      </p>
                                      <p className="text-[9px] text-white/30">
                                        {org.lastPayoutDate
                                          ? `Last: ${new Date(org.lastPayoutDate).toLocaleDateString()}`
                                          : "Never paid"}
                                      </p>
                                    </td>
                                    <td className="p-4 text-center">
                                      {org.wallet?.bankDetailsVerified ? (
                                        <button
                                          onClick={() =>
                                            handleTriggerPayout(org._id)
                                          }
                                          disabled={
                                            processingPayoutId === org._id
                                          }
                                          className="bg-accent hover:brightness-110 text-charcoal px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all shadow-lg shadow-accent/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                          {processingPayoutId === org._id ? (
                                            <>
                                              <div
                                                className="loading-spinner"
                                                style={{
                                                  width: "12px",
                                                  height: "12px",
                                                  borderWidth: "2px",
                                                }}></div>
                                              Processing
                                            </>
                                          ) : (
                                            "Trigger Payout"
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleVerifyBankDetails(
                                              org._id,
                                              org.wallet?.bankDetailsVerified,
                                            )
                                          }
                                          className="bg-primary/50 hover:bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all">
                                          Verify Bank
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {pagination && (
                          <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                              Showing {(page - 1) * limit + 1} to{" "}
                              {Math.min(page * limit, pagination.total)} of{" "}
                              {pagination.total} Organizers
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="material-symbols-outlined text-sm leading-none">
                                  chevron_left
                                </span>
                              </button>
                              {Array.from(
                                { length: Math.min(5, pagination.pages) },
                                (_, i) => i + 1,
                              ).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setPage(p)}
                                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                                    page === p
                                      ? "bg-primary text-white border border-primary/50 shadow-sm"
                                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                                  }`}>
                                  {p}
                                </button>
                              ))}
                              <button
                                onClick={() =>
                                  setPage(Math.min(pagination.pages, page + 1))
                                }
                                disabled={page === pagination.pages}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="material-symbols-outlined text-sm leading-none">
                                  chevron_right
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </AdminPageFrame>
      </div>
    </>
  );
}
