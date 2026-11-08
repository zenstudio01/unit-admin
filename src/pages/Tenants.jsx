
import { useEffect, useState } from "react";
import {
  Users, UserCheck, UserX, Building2, Home,
  FileText, CalendarClock, Search, RefreshCw,
  Eye, X, ChevronLeft, ChevronRight,
  ShieldCheck, KeyRound, Clock3,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminTenants,
  getAdminTenantStats,
  getAdminTenantDetail,
  getAdminTenantLeases,
} from "../api/adminTenants";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const number = (v) =>
  Number(v || 0).toLocaleString("en-KE");

const money = (v) =>
  v == null
    ? "—"
    : `KES ${Number(v).toLocaleString("en-KE", {
        maximumFractionDigits: 2,
      })}`;

const date = (v) =>
  v
    ? new Date(`${String(v).slice(0, 10)}T12:00:00`)
        .toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
    : "—";

const label = (v) =>
  String(v ?? "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getError = (e) =>
  e.response?.data?.message ||
  e.response?.data?.detail ||
  "Unable to load tenant information.";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  blocked: "bg-red-50 text-red-700",
  draft: "bg-slate-100 text-slate-600",
  pending_approval: "bg-amber-50 text-amber-700",
  pending_signature: "bg-blue-50 text-blue-700",
  expired: "bg-red-50 text-red-700",
  terminated: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  completed: "bg-emerald-50 text-emerald-700",
  passed: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  review_required: "bg-amber-50 text-amber-700",
};

