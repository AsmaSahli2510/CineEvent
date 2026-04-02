import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import {
  approveOrganizerAdmin,
  getPendingOrganizersAdmin,
  rejectOrganizerAdmin,
} from "../../api/authApi";

const CHECKLIST_ITEMS = [
  {
    key: "businessRegistrationValid",
    label: "Business registration document is clear and valid",
  },
  {
    key: "representativeIdMatches",
    label: "Representative identity document matches account details",
  },
  {
    key: "ibanVerified",
    label: "IBAN is valid and ownership information is consistent",
  },
  {
    key: "profileInformationComplete",
    label: "Organization profile information is complete and coherent",
  },
];

const buildDefaultChecklist = () =>
  CHECKLIST_ITEMS.reduce((acc, item) => {
    acc[item.key] = false;
    return acc;
  }, {});

export default function OrganizerValidationPage() {
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reviewByOrganizer, setReviewByOrganizer] = useState({});

  const selectedOrganizer = useMemo(
    () =>
      pendingOrganizers.find(
        (organizer) => organizer._id === selectedOrganizerId,
      ) || null,
    [pendingOrganizers, selectedOrganizerId],
  );

  const selectedOrganizerDocuments = useMemo(() => {
    const uploadedDocuments =
      selectedOrganizer?.organizerProfile?.legalDocuments || [];

    if (uploadedDocuments.length > 0) {
      return uploadedDocuments.map((doc) => ({
        name: doc?.name || "Unnamed document",
        url: doc?.url || "",
        mimeType: doc?.mimeType || "",
      }));
    }

    const fallbackNames = (
      selectedOrganizer?.organizerProfile?.legalDocumentName || ""
    )
      .split(",")
      .map((doc) => doc.trim())
      .filter(Boolean);

    if (fallbackNames.length === 0) {
      return [{ name: "No document names provided", url: "", mimeType: "" }];
    }

    return fallbackNames.map((name) => ({ name, url: "", mimeType: "" }));
  }, [selectedOrganizer]);

  const currentDocument = selectedOrganizerDocuments[
    Math.min(
      activeDocumentIndex,
      Math.max(selectedOrganizerDocuments.length - 1, 0),
    )
  ] || { name: "No document names provided", url: "", mimeType: "" };

  const formatTimeAgo = (dateValue) => {
    if (!dateValue) return "Applied recently";

    const appliedAt = new Date(dateValue).getTime();
    const now = Date.now();
    const diffMinutes = Math.max(1, Math.floor((now - appliedAt) / 60000));

    if (diffMinutes < 60) return `Applied ${diffMinutes} minute(s) ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Applied ${diffHours} hour(s) ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `Applied ${diffDays} day(s) ago`;
  };

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");
      const organizers = await getPendingOrganizersAdmin();
      setPendingOrganizers(organizers);

      if (organizers.length === 0) {
        setSelectedOrganizerId(null);
      } else {
        const stillExists = organizers.some(
          (item) => item._id === selectedOrganizerId,
        );
        if (!stillExists) {
          setSelectedOrganizerId(organizers[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load organizer applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  useEffect(() => {
    setActiveDocumentIndex(0);
  }, [selectedOrganizerId]);

  useEffect(() => {
    if (!selectedOrganizerId || reviewByOrganizer[selectedOrganizerId]) {
      return;
    }

    setReviewByOrganizer((prev) => ({
      ...prev,
      [selectedOrganizerId]: {
        checklist: buildDefaultChecklist(),
        internalNote: "",
      },
    }));
  }, [selectedOrganizerId, reviewByOrganizer]);

  const currentReview = selectedOrganizerId
    ? reviewByOrganizer[selectedOrganizerId] || {
        checklist: buildDefaultChecklist(),
        internalNote: "",
      }
    : {
        checklist: buildDefaultChecklist(),
        internalNote: "",
      };

  const missingChecklistItems = CHECKLIST_ITEMS.filter(
    (item) => !currentReview.checklist[item.key],
  );

  const updateChecklistItem = (key, checked) => {
    if (!selectedOrganizerId) return;

    setReviewByOrganizer((prev) => ({
      ...prev,
      [selectedOrganizerId]: {
        checklist: {
          ...(prev[selectedOrganizerId]?.checklist || buildDefaultChecklist()),
          [key]: checked,
        },
        internalNote: prev[selectedOrganizerId]?.internalNote || "",
      },
    }));
  };

  const updateInternalNote = (value) => {
    if (!selectedOrganizerId) return;

    setReviewByOrganizer((prev) => ({
      ...prev,
      [selectedOrganizerId]: {
        checklist:
          prev[selectedOrganizerId]?.checklist || buildDefaultChecklist(),
        internalNote: value,
      },
    }));
  };

  const handleApprove = async () => {
    if (!selectedOrganizer) return;

    try {
      setApproving(true);
      setError("");
      setSuccessMessage("");

      if (missingChecklistItems.length > 0) {
        setError(
          "All checklist items must be marked as validated before approval.",
        );
        return;
      }

      await approveOrganizerAdmin(selectedOrganizer._id, {
        checklist: currentReview.checklist,
        internalNote: currentReview.internalNote,
      });

      setSuccessMessage(
        `Approved ${selectedOrganizer.organizerProfile?.organizationName || selectedOrganizer.name}. Approval email sent.`,
      );

      await fetchPending();
    } catch (err) {
      setError(err.message || "Failed to approve organizer");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrganizer) return;

    try {
      setRejecting(true);
      setError("");
      setSuccessMessage("");

      if (missingChecklistItems.length === 0) {
        setError(
          "To reject, leave at least one checklist item unchecked so missing requirements can be emailed.",
        );
        return;
      }

      await rejectOrganizerAdmin(selectedOrganizer._id, {
        checklist: currentReview.checklist,
        internalNote: currentReview.internalNote,
      });

      setSuccessMessage(
        `Rejected ${selectedOrganizer.organizerProfile?.organizationName || selectedOrganizer.name}. Missing requirements and internal note were sent by email, then organizer data was deleted.`,
      );

      await fetchPending();
    } catch (err) {
      setError(err.message || "Failed to reject organizer");
    } finally {
      setRejecting(false);
    }
  };

  const getOrganizationName = (organizer) =>
    organizer?.organizerProfile?.organizationName?.trim() ||
    "Unknown Organization";

  const getInitial = (organizer) =>
    getOrganizationName(organizer).charAt(0).toUpperCase();

  const getWebsite = (organizer) =>
    organizer?.organizerProfile?.website?.trim() || "Not provided";
  const getIban = (organizer) =>
    organizer?.organizerProfile?.iban?.trim() || "Not provided";

  const isImageDocument = (mimeType) => mimeType.startsWith("image/");
  const isPdfDocument = (mimeType, url) =>
    mimeType === "application/pdf" || url.toLowerCase().endsWith(".pdf");

  const showPreviousDocument = () => {
    if (selectedOrganizerDocuments.length <= 1) return;
    setActiveDocumentIndex((prev) =>
      prev === 0 ? selectedOrganizerDocuments.length - 1 : prev - 1,
    );
  };

  const showNextDocument = () => {
    if (selectedOrganizerDocuments.length <= 1) return;
    setActiveDocumentIndex((prev) =>
      prev === selectedOrganizerDocuments.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <style>{`
				.organizer-validation-page {
					font-family: 'Spline Sans', sans-serif;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-track {
					background: #1C1C1C;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-thumb {
					background: #F5C06533;
					border-radius: 10px;
				}

				.organizer-validation-page .custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #F5C06566;
				}
			`}</style>

      <div className="organizer-validation-page bg-background-dark text-white min-h-screen">
        <AdminPageFrame
          title="Organizer Validation"
          subtitle="Review and approve organizer applications">
          <header className="hidden sticky top-0 z-50 w-full border-b border-accent/20 bg-background-dark/95 backdrop-blur-md px-6 md:px-12 py-4">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-accent">
                  <span className="material-symbols-outlined text-3xl">
                    movie_filter
                  </span>
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white">
                  CINÉ<span className="text-accent">ADMIN</span>{" "}
                  <span className="ml-2 text-xs font-normal tracking-widest uppercase border-l border-white/20 pl-3 text-white/60">
                    Admin Panel
                  </span>
                </h1>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                <Link
                  className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                  to="/admin/dashboard">
                  Dashboard
                </Link>
                <Link
                  className="text-accent font-medium text-xs uppercase tracking-widest transition-colors border-b border-accent pb-1"
                  to="/admin/organizers/validation">
                  Validation Queue
                </Link>
                <Link
                  className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                  to="/admin/users">
                  User Management
                </Link>
                <Link
                  className="text-white/60 hover:text-accent font-medium text-xs uppercase tracking-widest transition-colors"
                  to="/admin/statistics">
                  Reports
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-white">
                    Admin User
                  </span>
                  <span className="text-[10px] text-accent uppercase tracking-tighter">
                    Super Admin
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary border border-accent/30 flex items-center justify-center text-accent font-bold">
                  AD
                </div>
              </div>
            </div>
          </header>

          <main
            className={`relative max-w-[1600px] w-full p-2.5 md:p-3 flex ${
              isQueueOpen ? "gap-3" : "gap-0"
            }`}>
            {isQueueOpen ? (
              <div className="w-[30%] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Validation Queue
                    </h2>
                    <p className="text-white/50 text-xs">
                      Reviewing {pendingOrganizers.length} pending organizer
                      application(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                      onClick={() => setIsQueueOpen(false)}
                      type="button">
                      <span className="material-symbols-outlined text-white/70">
                        chevron_left
                      </span>
                    </button>
                    <button
                      className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                      onClick={fetchPending}
                      type="button">
                      <span className="material-symbols-outlined text-accent">
                        refresh
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-2 max-h-[calc(100vh-220px)]">
                  {loading && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60">
                      Loading pending organizers...
                    </div>
                  )}

                  {!loading && pendingOrganizers.length === 0 && (
                    <div className="rounded-xl border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent p-5">
                      <div className="flex items-start gap-2.5">
                        <div className="rounded-lg bg-accent/20 p-2">
                          <span className="material-symbols-outlined text-accent">
                            fact_check
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Queue is clear
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-white/60">
                            There are currently no organizer applications
                            waiting for validation.
                          </p>
                        </div>
                      </div>

                      <button
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
                        onClick={fetchPending}
                        type="button">
                        <span className="material-symbols-outlined text-sm">
                          refresh
                        </span>
                        Check Again
                      </button>
                    </div>
                  )}

                  {!loading &&
                    pendingOrganizers.map((organizer) => {
                      const isActive = organizer._id === selectedOrganizerId;
                      return (
                        <button
                          className={
                            isActive
                              ? "w-full text-left p-3 bg-primary/20 border-l-4 border-accent rounded-r-xl border-y border-r border-white/10"
                              : "w-full text-left p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                          }
                          key={organizer._id}
                          onClick={() => setSelectedOrganizerId(organizer._id)}
                          type="button">
                          <div className="flex justify-between items-start mb-1.5">
                            <div>
                              <h4 className="font-bold text-sm text-white">
                                {getOrganizationName(organizer)}
                              </h4>
                              <p className="text-white/60 text-xs">
                                {formatTimeAgo(organizer.createdAt)}
                              </p>
                            </div>
                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              Pending Review
                            </span>
                          </div>
                          <div className="flex gap-2 mb-2.5 text-xs text-white/70">
                            <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20">
                              <span className="material-symbols-outlined text-xs">
                                check_circle
                              </span>
                              Profile
                            </span>
                            <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">
                              <span className="material-symbols-outlined text-xs">
                                schedule
                              </span>
                              Legal Review
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-white/40">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">
                                person
                              </span>
                              {organizer.name}
                            </span>
                            <span className="flex items-center gap-1 max-w-[46%] truncate">
                              <span className="material-symbols-outlined text-sm">
                                mail
                              </span>
                              {organizer.email}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : null}

            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden">
                {!selectedOrganizer ? (
                  <div className="flex-1 p-8">
                    {!loading && pendingOrganizers.length === 0 ? (
                      <div className="h-full rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-white/0 to-transparent p-6 flex flex-col items-center justify-center text-center">
                        <div className="mb-3 rounded-full border border-accent/30 bg-accent/15 p-3">
                          <span className="material-symbols-outlined text-4xl text-accent">
                            task_alt
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">
                          All Applications Reviewed
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                          Great work. No organizer is currently waiting for
                          approval or rejection. New submissions will appear
                          here automatically.
                        </p>

                        <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                            <p className="text-[11px] uppercase tracking-wider text-white/45">
                              Queue Status
                            </p>
                            <p className="mt-1 text-sm font-semibold text-accent">
                              0 pending applications
                            </p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                            <p className="text-[11px] uppercase tracking-wider text-white/45">
                              Suggested Action
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white/80">
                              Recheck queue in a few minutes
                            </p>
                          </div>
                        </div>

                        <button
                          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                          onClick={fetchPending}
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            refresh
                          </span>
                          Refresh Validation Queue
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-white/60">
                        Select a pending organizer from the queue to review
                        details.
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent text-lg font-black">
                          {getInitial(selectedOrganizer)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold">
                            {getOrganizationName(selectedOrganizer)}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-white/50 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-accent">
                                mail
                              </span>
                              {selectedOrganizer.email}
                            </span>
                            <span className="text-xs text-white/50 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-accent">
                                language
                              </span>
                              {getWebsite(selectedOrganizer)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent rounded-lg text-xs font-bold hover:bg-accent/20 transition-all"
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            account_balance
                          </span>
                          {getIban(selectedOrganizer)}
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/10 transition-all"
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            history
                          </span>
                          {formatTimeAgo(selectedOrganizer.createdAt)}
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                      <div className="flex-1 p-4 bg-charcoal/50 flex flex-col items-center justify-center border-r border-white/10 overflow-y-auto custom-scrollbar">
                        <div className="w-full max-w-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-accent">
                              Submitted Legal Documents
                            </h5>
                            <div className="flex items-center gap-2">
                              <button
                                className="p-1.5 hover:bg-white/10 rounded disabled:opacity-40"
                                disabled={
                                  selectedOrganizerDocuments.length <= 1
                                }
                                onClick={showPreviousDocument}
                                type="button">
                                <span className="material-symbols-outlined text-sm">
                                  chevron_left
                                </span>
                              </button>
                              <span className="text-[10px] text-white/60 min-w-12 text-center">
                                {activeDocumentIndex + 1}/
                                {selectedOrganizerDocuments.length}
                              </span>
                              <button
                                className="p-1.5 hover:bg-white/10 rounded disabled:opacity-40"
                                disabled={
                                  selectedOrganizerDocuments.length <= 1
                                }
                                onClick={showNextDocument}
                                type="button">
                                <span className="material-symbols-outlined text-sm">
                                  chevron_right
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="aspect-[1/1.05] bg-white rounded-lg shadow-2xl relative overflow-hidden flex items-start p-3 text-charcoal">
                            <div className="w-full h-full flex flex-col gap-3">
                              <div>
                                <p className="text-sm font-bold mb-1">
                                  Current document
                                </p>
                                <p className="text-xs leading-relaxed break-words mb-1">
                                  {currentDocument.name}
                                </p>
                                {currentDocument.url && (
                                  <a
                                    className="text-xs text-blue-700 underline"
                                    href={currentDocument.url}
                                    rel="noreferrer"
                                    target="_blank">
                                    Open original file
                                  </a>
                                )}
                              </div>

                              <div className="flex-1 min-h-0 rounded-md border border-charcoal/10 bg-white overflow-hidden">
                                {!currentDocument.url && (
                                  <div className="h-full flex items-center justify-center text-xs text-charcoal/60 px-4 text-center">
                                    No uploaded file URL available for this
                                    document.
                                  </div>
                                )}

                                {currentDocument.url &&
                                  isImageDocument(currentDocument.mimeType) && (
                                    <img
                                      alt={currentDocument.name}
                                      className="h-full w-full object-contain"
                                      src={currentDocument.url}
                                    />
                                  )}

                                {currentDocument.url &&
                                  !isImageDocument(currentDocument.mimeType) &&
                                  isPdfDocument(
                                    currentDocument.mimeType,
                                    currentDocument.url,
                                  ) && (
                                    <iframe
                                      className="h-full w-full"
                                      src={currentDocument.url}
                                      title={currentDocument.name}
                                    />
                                  )}

                                {currentDocument.url &&
                                  !isImageDocument(currentDocument.mimeType) &&
                                  !isPdfDocument(
                                    currentDocument.mimeType,
                                    currentDocument.url,
                                  ) && (
                                    <div className="h-full flex items-center justify-center text-xs text-charcoal/70 px-4 text-center">
                                      Preview is not supported for this file
                                      type. Use "Open original file".
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-64 p-3.5 flex flex-col gap-3.5 bg-white/[0.01]">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                            Checklist
                          </label>
                          <div className="space-y-3">
                            {CHECKLIST_ITEMS.map((item) => (
                              <label
                                className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10 hover:border-accent/30 transition-all cursor-pointer"
                                key={item.key}>
                                <input
                                  checked={
                                    currentReview.checklist[item.key] === true
                                  }
                                  className="h-4 w-4 accent-[#F5C065]"
                                  onChange={(e) =>
                                    updateChecklistItem(
                                      item.key,
                                      e.target.checked,
                                    )
                                  }
                                  type="checkbox"
                                />
                                <span className="text-xs font-medium leading-snug">
                                  {item.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                            Internal Notes
                          </label>
                          <textarea
                            className="w-full h-24 bg-charcoal/40 border border-white/10 rounded-lg p-2.5 text-xs focus:ring-accent focus:border-accent resize-none placeholder:text-white/20"
                            onChange={(e) => updateInternalNote(e.target.value)}
                            placeholder="Add private notes about this application..."
                            value={currentReview.internalNote}
                          />
                        </div>

                        {missingChecklistItems.length > 0 && (
                          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                            <p className="text-xs font-bold text-yellow-300 mb-2 uppercase tracking-wider">
                              Missing Requirements (used for rejection email)
                            </p>
                            <ul className="space-y-1">
                              {missingChecklistItems.map((item) => (
                                <li
                                  className="text-xs text-yellow-200"
                                  key={item.key}>
                                  • {item.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-col gap-3">
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-green-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-sm"
                            disabled={approving}
                            onClick={handleApprove}
                            type="button">
                            <span className="material-symbols-outlined">
                              check_circle
                            </span>
                            {approving ? "Approving..." : "Approve Application"}
                          </button>
                          <button
                            className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary-light text-red-400 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-sm"
                            disabled={rejecting}
                            onClick={handleReject}
                            type="button">
                            <span className="material-symbols-outlined">
                              cancel
                            </span>
                            {rejecting
                              ? "Rejecting..."
                              : "Reject / Request Info"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-accent/10 border border-accent/20 p-3 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">
                  info
                </span>
                <p className="text-xs text-accent/90">
                  Organizer data in this queue now comes from real pending
                  applications. Approving an organizer sends the activation
                  email automatically.{" "}
                  <a className="font-bold underline" href="#">
                    Refresh queue
                  </a>
                </p>
              </div>
            </div>

            {!isQueueOpen ? (
              <button
                className="absolute left-2 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:bg-white/15"
                onClick={() => setIsQueueOpen(true)}
                title="Open queue"
                type="button">
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </button>
            ) : null}
          </main>

          <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 hidden">
            <div className="bg-background-dark border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Reject Application</h3>
              <p className="text-white/60 mb-6 text-sm">
                Please select a reason for rejection. This will be sent to the
                organizer.
              </p>

              <div className="space-y-3 mb-8">
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                  <input
                    className="text-accent focus:ring-accent bg-transparent"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-sm">Incomplete Documentation</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                  <input
                    className="text-accent focus:ring-accent bg-transparent"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-sm">ID/KBIS Information Mismatch</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-accent/50">
                  <input
                    className="text-accent focus:ring-accent bg-transparent"
                    name="reason"
                    type="radio"
                  />
                  <span className="text-sm">Business Type Not Supported</span>
                </label>
                <div className="mt-4">
                  <label className="text-xs text-white/40 mb-1 block">
                    Custom Message
                  </label>
                  <textarea className="w-full h-24 bg-charcoal/40 border border-white/10 rounded-xl p-3 text-sm focus:ring-accent focus:border-accent resize-none" />
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>

          <footer className="bg-charcoal/50 border-t border-white/5 py-6 px-12">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30 font-bold">
              <span>© 2024 CinéEvent Admin Portal</span>
              <div className="flex gap-6">
                <a className="hover:text-accent transition-colors" href="#">
                  Security Audit
                </a>
                <a className="hover:text-accent transition-colors" href="#">
                  System Status
                </a>
                <a className="hover:text-accent transition-colors" href="#">
                  API Logs
                </a>
              </div>
            </div>
          </footer>
        </AdminPageFrame>
      </div>
    </>
  );
}
