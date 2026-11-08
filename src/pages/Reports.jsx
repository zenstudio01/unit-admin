
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, Building2, Users, Home, Wallet,
  CreditCard, Wrench, HardHat, RefreshCw,
  Download, CalendarDays, Filter, CheckCircle2,
  AlertTriangle, TrendingUp, FileText,
} from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Colors from "../constants/colors";
import {
  getAdminReportsOverview,
  getAdminReportsRevenue,
  getAdminReportsOccupancy,
  getAdminReportsMaintenance,
  getAdminReportsConstruction,
  getAdminReportsSubscriptions,
} from "../api/adminReports";

const PRIMARY = Colors.primary || "#FF5722";

const CHART_COLORS = [
  PRIMARY, "#2563EB", "#059669",
  "#7C3AED", "#D97706", "#DC2626",
  "#0891B2", "#64748B",
];

const today = new Date().toLocaleDateString("en-CA");

const oneYearAgo = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toLocaleDateString("en-CA");
})();

const fmt = (value) =>
  Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2,
  });

const money = (value, currency = "KES") =>
  `${currency} ${fmt(value)}`;

const label = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const errorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.detail ||
  "Unable to load report data.";

function StatCard({
  title, value, icon: Icon, color = PRIMARY, note,
}) {
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
      <p className="mt-2 break-words text-2xl font-black text-slate-900">
        {value}
      </p>
      {note && (
        <p className="mt-2 text-xs text-slate-400">{note}</p>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-black text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function BreakdownChart({ data = [], nameKey, valueKey = "count" }) {
  const chartData = data.filter(
    (item) => Number(item[valueKey]) > 0
  );

  if (!chartData.length) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">
        No data available.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [fmt(value), label(name)]}
          />
          <Legend
            formatter={(value) => label(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function CurrencySummary({ title, rows = [], icon: Icon }) {
  return (
    <Section title={title}>
      <div className="space-y-4">
        {rows.map((item) => (
          <div
            key={item.currency}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: `${PRIMARY}12` }}
              >
                <Icon size={20} color={PRIMARY} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {item.currency}
                </p>
                <p className="text-xs text-slate-400">
                  {fmt(item.count)} transactions
                </p>
              </div>
            </div>
            <p className="text-lg font-black text-slate-900">
              {money(item.amount, item.currency)}
            </p>
          </div>
        ))}
        {!rows.length && (
          <p className="py-8 text-center text-sm text-slate-400">
            No completed payments in this period.
          </p>
        )}
      </div>
    </Section>
  );
}

function downloadCSV(filename, rows) {
  if (!rows.length) return;

  const keys = [...new Set(rows.flatMap(Object.keys))];

  const escapeCSV = (value) => {
    const text = String(value ?? "");
    // Prevent spreadsheet formula execution when opened in Excel.
    const safe = /^[\s]*[=+\-@\t\r]/.test(text)
      ? `'${text}`
      : text;

    return `"${safe.replaceAll('"', '""')}"`;
  };

  const csv = [
    keys.map(escapeCSV).join(","),
    ...rows.map((row) =>
      keys.map((key) => escapeCSV(row[key])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [filters, setFilters] = useState({
    start_date: oneYearAgo,
    end_date: today,
    organization_id: "",
  });

  const [applied, setApplied] = useState({
    start_date: oneYearAgo,
    end_date: today,
    organization_id: "",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [currency, setCurrency] = useState("KES");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          start_date: applied.start_date,
          end_date: applied.end_date,
          ...(applied.organization_id
            ? { organization_id: applied.organization_id }
            : {}),
        };

        const [
          overview, revenue, occupancy,
          maintenance, construction, subscriptions,
        ] = await Promise.all([
          getAdminReportsOverview(params),
          getAdminReportsRevenue(params),
          getAdminReportsOccupancy(params),
          getAdminReportsMaintenance(params),
          getAdminReportsConstruction(params),
          getAdminReportsSubscriptions(params),
        ]);

        if (active) {
          setData({
            overview,
            revenue,
            occupancy,
            maintenance,
            construction,
            subscriptions,
          });
        }
      } catch (err) {
        if (active) {
          setData(null);
          setError(errorMessage(err));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => { active = false; };
  }, [applied, reload]);

  const currencyOptions = useMemo(() => {
    if (!data) return ["KES"];

    const values = new Set(["KES"]);

    [
      ...(data.revenue.property_totals || []),
      ...(data.revenue.saas_totals || []),
    ].forEach((item) => {
      if (item.currency) values.add(item.currency);
    });

    return [...values];
  }, [data]);

  const monthlyData = useMemo(() => {
    if (!data) return [];

    const map = new Map(
      (data.revenue.months || []).map((month) => [
        month,
        {
          month,
          property: 0,
          saas: 0,
        },
      ])
    );

    for (const item of data.revenue.property_payments || []) {
      if (item.currency === currency && map.has(item.month)) {
        map.get(item.month).property += Number(item.amount);
      }
    }

    for (const item of data.revenue.subscription_payments || []) {
      if (item.currency === currency && map.has(item.month)) {
        map.get(item.month).saas += Number(item.amount);
      }
    }

    return [...map.values()];
  }, [data, currency]);

  const applyFilters = (event) => {
    event.preventDefault();

    if (filters.start_date > filters.end_date) {
      setError("Start date cannot be after end date.");
      return;
    }

    setApplied({ ...filters });
  };

  const exportReport = () => {
    if (!data) return;

    const { overview, revenue, occupancy,
      maintenance, construction, subscriptions } = data;

    const rows = [
      { section: "Overview", metric: "Organizations", value: overview.organizations },
      { section: "Overview", metric: "Users", value: overview.users },
      { section: "Overview", metric: "Properties", value: overview.properties },
      { section: "Overview", metric: "Units", value: overview.units },
      { section: "Overview", metric: "Tenants", value: overview.tenants },
      { section: "Overview", metric: "Active Leases", value: overview.active_leases },
      { section: "Occupancy", metric: "Occupied Units", value: occupancy.occupied_units },
      { section: "Occupancy", metric: "Occupancy Rate (%)", value: occupancy.occupancy_rate },
      { section: "Maintenance", metric: "Tickets", value: maintenance.total },
      { section: "Maintenance", metric: "Completed", value: maintenance.completed },
      { section: "Maintenance", metric: "Estimated Costs", value: maintenance.estimated_cost },
      { section: "Maintenance", metric: "Actual Costs", value: maintenance.actual_cost },
      { section: "Construction", metric: "Projects", value: construction.total },
      { section: "Construction", metric: "Completed Projects", value: construction.completed },
      { section: "Construction", metric: "Approved Budget", value: construction.approved_budget },
      { section: "Subscriptions", metric: "Active", value: subscriptions.active },
      { section: "Subscriptions", metric: "Trials", value: subscriptions.trial },
      ...revenue.property_totals.map((item) => ({
        section: "Property Collections",
        metric: `Completed Amount (${item.currency})`,
        value: item.amount,
      })),
      ...revenue.saas_totals.map((item) => ({
        section: "SaaS Revenue",
        metric: `Completed Amount (${item.currency})`,
        value: item.amount,
      })),
    ];

    downloadCSV(
      `unit-report-${applied.start_date}-to-${applied.end_date}.csv`,
      rows
    );
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Platform performance, financial activity, property
            occupancy and operational insights.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReload((v) => v + 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
          <button
            onClick={exportReport}
            disabled={!data || loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: PRIMARY }}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
      >
        <label className="min-w-[160px] flex-1">
          <span className="mb-2 block text-xs font-bold text-slate-500">
            Start Date
          </span>
          <input
            type="date"
            required
            value={filters.start_date}
            onChange={(e) =>
              updateFilter("start_date", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </label>

        <label className="min-w-[160px] flex-1">
          <span className="mb-2 block text-xs font-bold text-slate-500">
            End Date
          </span>
          <input
            type="date"
            required
            value={filters.end_date}
            onChange={(e) =>
              updateFilter("end_date", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </label>

        <label className="min-w-[170px] flex-1">
          <span className="mb-2 block text-xs font-bold text-slate-500">
            Organization ID
          </span>
          <input
            type="number"
            min="1"
            placeholder="All organizations"
            value={filters.organization_id}
            onChange={(e) =>
              updateFilter("organization_id", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          <Filter size={17} />
          Apply Filters
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-12 text-sm text-slate-500">
          <RefreshCw className="animate-spin" color={PRIMARY} />
          Loading reports...
        </div>
      )}

      {!loading && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Organizations" value={fmt(data.overview.organizations)} icon={Building2} />
            <StatCard title="Platform Users" value={fmt(data.overview.users)} icon={Users} color="#2563EB" />
            <StatCard title="Properties" value={fmt(data.overview.properties)} icon={Home} color="#059669" />
            <StatCard title="Tenants" value={fmt(data.overview.tenants)} icon={Users} color="#7C3AED" />
            <StatCard title="Total Units" value={fmt(data.overview.units)} icon={Building2} />
            <StatCard title="Active Leases" value={fmt(data.overview.active_leases)} icon={FileText} color="#059669" />
            <StatCard title="Maintenance Tickets" value={fmt(data.overview.maintenance_tickets)} icon={Wrench} color="#D97706" />
            <StatCard title="Construction Projects" value={fmt(data.overview.construction_projects)} icon={HardHat} color="#2563EB" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CurrencySummary
              title="Completed Property Collections"
              rows={data.revenue.property_totals}
              icon={Wallet}
            />
            <CurrencySummary
              title="UNIT SaaS Payments"
              rows={data.revenue.saas_totals}
              icon={CreditCard}
            />
          </div>

          <Section
            title="Monthly Financial Activity"
            subtitle="Property collections and SaaS payments are separate financial streams."
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">
                Currency-specific payment totals
              </p>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {currencyOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
                  <Tooltip formatter={(value) => money(value, currency)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="property"
                    name="Property Collections"
                    stroke={PRIMARY}
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="saas"
                    name="SaaS Payments"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Property Occupancy" subtitle="Current unit status snapshot">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-4xl font-black" style={{ color: PRIMARY }}>
                    {data.occupancy.occupancy_rate}%
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Overall occupancy rate
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {fmt(data.occupancy.occupied_units)} / {fmt(data.occupancy.total_units)}
                </p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, data.occupancy.occupancy_rate)}%`,
                    backgroundColor: PRIMARY,
                  }}
                />
              </div>
              <BreakdownChart
                data={data.occupancy.unit_status_breakdown}
                nameKey="status"
              />
            </Section>

            <Section title="Top Properties by Unit Count">
              <div className="space-y-4">
                {data.occupancy.top_properties.map((item) => (
                  <div key={item.property_id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-bold text-slate-700">
                        {item.property__name}
                      </p>
                      <span className="text-xs font-bold text-slate-500">
                        {item.occupancy_rate}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, item.occupancy_rate)}%`,
                          backgroundColor: PRIMARY,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {fmt(item.occupied_units)} occupied of {fmt(item.total_units)}
                    </p>
                  </div>
                ))}
                {!data.occupancy.top_properties.length && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No properties with units found.
                  </p>
                )}
              </div>
            </Section>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Completed Maintenance"
              value={fmt(data.maintenance.completed)}
              icon={CheckCircle2}
              color="#059669"
              note={`${data.maintenance.completion_rate}% completion rate`}
            />
            <StatCard
              title="Unassigned Maintenance"
              value={fmt(data.maintenance.unassigned)}
              icon={AlertTriangle}
              color="#DC2626"
            />
            <StatCard
              title="Recorded Maintenance Costs"
              value={money(data.maintenance.actual_cost)}
              icon={Wallet}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Maintenance by Status">
              <BreakdownChart
                data={data.maintenance.status_breakdown}
                nameKey="status"
              />
            </Section>
            <Section title="Maintenance by Priority">
              <BreakdownChart
                data={data.maintenance.priority_breakdown}
                nameKey="priority"
              />
            </Section>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Construction Projects"
              value={fmt(data.construction.total)}
              icon={HardHat}
            />
            <StatCard
              title="Completed Projects"
              value={fmt(data.construction.completed)}
              icon={CheckCircle2}
              color="#059669"
              note={`${data.construction.completion_rate}% completion rate`}
            />
            <StatCard
              title="Approved Construction Budgets"
              value={money(data.construction.approved_budget)}
              icon={Wallet}
              color="#7C3AED"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Construction by Status">
              <BreakdownChart
                data={data.construction.status_breakdown}
                nameKey="status"
              />
            </Section>
            <Section title="Construction by Project Type">
              <BreakdownChart
                data={data.construction.type_breakdown}
                nameKey="project_type"
              />
            </Section>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Active Subscriptions"
              value={fmt(data.subscriptions.active)}
              icon={CreditCard}
              color="#059669"
            />
            <StatCard
              title="Trial Subscriptions"
              value={fmt(data.subscriptions.trial)}
              icon={CalendarDays}
              color="#2563EB"
            />
            <StatCard
              title="Expired Subscriptions"
              value={fmt(data.subscriptions.expired)}
              icon={AlertTriangle}
              color="#DC2626"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Subscription Status Distribution">
              <BreakdownChart
                data={data.subscriptions.status_breakdown}
                nameKey="status"
              />
            </Section>

            <Section title="Subscription Packages">
              <div className="space-y-4">
                {data.subscriptions.package_breakdown.map((item) => (
                  <div
                    key={item.package_id ?? "none"}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <p className="text-sm font-bold text-slate-700">
                      {item.package__name || "Unassigned"}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700">
                      {fmt(item.count)}
                    </span>
                  </div>
                ))}
                {!data.subscriptions.package_breakdown.length && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No subscription data found.
                  </p>
                )}
              </div>
            </Section>
          </div>
        </>
      )}
    </div>
  );
}
