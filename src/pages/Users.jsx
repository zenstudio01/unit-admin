
import { useCallback, useEffect, useState } from "react";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  RefreshCw,
  Eye,
  X,
  Mail,
  CalendarDays,
  Building2,
  Clock3,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminUsers,
  getAdminUserStats,
  getAdminUserDetail,
  updateAdminUserStatus,
} from "../api/adminUsers";
import { getStoredAdmin } from "../api/adminAuth";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const formatNumber = (value) =>
  value === null || value === undefined
    ? "—"
    : Number(value).toLocaleString("en-KE");

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Never";

function getRole(user) {
  if (user.is_superuser) return "Super Admin";
  if (user.is_staff) return "Platform Admin";
  return "User";
}

function RoleBadge({ user }) {
  const style = user.is_superuser
    ? "bg-purple-50 text-purple-700"
    : user.is_staff
    ? "bg-orange-50 text-orange-700"
    : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${style}`}>
      {getRole(user)}
    </span>
  );
}

function AccountBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color = PRIMARY }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={21} color={color} />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function UserAvatar({ user, size = "md" }) {
  const initial = (
    user.full_name ||
    user.username ||
    "U"
  ).charAt(0).toUpperCase();

  const dimensions = size === "lg"
    ? "h-16 w-16 text-2xl"
    : "h-11 w-11 text-lg";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl font-black ${dimensions}`}
      style={{
        backgroundColor: `${PRIMARY}12`,
        color: PRIMARY,
      }}
    >
      {initial}
    </div>
  );
}

function DetailField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function UserDetails({
  userId,
  onClose,
  onChanged,
  currentAdmin,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminUserDetail(userId);
      setDetail(response.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load user details."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const user = detail;

  const canChangeStatus = Boolean(
    user &&
    !user.is_superuser &&
    !(user.id === currentAdmin?.id && user.is_active) &&
    (!user.is_staff || currentAdmin?.is_superuser)
  );

  const changeStatus = async () => {
    if (!user || !canChangeStatus || saving) return;

    const nextStatus = !user.is_active;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate the account for "${user.full_name}"?`
        : `Deactivate the account for "${user.full_name}"? This will prevent future authenticated access.`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      const response = await updateAdminUserStatus(
        user.id,
        nextStatus
      );

      setDetail(response.user);
      onChanged();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to update user status."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close user details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="User details"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              User Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Account information and organization memberships
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw
                size={28}
                color={PRIMARY}
                className="animate-spin"
              />
            </div>
          ) : !user ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error || "User not found."}
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-4">
                <UserAvatar user={user} size="lg" />

                <div className="min-w-0">
                  <h3 className="text-xl font-black text-slate-900">
                    {user.full_name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    @{user.username}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <AccountBadge active={user.is_active} />
                    <RoleBadge user={user} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-500">Organizations</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {formatNumber(user.organization_count)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-500">Account Type</p>
                  <p className="mt-2 text-sm font-black text-slate-900">
                    {getRole(user)}
                  </p>
                </div>
              </div>

              <section className="rounded-2xl border border-slate-100 p-5">
                <h4 className="font-black text-slate-900">
                  Account Information
                </h4>
                <div className="mt-3 grid gap-x-5 sm:grid-cols-2">
                  <DetailField
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                  />
                  <DetailField
                    icon={UsersIcon}
                    label="Username"
                    value={user.username}
                  />
                  <DetailField
                    icon={CalendarDays}
                    label="Registration Date"
                    value={formatDate(user.created_at)}
                  />
                  <DetailField
                    icon={Clock3}
                    label="Last Login"
                    value={formatDateTime(user.last_login)}
                  />
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="border-b border-slate-100 p-5">
                  <h4 className="font-black text-slate-900">
                    Organization Memberships
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Organizations and assigned roles for this user
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {(user.memberships || []).map((membership) => (
                    <div
                      key={membership.id}
                      className="flex items-start gap-3 p-5"
                    >
                      <div
                        className="rounded-xl p-3"
                        style={{ backgroundColor: `${PRIMARY}12` }}
                      >
                        <Building2 size={19} color={PRIMARY} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800">
                          {membership.organization_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {membership.roles?.join(", ") ||
                            membership.primary_role ||
                            "No role assigned"}
                        </p>
                      </div>

                      <AccountBadge active={membership.is_active} />
                    </div>
                  ))}

                  {!user.memberships?.length && (
                    <div className="p-10 text-center text-sm text-slate-400">
                      This user has no organization memberships.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-900">
                      Account Access
                    </h4>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      Activate or deactivate this user's UNIT account.
                      This does not change their organization roles.
                    </p>
                  </div>

                  <button
                    onClick={changeStatus}
                    disabled={!canChangeStatus || saving}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 ${
                      user.is_active ? "bg-red-600" : "bg-emerald-600"
                    }`}
                  >
                    {saving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : user.is_active ? (
                      <UserX size={16} />
                    ) : (
                      <UserCheck size={16} />
                    )}

                    {saving
                      ? "Saving..."
                      : user.is_active
                      ? "Deactivate Account"
                      : "Activate Account"}
                  </button>
                </div>

                {!canChangeStatus && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-amber-700">
                    <LockKeyhole size={15} />
                    This account is protected from status changes by
                    your current administrator permissions.
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const currentAdmin = getStoredAdmin();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [userResponse, statsResponse] = await Promise.all([
          getAdminUsers({
            page,
            page_size: PAGE_SIZE,
            ...(search && { search }),
            ...(status && { status }),
            ...(role && { role }),
          }),
          getAdminUserStats(),
        ]);

        if (cancelled) return;

        setUsers(userResponse.results || []);
        setTotal(userResponse.count || 0);
        setStats(statsResponse);
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to load UNIT users."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page, search, status, role, reloadKey]);

  const refresh = () => setReloadKey((prev) => prev + 1);

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor registered users, account access, platform roles
            and organization memberships.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users}
          icon={UsersIcon}
        />
        <StatCard
          title="Active Users"
          value={stats?.active_users}
          icon={UserCheck}
          color="#059669"
        />
        <StatCard
          title="Inactive Users"
          value={stats?.inactive_users}
          icon={UserX}
          color="#DC2626"
        />
        <StatCard
          title="Platform Administrators"
          value={stats?.platform_admins}
          icon={ShieldCheck}
        />
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Registered Users
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {formatNumber(total)} matching accounts
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 sm:w-60"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Accounts</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="admin">Platform Admins</option>
              <option value="superadmin">Super Admins</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Platform Role</th>
                <th className="px-5 py-4">Organizations</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Last Login</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800">
                            {user.full_name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {user.email || user.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge user={user} />
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      {formatNumber(user.organization_count)}
                    </td>

                    <td className="px-5 py-4">
                      <AccountBadge active={user.is_active} />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDateTime(user.last_login)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedUser(user.id)}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-50"
                        style={{ color: PRIMARY }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex justify-center p-12">
              <RefreshCw
                size={26}
                color={PRIMARY}
                className="animate-spin"
              />
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="p-12 text-center">
              <UsersIcon
                size={34}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No users found.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} ·{" "}
            {formatNumber(total)} accounts
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* User details */}
      {selectedUser !== null && (
        <UserDetails
          userId={selectedUser}
          currentAdmin={currentAdmin}
          onClose={() => setSelectedUser(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
