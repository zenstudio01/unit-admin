
import { useCallback, useEffect, useState } from "react";
import {
  CreditCard, Wallet, Building2, CheckCircle2,
  Clock3, AlertTriangle, Search, RefreshCw,
  Plus, Pencil, Eye, X, ChevronLeft,
  ChevronRight, Package, Receipt, CalendarDays,
  ArrowUpRight,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminSubscriptions,
  getAdminSubscriptionStats,
  getAdminSubscriptionDetail,
  getAdminSubscriptionPackages,
  createAdminSubscriptionPackage,
  updateAdminSubscriptionPackage,
  getAdminSubscriptionPayments,
} from "../api/adminSubscriptions";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const number = (v) =>
  Number(v || 0).toLocaleString("en-KE");

const money = (v, currency = "KES") =>
  v == null
    ? "—"
    : `${currency} ${Number(v).toLocaleString("en-KE", {
        maximumFractionDigits: 2,
      })}`;

const date = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const label = (v) =>
  String(v || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getError = (err) => {
  const data = err.response?.data;

  if (data?.errors) {
    return Object.entries(data.errors)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" | ");
  }

  return (
    data?.message ||
    data?.detail ||
    "Something went wrong. Please try again."
  );
};

const statusColors = {
  active: "bg-emerald-50 text-emerald-700",
  trial: "bg-blue-50 text-blue-700",
  past_due: "bg-amber-50 text-amber-700",
  expired: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  suspended: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-purple-50 text-purple-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        statusColors[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {label(status)}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color = PRIMARY }) {
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
    </div>
  );
}

