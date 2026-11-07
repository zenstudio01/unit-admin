
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowRight,
  Building2, CalendarCheck2, CheckCircle2,
  ClipboardCheck, CreditCard, HardHat,
  House, Layers3, Package, RefreshCw,
  TrendingUp, Users, Wallet, Wrench,
} from "lucide-react";

import StatCard from "../components/StatCard";
import Colors from "../constants/colors";
import { getAdminDashboard } from "../api/adminDashboard";

const ORANGE = Colors.primary || "#FF5722";

const number = (value) =>
  value === null || value === undefined
    ? "—"
    : Number(value).toLocaleString("en-KE");

const currency = (value) =>
  value === null || value === undefined
    ? "Not available"
    : `KES ${Number(value).toLocaleString("en-KE", {
        maximumFractionDigits: 2,
      })}`;

const labelize = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  const style = [
    "active", "approved", "completed", "closed",
  ].includes(value)
    ? "bg-emerald-50 text-emerald-700"
    : [
        "pending", "trial", "open", "planning",
        "in_progress", "pending_approval",
      ].includes(value)
    ? "bg-orange-50 text-orange-700"
    : [
        "expired", "rejected", "cancelled",
        "suspended", "past_due",
      ].includes(value)
    ? "bg-red-50 text-red-700"
    : "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${style}`}>
      {labelize(status)}
    </span>
  );
}

