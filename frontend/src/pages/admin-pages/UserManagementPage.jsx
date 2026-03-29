import React, { useEffect, useMemo, useState } from "react";
import AdminPageFrame from "../../components/admin/AdminPageFrame";
import {
  deleteUserAdmin,
  getAdminUsers,
  promoteUserToAdmin,
  toggleUserBlockAdmin,
  updateUserRoleAdmin,
} from "../../api/authApi";

const PAGE_SIZE = 12;

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

function roleBadgeClass(role) {
  if (role === "organizer") {
    return "bg-accent/10 text-accent border-accent/20";
  }
  if (role === "admin") {
    return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
  }
  return "bg-primary/20 text-white/80 border-primary/20";
}

function userStatus(user) {
  if (user?.isBlocked) {
    return {
      label: "Suspended",
      tone: "text-yellow-500",
      dot: "bg-yellow-500",
    };
  }

  if (
    user?.role === "organizer" &&
    user?.organizerStatus === "pending_validation"
  ) {
    return {
      label: "Pending",
      tone: "text-yellow-400",
      dot: "bg-yellow-400",
    };
  }

  if (user?.role === "organizer" && user?.organizerStatus === "rejected") {
    return {
      label: "Rejected",
      tone: "text-red-400",
      dot: "bg-red-400",
    };
  }

  return {
    label: "Active",
    tone: "text-green-400",
    dot: "bg-green-400",
  };
}