function Empty({ children }) {
  return (
    <div className="p-12 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}

function Pagination({ page, count, onChange, loading }) {
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
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          disabled={loading || page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function SubscriptionDrawer({ id, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAdminSubscriptionDetail(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(getError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const sub = data?.subscription;

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
        aria-label="Subscription details"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Subscription Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Organization billing overview
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2.5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {loading && (
            <RefreshCw
              className="mx-auto animate-spin"
              color={PRIMARY}
            />
          )}
          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {sub && (
            <>
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-xl font-black text-slate-900">
                  {sub.organization?.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {sub.organization?.email || "No email"}
                </p>
                <div className="mt-3">
                  <StatusBadge status={sub.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Package", sub.package?.name || "—"],
                  ["Billing Cycle", label(sub.billing_cycle)],
                  ["Monthly Price", money(sub.package?.monthly_price)],
                  ["Yearly Price", money(sub.package?.yearly_price)],
                  ["Trial Ends", date(sub.trial_end)],
                  ["Period Starts", date(sub.current_period_start)],
                  ["Period Ends", date(sub.current_period_end)],
                  ["Created", date(sub.created_at)],
                ].map(([title, value]) => (
                  <div key={title} className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400">{title}</p>
                    <p className="mt-2 break-words text-sm font-bold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="mb-4 font-black text-slate-900">
                  Recent Payments
                </h3>
                <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                  {(data.payments || []).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {money(payment.amount, payment.currency)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {payment.reference || `Payment #${payment.id}`} ·{" "}
                          {date(payment.paid_at || payment.created_at)}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>
                  ))}
                  {!data.payments?.length && (
                    <Empty>No payment records found.</Empty>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

const EMPTY_PACKAGE = {
  code: "",
  name: "",
  description: "",
  monthly_price: "0",
  yearly_price: "0",
};

function PackageModal({ packageData, onClose, onSaved }) {
  const editing = Boolean(packageData);
  const [form, setForm] = useState(
    editing
      ? {
          code: packageData.code || "",
          name: packageData.name || "",
          description: packageData.description || "",
          monthly_price: String(packageData.monthly_price ?? "0"),
          yearly_price: String(packageData.yearly_price ?? "0"),
        }
      : { ...EMPTY_PACKAGE }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      monthly_price: form.monthly_price,
      yearly_price: form.yearly_price,
    };

    try {
      if (editing) {
        await updateAdminSubscriptionPackage(
          packageData.id,
          payload
        );
      } else {
        await createAdminSubscriptionPackage(payload);
      }
      onSaved();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-slate-900/60"
        onClick={onClose}
        aria-label="Close package editor"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit package" : "Create package"}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {editing ? "Edit Package" : "Create Package"}
          </h2>
          <button onClick={onClose} className="rounded-lg bg-slate-100 p-2">
            <X size={19} />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Configure the package's identity and pricing.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {[
            ["name", "Package Name", "text"],
            ["code", "Package Code", "text"],
            ["monthly_price", "Monthly Price (KES)", "number"],
            ["yearly_price", "Yearly Price (KES)", "number"],
          ].map(([key, title, type]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                {title}
              </span>
              <input
                required
                type={type}
                min={type === "number" ? 0 : undefined}
                step={type === "number" ? "0.01" : undefined}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Description
            </span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              type="submit"
              className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: PRIMARY }}
            >
              {saving
                ? "Saving..."
                : editing ? "Save Changes" : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const [tab, setTab] = useState("subscriptions");
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [packageModal, setPackageModal] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAdminSubscriptionStats(),
      getAdminSubscriptionPackages(),
    ])
      .then(([summary, list]) => {
        if (!cancelled) {
          setStats(summary);
          setPackages(list.results || []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getError(err));
      });

    return () => { cancelled = true; };
  }, [reload]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (tab === "packages") {
          setRows([]);
          setCount(0);
          return;
        }

        const params = {
          page,
          page_size: PAGE_SIZE,
          ...(search && { search }),
          ...(status && { status }),
          ...(tab === "subscriptions" && packageFilter
            ? { package_id: packageFilter }
            : {}),
        };

        const data = tab === "subscriptions"
          ? await getAdminSubscriptions(params)
          : await getAdminSubscriptionPayments(params);

        if (!cancelled) {
          setRows(data.results || []);
          setCount(data.count || 0);
        }
      } catch (err) {
        if (!cancelled) setError(getError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [tab, page, search, status, packageFilter, reload]);

  const switchTab = (next) => {
    setTab(next);
    setPage(1);
    setStatus("");
    setSearchInput("");
    setSearch("");
    setPackageFilter("");
    setError("");
  };

  const refresh = () => setReload((v) => v + 1);

  const tabs = [
    ["subscriptions", "Organization Subscriptions", CreditCard],
    ["packages", "Subscription Packages", Package],
    ["payments", "Payment History", Receipt],
  ];

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Subscriptions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage SaaS packages and monitor organization billing,
            renewals and subscription payments.
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Subscriptions"
          value={number(stats?.total_subscriptions)}
          icon={Building2}
        />
        <StatCard
          title="Active Subscriptions"
          value={number(stats?.active_subscriptions)}
          icon={CheckCircle2}
          color="#059669"
        />
        <StatCard
          title="Free Trials"
          value={number(stats?.trial_subscriptions)}
          icon={Clock3}
          color="#2563EB"
        />
        <StatCard
          title="Completed Payment Revenue"
          value={money(stats?.total_revenue, stats?.currency)}
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Expiring Within 30 Days"
          value={number(stats?.expiring_within_30_days)}
          icon={CalendarDays}
          color="#D97706"
        />
        <StatCard
          title="Past Due"
          value={number(stats?.past_due_subscriptions)}
          icon={AlertTriangle}
          color="#DC2626"
        />
        <StatCard
          title="Subscription Packages"
          value={number(stats?.total_packages)}
          icon={Package}
          color="#7C3AED"
        />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-slate-100 p-3">
          {tabs.map(([key, title, Icon]) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                tab === key
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              style={tab === key ? { backgroundColor: PRIMARY } : {}}
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {tab === "packages" ? (
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Subscription Packages
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Define the plans organizations can purchase.
                </p>
              </div>
              <button
                onClick={() => setPackageModal({ mode: "create" })}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={17} />
                New Package
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="rounded-xl p-3"
                      style={{ backgroundColor: `${PRIMARY}12` }}
                    >
                      <Package color={PRIMARY} size={22} />
                    </div>
                    {pkg.is_active != null && (
                      <StatusBadge
                        status={pkg.is_active ? "active" : "suspended"}
                      />
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-black text-slate-900">
                    {pkg.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase text-slate-400">
                    {pkg.code}
                  </p>
                  <p className="mt-3 min-h-10 text-sm text-slate-500">
                    {pkg.description || "No description provided."}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex justify-between gap-3">
                      <span className="text-sm text-slate-500">Monthly</span>
                      <span className="font-black text-slate-900">
                        {money(pkg.monthly_price)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-sm text-slate-500">Yearly</span>
                      <span className="font-black text-slate-900">
                        {money(pkg.yearly_price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPackageModal({
                      mode: "edit",
                      data: pkg,
                    })}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    Edit Package
                  </button>
                </div>
              ))}
            </div>

            {!packages.length && (
              <Empty>No subscription packages found.</Empty>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {tab === "subscriptions"
                    ? "Organization Subscriptions"
                    : "Subscription Payments"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {number(count)} matching records
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none sm:w-56"
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
                  {(tab === "subscriptions"
                    ? [
                        "trial", "active", "past_due",
                        "expired", "cancelled", "suspended",
                      ]
                    : ["pending", "completed", "failed", "refunded"]
                  ).map((s) => (
                    <option key={s} value={s}>{label(s)}</option>
                  ))}
                </select>

                {tab === "subscriptions" && (
                  <select
                    value={packageFilter}
                    onChange={(e) => {
                      setPackageFilter(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  >
                    <option value="">All Packages</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50/80">
                  {tab === "subscriptions" ? (
                    <tr className="text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-4">Organization</th>
                      <th className="px-5 py-4">Package</th>
                      <th className="px-5 py-4">Billing</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Period Ends</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  ) : (
                    <tr className="text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-4">Organization</th>
                      <th className="px-5 py-4">Reference</th>
                      <th className="px-5 py-4">Package</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {!loading && rows.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/60"
                    >
                      {tab === "subscriptions" ? (
                        <>
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">
                              {item.organization?.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.organization?.email}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {item.package?.name || "—"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.package?.code}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {label(item.billing_cycle)}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {date(item.current_period_end)}
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
                            {item.organization?.name || "—"}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600">
                            {item.reference || `#${item.id}`}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {item.package?.name || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm font-black text-slate-800">
                            {money(item.amount, item.currency)}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {date(item.paid_at || item.created_at)}
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
                    size={26}
                    color={PRIMARY}
                    className="animate-spin"
                  />
                </div>
              )}

              {!loading && !error && rows.length === 0 && (
                <Empty>No matching records found.</Empty>
              )}
            </div>

            <Pagination
              page={page}
              count={count}
              onChange={setPage}
              loading={loading}
            />
          </>
        )}
      </section>

      {selectedId != null && (
        <SubscriptionDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {packageModal && (
        <PackageModal
          packageData={
            packageModal.mode === "edit"
              ? packageModal.data
              : null
          }
          onClose={() => setPackageModal(null)}
          onSaved={() => {
            setPackageModal(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