function Section({ title, description, children, action, onAction }) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {action && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 text-sm font-bold"
            style={{ color: ORANGE }}
          >
            {action} <ArrowRight size={16} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function MiniStat({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${ORANGE}12` }}
      >
        <Icon size={20} color={ORANGE} />
      </div>
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-2 break-words text-2xl font-black text-slate-900">
        {value}
      </p>
      {subtitle && (
        <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}

function Empty({ message = "No records found." }) {
  return (
    <div className="px-6 py-12 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function PlanRow({ name, count }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-600">{name}</span>
      <span
        className="rounded-lg px-3 py-1 text-sm font-black"
        style={{
          backgroundColor: `${ORANGE}12`,
          color: ORANGE,
        }}
      >
        {number(count)}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    else setRefreshing(true);

    try {
      const result = await getAdminDashboard();
      setData(result);
      setError("");
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin" size={30} color={ORANGE} />
        <p className="text-sm text-slate-500">Loading UNIT dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500" size={30} />
        <h2 className="mt-4 font-bold text-slate-900">
          Dashboard unavailable
        </h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <button
          onClick={() => loadDashboard(true)}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: ORANGE }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const overview = data.overview || {};
  const subscriptions = data.subscriptions || {};
  const property = data.property_management || {};
  const construction = data.construction || {};
  const procurement = data.procurement || {};
  const workforce = data.workforce || {};
  const quality = data.quality || {};

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: ORANGE }}>
            UNIT Super Admin
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor property management, construction projects,
            subscriptions, financial activity, and platform operations.
          </p>
        </div>

        <button
          onClick={() => loadDashboard(false)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Dashboard
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          {error} Showing the last successfully loaded data.
        </div>
      )}

      {/* Main statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Organizations"
          value={number(overview.organizations)}
          description={`+${number(overview.new_organizations_this_month)} this month`}
          icon={Building2}
        />
        <StatCard
          title="Properties"
          value={number(overview.properties)}
          description={`${number(overview.units)} total units`}
          icon={House}
        />
        <StatCard
          title="Active Users"
          value={number(overview.active_users)}
          description={`${number(overview.users)} registered users`}
          icon={Users}
        />
        <StatCard
          title="Active Subscriptions"
          value={number(subscriptions.active)}
          description={`${number(subscriptions.trials)} active trials`}
          icon={CreditCard}
        />
      </div>

      {/* Financial overview */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[26px] bg-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">
              Subscription Revenue This Month
            </span>
            <TrendingUp size={21} color="#FDBA74" />
          </div>
          <h2 className="mt-5 break-words text-3xl font-black">
            {currency(subscriptions.revenue_this_month)}
          </h2>
          <p className="mt-3 text-xs text-slate-400">
            Completed subscription payments in KES
          </p>
        </div>

        <MiniStat
          title="Total Subscription Revenue"
          value={currency(subscriptions.total_revenue)}
          icon={Wallet}
          subtitle="All-time completed subscription payments"
        />

        <MiniStat
          title="Collected Property Payments"
          value={currency(property.collected_payments_kes)}
          icon={CreditCard}
          subtitle="Completed property payments in KES"
        />
      </div>

      {/* Property management */}
      <div>
        <h2 className="mb-4 text-xl font-black text-slate-900">
          Property Management
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat
            title="Rental Units"
            value={number(property.units)}
            icon={House}
          />
          <MiniStat
            title="Occupied Units"
            value={number(property.occupied_units)}
            icon={Building2}
          />
          <MiniStat
            title="Occupancy Rate"
            value={`${number(property.occupancy_rate)}%`}
            icon={TrendingUp}
          />
          <MiniStat
            title="Open Maintenance"
            value={number(property.open_maintenance)}
            icon={Wrench}
          />
        </div>
      </div>

      {/* Construction */}
      <div>
        <h2 className="mb-4 text-xl font-black text-slate-900">
          Construction Project Management
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat
            title="Total Projects"
            value={number(construction.projects)}
            icon={HardHat}
          />
          <MiniStat
            title="Active Projects"
            value={number(construction.active_projects)}
            icon={Activity}
          />
          <MiniStat
            title="Project Phases"
            value={number(construction.phases)}
            icon={Layers3}
          />
          <MiniStat
            title="Project Tasks"
            value={number(construction.tasks)}
            icon={ClipboardCheck}
          />
          <MiniStat
            title="Milestones"
            value={number(construction.milestones)}
            icon={CalendarCheck2}
          />
          <MiniStat
            title="BOQ Items"
            value={number(construction.boq_items)}
            icon={Package}
          />
          <MiniStat
            title="Project Budgets"
            value={currency(construction.budget_total)}
            icon={Wallet}
          />
          <MiniStat
            title="Project Expenses"
            value={currency(construction.expenses_total)}
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Other project modules */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Procurement"
          description="Purchase orders, suppliers and deliveries"
        >
          <div className="grid grid-cols-2 gap-3 p-5">
            <MiniStat
              title="Purchase Orders"
              value={number(procurement.purchase_orders)}
              icon={Package}
            />
            <MiniStat
              title="Pending Orders"
              value={number(procurement.pending_orders)}
              icon={AlertTriangle}
            />
            <MiniStat
              title="Suppliers"
              value={number(procurement.suppliers)}
              icon={Building2}
            />
            <MiniStat
              title="Deliveries"
              value={number(procurement.deliveries)}
              icon={CheckCircle2}
            />
          </div>
        </Section>

        <Section
          title="Workforce"
          description="Workers, assignments and labor payments"
        >
          <div className="space-y-3 p-5">
            <MiniStat
              title="Registered Workers"
              value={number(workforce.workers)}
              icon={Users}
            />
            <MiniStat
              title="Active Assignments"
              value={number(workforce.active_assignments)}
              icon={HardHat}
            />
            <MiniStat
              title="Recorded Labor Payments"
              value={currency(workforce.payments_total)}
              icon={Wallet}
            />
          </div>
        </Section>

        <Section
          title="Quality Assurance"
          description="Construction inspections and defects"
        >
          <div className="space-y-3 p-5">
            <MiniStat
              title="Inspections"
              value={number(quality.inspections)}
              icon={ClipboardCheck}
            />
            <MiniStat
              title="Open Defects"
              value={number(quality.open_defects)}
              icon={AlertTriangle}
            />
            <MiniStat
              title="Critical Open Defects"
              value={number(quality.critical_defects)}
              icon={AlertTriangle}
            />
          </div>
        </Section>
      </div>

      {/* Organizations and subscriptions */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Recent Organizations"
          description="Latest organizations registered on UNIT"
          action="View all"
          onAction={() => navigate("/organizations")}
        >
          <div className="overflow-x-auto xl:col-span-2">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">Properties</th>
                  <th className="px-5 py-4">Projects</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data.recent_organizations || []).map((org) => (
                  <tr key={org.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{org.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{org.owner}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">{org.properties}</td>
                    <td className="px-5 py-4 text-sm">{org.projects}</td>
                    <td className="px-5 py-4 text-sm">{org.plan}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={org.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.recent_organizations?.length && (
              <Empty message="No organizations registered yet." />
            )}
          </div>
        </Section>

        <Section
          title="Subscription Plans"
          description="Active organizations by subscription package"
          action="Manage"
          onAction={() => navigate("/subscriptions")}
        >
          <div className="space-y-3 p-5">
            {(subscriptions.plan_distribution || []).map((plan) => (
              <PlanRow
                key={plan.name}
                name={plan.name}
                count={plan.count}
              />
            ))}
            {!subscriptions.plan_distribution?.length && (
              <Empty message="No active subscriptions." />
            )}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <MiniStat
                title="Trials"
                value={number(subscriptions.trials)}
                icon={CreditCard}
              />
              <MiniStat
                title="Expired"
                value={number(subscriptions.expired)}
                icon={AlertTriangle}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Recent projects */}
      <Section
        title="Recent Construction Projects"
        description="Latest construction projects registered across UNIT"
      >
        <div className="divide-y divide-slate-100">
          {(data.recent_projects || []).map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: `${ORANGE}12` }}
                >
                  <HardHat size={20} color={ORANGE} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {project.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {project.code} · {project.organization}
                  </p>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
          ))}
          {!data.recent_projects?.length && (
            <Empty message="No construction projects yet." />
          )}
        </div>
      </Section>

      {/* Maintenance */}
      <Section
        title="Recent Maintenance"
        description="Latest property maintenance requests"
        action="View all"
        onAction={() => navigate("/maintenance")}
      >
        <div className="divide-y divide-slate-100">
          {(data.recent_maintenance || []).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: `${ORANGE}12` }}
                >
                  <Wrench size={20} color={ORANGE} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.ticket} · {item.property}
                  </p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
          {!data.recent_maintenance?.length && (
            <Empty message="No maintenance requests yet." />
          )}
        </div>
      </Section>
    </div>
  );
}