function initials(name) {
  const source = String(name || "").trim();
  if (!source) {
    return "US";
  }

  const parts = source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "");

  return parts.join("") || "US";
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [candidateQuery, setCandidateQuery] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");
  const [rowActionLoadingId, setRowActionLoadingId] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const fetchUsers = async (targetPage = pagination.page) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getAdminUsers({
        q: debouncedQuery || undefined,
        role: roleFilter,
        status: statusFilter,
        excludeAdmins: true,
        page: targetPage,
        limit: PAGE_SIZE,
      });

      setUsers(Array.isArray(result?.users) ? result.users : []);
      setPagination((prev) => ({
        ...prev,
        ...(result?.pagination || {}),
      }));
    } catch (fetchError) {
      setUsers([]);
      setError(fetchError.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedQuery, pagination.page, roleFilter, statusFilter]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedQuery, roleFilter, statusFilter]);

  const loadInviteModalData = async (searchText = "") => {
    try {
      setIsModalLoading(true);
      setModalError("");

      const [adminsResult, candidatesResult] = await Promise.all([
        getAdminUsers({ role: "admin", page: 1, limit: 50 }),
        getAdminUsers({
          q: searchText || undefined,
          excludeAdmins: true,
          page: 1,
          limit: 25,
        }),
      ]);

      setAdmins(Array.isArray(adminsResult?.users) ? adminsResult.users : []);
      setCandidateUsers(
        Array.isArray(candidatesResult?.users) ? candidatesResult.users : [],
      );

      if (!selectedCandidateId && candidatesResult?.users?.length) {
        setSelectedCandidateId(candidatesResult.users[0]._id);
      }
    } catch (loadError) {
      setModalError(
        loadError.message || "Failed to load admin management data",
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const openInviteModal = async () => {
    setIsInviteModalOpen(true);
    setModalMessage("");
    setModalError("");
    setCandidateQuery("");
    setSelectedCandidateId("");
    await loadInviteModalData();
  };

  const handlePromote = async () => {
    if (!selectedCandidateId) {
      setModalError("Please select a user to promote.");
      return;
    }

    try {
      setIsPromoting(true);
      setModalError("");
      setModalMessage("");

      await promoteUserToAdmin(selectedCandidateId);
      setModalMessage("User promoted to admin successfully.");

      await Promise.all([
        fetchUsers(),
        loadInviteModalData(candidateQuery.trim()),
      ]);
    } catch (promoteError) {
      setModalError(promoteError.message || "Failed to promote user.");
    } finally {
      setIsPromoting(false);
    }
  };

  const handleChangeRole = async (user) => {
    const nextRole = user.role === "organizer" ? "spectator" : "organizer";
    const confirmed = window.confirm(
      `Change ${user.name} role from ${user.role} to ${nextRole}?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setRowActionLoadingId(user._id);
      setError("");
      await updateUserRoleAdmin(user._id, nextRole);
      await fetchUsers();
    } catch (actionError) {
      setError(actionError.message || "Failed to update role");
    } finally {
      setRowActionLoadingId("");
    }
  };

  const handleToggleBlock = async (user) => {
    const actionLabel = user.isBlocked ? "unsuspend" : "suspend";
    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} ${user.name}?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setRowActionLoadingId(user._id);
      setError("");
      await toggleUserBlockAdmin(user._id);
      await fetchUsers();
    } catch (actionError) {
      setError(actionError.message || "Failed to update suspension state");
    } finally {
      setRowActionLoadingId("");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.name} (${user.email})? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setRowActionLoadingId(user._id);
      setError("");
      await deleteUserAdmin(user._id);
      await fetchUsers();
    } catch (actionError) {
      setError(actionError.message || "Failed to delete user");
    } finally {
      setRowActionLoadingId("");
    }
  };

  const canGoPrev = pagination.page > 1;
  const canGoNext = pagination.page < pagination.pages;

  const selectedCandidate = useMemo(
    () =>
      candidateUsers.find((user) => user._id === selectedCandidateId) || null,
    [candidateUsers, selectedCandidateId],
  );

  return (
    <>
      <style>{`
        .user-management-page {
          font-family: 'Spline Sans', sans-serif;
        }

        .user-management-page .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .user-management-page .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .user-management-page .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #800020;
          border-radius: 10px;
        }
      `}</style>

      <div className="user-management-page min-h-screen bg-background-dark text-white">
        <AdminPageFrame
          title="User & Role Management"
          subtitle="Manage permissions and participant accounts">
          <main className="w-full max-w-[1440px] px-6 py-10 md:px-20">
            <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-center">
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/50"
                  disabled
                  type="button">
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  Export CSV
                </button>
                <button
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                  onClick={openInviteModal}
                  type="button">
                  <span className="material-symbols-outlined text-sm">
                    person_add
                  </span>
                  Add Admin
                </button>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-white/10 bg-charcoal/50 p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    search
                  </span>
                  <input
                    className="w-full rounded-xl border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/40 transition-all focus:border-accent focus:ring-accent"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or email..."
                    type="text"
                    value={query}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="relative min-w-[160px]">
                    <select
                      className="w-full appearance-none rounded-xl border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:ring-accent"
                      onChange={(event) => setRoleFilter(event.target.value)}
                      value={roleFilter}>
                      <option className="bg-charcoal" value="all">
                        All Roles
                      </option>
                      <option className="bg-charcoal" value="organizer">
                        Organizers
                      </option>
                      <option className="bg-charcoal" value="spectator">
                        Spectators
                      </option>
                    </select>
                  </div>
                  <div className="relative min-w-[160px]">
                    <select
                      className="w-full appearance-none rounded-xl border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-accent focus:ring-accent"
                      onChange={(event) => setStatusFilter(event.target.value)}
                      value={statusFilter}>
                      <option className="bg-charcoal" value="all">
                        Account Status
                      </option>
                      <option
                        className="bg-charcoal text-green-400"
                        value="active">
                        Active
                      </option>
                      <option
                        className="bg-charcoal text-yellow-400"
                        value="pending">
                        Pending
                      </option>
                      <option
                        className="bg-charcoal text-red-400"
                        value="rejected">
                        Rejected
                      </option>
                    </select>
                  </div>
                  <button
                    className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-charcoal transition-all hover:opacity-90"
                    onClick={() => {
                      setQuery("");
                      setRoleFilter("all");
                      setStatusFilter("all");
                    }}
                    type="button">
                    <span className="material-symbols-outlined text-sm">
                      filter_alt_off
                    </span>
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-charcoal/30">
              <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                        User Details
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                        Role
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                        Registration Date
                      </th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-accent">
                        Status
                      </th>
                      <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-widest text-accent">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td
                          className="px-6 py-8 text-sm text-white/50"
                          colSpan={5}>
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length ? (
                      users.map((user) => {
                        const status = userStatus(user);
                        return (
                          <tr
                            className="group transition-colors hover:bg-white/5"
                            key={user._id}>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-xs font-bold text-accent">
                                  {initials(user.name)}
                                </div>
                                <div>
                                  <div className="font-bold text-white">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-white/40">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase ${roleBadgeClass(
                                  user.role,
                                )}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-white/60">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-5">
                              <div
                                className={`flex items-center gap-2 ${status.tone}`}>
                                <span
                                  className={`h-2 w-2 rounded-full ${status.dot}`}
                                />
                                <span className="text-xs font-bold">
                                  {status.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="rounded-lg p-2 text-white/40 transition-all hover:bg-white/10 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                                  disabled={rowActionLoadingId === user._id}
                                  onClick={() => handleChangeRole(user)}
                                  title="Switch between organizer and spectator"
                                  type="button">
                                  <span className="material-symbols-outlined text-xl">
                                    manage_accounts
                                  </span>
                                </button>
                                <button
                                  className="rounded-lg p-2 text-white/40 transition-all hover:bg-white/10 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                  disabled={rowActionLoadingId === user._id}
                                  onClick={() => handleToggleBlock(user)}
                                  title={
                                    user.isBlocked
                                      ? "Unsuspend user"
                                      : "Suspend user"
                                  }
                                  type="button">
                                  <span className="material-symbols-outlined text-xl">
                                    {user.isBlocked ? "check_circle" : "block"}
                                  </span>
                                </button>
                                <button
                                  className="rounded-lg p-2 text-white/40 transition-all hover:bg-white/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                  disabled={rowActionLoadingId === user._id}
                                  onClick={() => handleDeleteUser(user)}
                                  title="Delete user"
                                  type="button">
                                  <span className="material-symbols-outlined text-xl">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          className="px-6 py-8 text-sm text-white/50"
                          colSpan={5}>
                          No users found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4">
                <span className="text-xs text-white/40">
                  Showing {users.length} of {pagination.total || 0} users
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-white/10 bg-charcoal px-3 py-1 text-xs text-white/80 transition-colors hover:border-accent disabled:text-white/30"
                    disabled={!canGoPrev || isLoading}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    type="button">
                    Previous
                  </button>
                  <span className="rounded-md bg-accent px-3 py-1 text-xs font-black text-charcoal">
                    {pagination.page} / {Math.max(1, pagination.pages || 1)}
                  </span>
                  <button
                    className="rounded-md border border-white/10 bg-charcoal px-3 py-1 text-xs text-white/80 transition-colors hover:border-accent disabled:text-white/30"
                    disabled={!canGoNext || isLoading}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    type="button">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>

          {isInviteModalOpen ? (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-charcoal shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Admin Access Control
                    </h3>
                    <p className="text-xs text-white/45">
                      View current admins and pass admin privileges to another
                      user.
                    </p>
                  </div>
                  <button
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10"
                    onClick={() => setIsInviteModalOpen(false)}
                    type="button">
                    <span className="material-symbols-outlined text-base">
                      close
                    </span>
                  </button>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-2">
                  <section>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">
                      Current Admins
                    </h4>
                    <div className="max-h-64 space-y-2 overflow-auto pr-1 custom-scrollbar">
                      {admins.length ? (
                        admins.map((adminUser) => (
                          <div
                            className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2"
                            key={adminUser._id}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-black text-emerald-200">
                              {initials(adminUser.name)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {adminUser.name}
                              </p>
                              <p className="text-[11px] text-white/50">
                                {adminUser.email}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-white/40">
                          No admins found.
                        </p>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">
                      Promote User To Admin
                    </h4>

                    <div className="space-y-3">
                      <input
                        className="w-full rounded-xl border border-white/10 bg-background-dark px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
                        onChange={(event) =>
                          setCandidateQuery(event.target.value)
                        }
                        placeholder="Search user by name or email"
                        type="text"
                        value={candidateQuery}
                      />

                      <button
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/75 hover:bg-white/10"
                        disabled={isModalLoading}
                        onClick={() =>
                          loadInviteModalData(candidateQuery.trim())
                        }
                        type="button">
                        Search
                      </button>

                      <select
                        className="w-full rounded-xl border border-white/10 bg-background-dark px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                        onChange={(event) =>
                          setSelectedCandidateId(event.target.value)
                        }
                        value={selectedCandidateId}>
                        <option value="">Select user</option>
                        {candidateUsers.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>

                      {selectedCandidate ? (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                          Selected: {selectedCandidate.name} -{" "}
                          {selectedCandidate.email}
                        </div>
                      ) : null}

                      <button
                        className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-black text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={
                          isPromoting || isModalLoading || !selectedCandidateId
                        }
                        onClick={handlePromote}
                        type="button">
                        {isPromoting ? "Granting..." : "Grant Admin Privileges"}
                      </button>
                    </div>
                  </section>
                </div>

                {(modalError || modalMessage) && (
                  <div className="border-t border-white/10 px-6 py-3">
                    {modalError ? (
                      <p className="text-sm text-red-300">{modalError}</p>
                    ) : (
                      <p className="text-sm text-emerald-300">{modalMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </AdminPageFrame>
      </div>
    </>
  );
}