function Badge({ value }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        statusStyles[value] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {label(value)}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color = PRIMARY, note }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={21} color={color} />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900">
        {value}
      </p>
      {note && (
        <p className="mt-1 text-xs text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
}

function Empty({ message }) {
  return (
    <div className="p-12 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function Pagination({ page, count, loading, onChange }) {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
      <p className="text-xs text-slate-500">
        Page {page} of {pages} · {number(count)} records
      </p>
      <div className="flex gap-2">
        <button
          disabled={loading || page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          disabled={loading || page >= pages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Field({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  );
}

const DETAIL_TABS = [
  ["overview", "Overview"],
  ["assignments", "Units"],
  ["leases", "Leases"],
  ["screenings", "Screenings"],
];

function TenantDrawer({ id, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    let active = true;

    getAdminTenantDetail(id)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(getError(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const tenant = data?.tenant;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-label="Close details"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tenant details"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Tenant Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Tenant #{id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2.5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b p-3">
          {DETAIL_TABS.map(([key, title]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${
                tab === key
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              style={
                tab === key
                  ? { backgroundColor: PRIMARY }
                  : {}
              }
            >
              {title}
              {key !== "overview" && data && (
                <span className="ml-1 opacity-70">
                  ({(data[key] || []).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {loading && (
            <RefreshCw
              color={PRIMARY}
              className="mx-auto animate-spin"
            />
          )}

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {tenant && tab === "overview" && (
            <>
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-xl font-black text-slate-900">
                  {tenant.full_name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {tenant.organization?.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge value={tenant.status} />
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                    {label(tenant.tenant_type)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field title="Email" value={tenant.email} />
                <Field title="Phone" value={tenant.phone_number} />
                <Field title="Active Units" value={tenant.active_units} />
                <Field title="Active Leases" value={tenant.active_leases} />
                <Field title="Created" value={date(tenant.created_at)} />
              </div>
            </>
          )}

          {data && tab === "assignments" && (
            <div className="space-y-3">
              {data.assignments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">
                      {item.property}
                    </p>
                    <Badge
                      value={item.is_active ? "active" : "inactive"}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.unit} · {item.unit_code}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    Move in: {date(item.move_in_date)}
                    {item.ended_at &&
                      ` · Ended: ${date(item.ended_at)}`}
                  </p>
                </div>
              ))}
              {!data.assignments.length && (
                <Empty message="No unit assignments found." />
              )}
            </div>
          )}

          {data && tab === "leases" && (
            <div className="space-y-3">
              {data.leases.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">
                      {item.lease_number}
                    </p>
                    <Badge value={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.property?.name} · {item.unit?.name}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {money(item.monthly_rent)} / month
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {date(item.start_date)} – {date(item.end_date)}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Tenant role: {label(item.tenant_role)}
                  </p>
                </div>
              ))}
              {!data.leases.length && (
                <Empty message="No leases found." />
              )}
            </div>
          )}

          {data && tab === "screenings" && (
            <div className="space-y-3">
              {data.screenings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">
                      {label(item.screening_type)}
                    </p>
                    <Badge value={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Result: {label(item.result)}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Requested: {date(item.requested_at)}
                    {item.completed_at &&
                      ` · Completed: ${date(item.completed_at)}`}
                  </p>
                </div>
              ))}
              {!data.screenings.length && (
                <Empty message="No screening records found." />
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

const TABS = [
  ["tenants", "Tenants", Users],
  ["leases", "Leases", FileText],
];

export default function Tenants() {
  const [tab, setTab] = useState("tenants");
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [expiring, setExpiring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [reload, setReload] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    getAdminTenantStats()
      .then((result) => {
        if (active) {
          setStats(result);
          setStatsError("");
        }
      })
      .catch((e) => {
        if (active) setStatsError(getError(e));
      });

    return () => { active = false; };
  }, [reload]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          page_size: PAGE_SIZE,
          ...(search && { search }),
          ...(status && { status }),
          ...(tab === "tenants" && type
            ? { type }
            : {}),
          ...(tab === "leases" && expiring
            ? { expiring: "30" }
            : {}),
        };

        const result = tab === "tenants"
          ? await getAdminTenants(params)
          : await getAdminTenantLeases(params);

        if (active) {
          setRows(result.results || []);
          setCount(result.count || 0);
        }
      } catch (e) {
        if (active) {
          setRows([]);
          setCount(0);
          setError(getError(e));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [tab, page, search, status, type, expiring, reload]);

  const changeTab = (next) => {
    setTab(next);
    setPage(1);
    setSearchInput("");
    setSearch("");
    setStatus("");
    setType("");
    setExpiring(false);
  };

  const refresh = () => setReload((v) => v + 1);

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: PRIMARY }}
          >
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Tenants & Leases
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor tenant accounts, occupancy, lease agreements,
            expirations and screening activity across organizations.
          </p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {statsError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          Statistics: {statsError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value={number(stats?.total_tenants)}
          icon={Users}
        />
        <StatCard
          title="Active Tenants"
          value={number(stats?.active_tenants)}
          icon={UserCheck}
          color="#059669"
        />
        <StatCard
          title="Blocked Tenants"
          value={number(stats?.blocked_tenants)}
          icon={UserX}
          color="#DC2626"
        />
        <StatCard
          title="Tenants With Active Leases"
          value={number(stats?.tenants_with_active_leases)}
          icon={KeyRound}
          color="#2563EB"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Leases"
          value={number(stats?.active_leases)}
          icon={FileText}
        />
        <StatCard
          title="Leases Expiring in 30 Days"
          value={number(stats?.leases_expiring_30_days)}
          icon={CalendarClock}
          color="#D97706"
        />
        <StatCard
          title="Overdue Active Leases"
          value={number(stats?.overdue_active_leases)}
          icon={Clock3}
          color="#DC2626"
        />
        <StatCard
          title="Pending Screenings"
          value={number(stats?.pending_screenings)}
          icon={ShieldCheck}
          color="#7C3AED"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Units"
          value={number(stats?.total_units)}
          icon={Building2}
        />
        <StatCard
          title="Occupied Units"
          value={number(stats?.occupied_units)}
          icon={Home}
          color="#059669"
        />
        <StatCard
          title="Active Unit Assignments"
          value={number(stats?.active_unit_assignments)}
          icon={KeyRound}
          color="#2563EB"
        />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-3">
          {TABS.map(([key, title, Icon]) => (
            <button
              key={key}
              onClick={() => changeTab(key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                tab === key
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              style={
                tab === key
                  ? { backgroundColor: PRIMARY }
                  : {}
              }
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {tab === "tenants"
                ? "Tenant Directory"
                : "Lease Agreements"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {number(count)} matching records
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[190px] flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder={
                  tab === "tenants"
                    ? "Search tenants..."
                    : "Search leases..."
                }
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="">All Statuses</option>
              {(tab === "tenants"
                ? stats?.status_choices || []
                : stats?.lease_status_choices || []
              ).map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {tab === "tenants" ? (
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="">All Tenant Types</option>
                {(stats?.type_choices || []).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            ) : (
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={expiring}
                  onChange={(e) => {
                    setExpiring(e.target.checked);
                    setPage(1);
                  }}
                  className="accent-orange-600"
                />
                Expiring in 30 days
              </label>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50">
              {tab === "tenants" ? (
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Tenant</th>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Units</th>
                  <th className="px-5 py-4">Active Leases</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              ) : (
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Lease</th>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">Property / Unit</th>
                  <th className="px-5 py-4">Tenants</th>
                  <th className="px-5 py-4">Rent</th>
                  <th className="px-5 py-4">End Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              )}
            </thead>

            <tbody>
              {!loading && rows.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60"
                >
                  {tab === "tenants" ? (
                    <>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {item.full_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.email}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.organization?.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {label(item.tenant_type)}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {item.active_units}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {item.active_leases}
                      </td>
                      <td className="px-5 py-4">
                        <Badge value={item.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {date(item.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-50"
                          style={{ color: PRIMARY }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {item.lease_number}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.organization?.name}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {item.property?.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.unit?.name} · {item.unit?.unit_code}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {(item.tenants || []).slice(0, 2).map((tenant) => (
                          <p
                            key={tenant.id}
                            className="text-xs text-slate-600"
                          >
                            {tenant.name}
                            {tenant.is_primary ? " (Primary)" : ""}
                          </p>
                        ))}
                        {(item.tenants || []).length > 2 && (
                          <p className="text-xs text-slate-400">
                            +{item.tenants.length - 2} more
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {money(item.monthly_rent)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {date(item.end_date)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge value={item.status} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex justify-center p-12">
              <RefreshCw
                color={PRIMARY}
                size={26}
                className="animate-spin"
              />
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <Empty message="No matching records found." />
          )}
        </div>

        <Pagination
          page={page}
          count={count}
          loading={loading}
          onChange={setPage}
        />
      </section>

      {selectedId !== null && (
        <TenantDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
