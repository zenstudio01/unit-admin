
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  Eye,
  X,
  ShieldCheck,
  ShieldOff,
  House,
  HardHat,
  Users,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getOrganizations,
  getOrganizationStats,
  getOrganizationDetail,
  updateOrganizationVerification,
} from "../api/adminOrganizations";

const PRIMARY = Colors.primary || "#FF5722";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-KE");

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatLabel = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const colors = {
    active: "bg-emerald-50 text-emerald-700",
    trial: "bg-blue-50 text-blue-700",
    expired: "bg-red-50 text-red-700",
    suspended: "bg-red-50 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
    past_due: "bg-amber-50 text-amber-700",
    none: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        colors[normalized] || "bg-slate-100 text-slate-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function StatBox({ title, value, icon: Icon, color = PRIMARY }) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={21} color={color} />
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
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

function OrganizationDetails({
  organizationId,
  onClose,
  onChanged,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("properties");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getOrganizationDetail(organizationId);
      setDetail(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load organization details."
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const toggleVerification = async () => {
    const org = detail?.organization;
    if (!org || saving) return;

    const nextValue = !org.is_verified;

    const confirmed = window.confirm(
      nextValue
        ? `Verify "${org.name}" as an approved organization?`
        : `Remove verification from "${org.name}"?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      await updateOrganizationVerification(
        organizationId,
        nextValue
      );

      setDetail((prev) => ({
        ...prev,
        organization: {
          ...prev.organization,
          is_verified: nextValue,
        },
      }));

      onChanged();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update verification."
      );
    } finally {
      setSaving(false);
    }
  };

  const org = detail?.organization;

  const tabs = [
    { key: "properties", label: "Properties" },
    { key: "projects", label: "Projects" },
    { key: "members", label: "Members" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close organization details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50"
      />

      <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Organization Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              UNIT platform administration
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
                size={26}
                color={PRIMARY}
                className="animate-spin"
              />
            </div>
          ) : !org ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error || "Organization not found."}
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ backgroundColor: `${PRIMARY}12` }}
                >
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 size={28} color={PRIMARY} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {org.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatLabel(org.organization_type)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={org.subscription?.status} />
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        org.is_verified
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {org.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Properties", org.properties],
                  ["Units", org.units],
                  ["Projects", org.projects],
                  ["Members", org.members],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-3 text-center"
                  >
                    <p className="text-xl font-black text-slate-900">
                      {formatNumber(value)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <section className="rounded-2xl border border-slate-100 p-5">
                <h4 className="font-black text-slate-900">
                  Organization Information
                </h4>

                <div className="mt-3 grid gap-x-4 sm:grid-cols-2">
                  <DetailItem
                    icon={Users}
                    label="Owner"
                    value={org.owner?.name}
                  />
                  <DetailItem
                    icon={Mail}
                    label="Email"
                    value={org.email}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Phone"
                    value={org.phone_number}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Location"
                    value={[
                      org.city,
                      org.county,
                      org.country,
                    ].filter(Boolean).join(", ")}
                  />
                  <DetailItem
                    icon={CalendarDays}
                    label="Registered"
                    value={formatDate(org.created_at)}
                  />
                  <DetailItem
                    icon={CreditCard}
                    label="Subscription Plan"
                    value={org.subscription?.plan}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-black text-slate-900">
                      Organization Verification
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Verification confirms administrative review.
                      It does not suspend or activate login access.
                    </p>
                  </div>

                  <button
                    onClick={toggleVerification}
                    disabled={saving}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white disabled:opacity-50 ${
                      org.is_verified ? "bg-slate-800" : ""
                    }`}
                    style={
                      org.is_verified
                        ? undefined
                        : { backgroundColor: PRIMARY }
                    }
                  >
                    {org.is_verified ? (
                      <ShieldOff size={16} />
                    ) : (
                      <ShieldCheck size={16} />
                    )}
                    {saving
                      ? "Saving..."
                      : org.is_verified
                      ? "Remove Verification"
                      : "Verify Organization"}
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="flex overflow-x-auto border-b border-slate-100">
                  {tabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`whitespace-nowrap px-5 py-4 text-sm font-bold ${
                        tab === item.key
                          ? "border-b-2 text-orange-600"
                          : "text-slate-400"
                      }`}
                      style={
                        tab === item.key
                          ? { borderColor: PRIMARY, color: PRIMARY }
                          : {}
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="divide-y divide-slate-100">
                  {tab === "properties" &&
                    detail.properties.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4"
                      >
                        <House size={19} color={PRIMARY} />
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.property_code} · {item.city} ·{" "}
                            {item.units} units
                          </p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))}

                  {tab === "projects" &&
                    detail.projects.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4"
                      >
                        <HardHat size={19} color={PRIMARY} />
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.project_code}
                          </p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    ))}

                  {tab === "members" &&
                    detail.members.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4"
                      >
                        <Users size={19} color={PRIMARY} />
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.email} ·{" "}
                            {item.roles?.join(", ") ||
                              item.role ||
                              "No role"}
                          </p>
                        </div>
                        <StatusBadge
                          status={item.is_active ? "active" : "inactive"}
                        />
                      </div>
                    ))}

                  {!detail[tab]?.length && (
                    <div className="p-10 text-center text-sm text-slate-400">
                      No {tab} found.
                    </div>
                  )}
                </div>
                <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
                  Showing up to 20 recent records per category.
                </p>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [list, summary] = await Promise.all([
          getOrganizations({
            page,
            page_size: pageSize,
            ...(search && { search }),
            ...(verified && { verified }),
            ...(planStatus && { plan_status: planStatus }),
          }),
          getOrganizationStats(),
        ]);

        if (!cancelled) {
          setOrganizations(list.results || []);
          setCount(list.count || 0);
          setStats(summary);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.response?.data?.detail ||
            "Unable to load organizations."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page, search, verified, planStatus, reloadKey]);

  const refresh = () => setReloadKey((value) => value + 1);

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Organizations
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage organizations, review verification,
            subscriptions, properties and construction projects.
          </p>
        </div>

        <button
          onClick={refresh}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBox
          title="Total Organizations"
          value={stats?.total}
          icon={Building2}
        />
        <StatBox
          title="Verified Organizations"
          value={stats?.verified}
          icon={CheckCircle2}
          color="#059669"
        />
        <StatBox
          title="Unverified Organizations"
          value={stats?.unverified}
          icon={Clock3}
          color="#D97706"
        />
        <StatBox
          title="Active Subscriptions"
          value={stats?.active_subscriptions}
          icon={CreditCard}
        />
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Registered Organizations
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {formatNumber(count)} matching organizations
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
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search organizations..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 sm:w-60"
              />
            </div>

            <select
              value={verified}
              onChange={(event) => {
                setVerified(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={planStatus}
              onChange={(event) => {
                setPlanStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Subscriptions</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="past_due">Past Due</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
              <option value="none">No Plan</option>
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
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Properties</th>
                <th className="px-5 py-4">Projects</th>
                <th className="px-5 py-4">Subscription</th>
                <th className="px-5 py-4">Verification</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                organizations.map((org) => (
                  <tr
                    key={org.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                          style={{ backgroundColor: `${PRIMARY}12` }}
                        >
                          {org.logo ? (
                            <img
                              src={org.logo}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 size={20} color={PRIMARY} />
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {org.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatLabel(org.organization_type)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {org.owner?.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {org.owner?.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      {formatNumber(org.properties)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold">
                      {formatNumber(org.projects)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="mb-1.5 text-xs font-bold text-slate-600">
                        {org.subscription?.plan}
                      </p>
                      <StatusBadge status={org.subscription?.status} />
                    </td>

                    <td className="px-5 py-4">
                      {org.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={15} />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-600">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(org.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedId(org.id)}
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

          {!loading && !error && organizations.length === 0 && (
            <div className="p-12 text-center">
              <Building2
                size={32}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No organizations found.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} · {formatNumber(count)} records
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {selectedId !== null && (
        <OrganizationDetails
          organizationId={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
