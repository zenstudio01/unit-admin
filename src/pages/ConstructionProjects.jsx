
import { useCallback, useEffect, useState } from "react";
import {
  HardHat,
  Building2,
  Wallet,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CalendarDays,
  UserRound,
  Layers3,
  ListTodo,
  Flag,
  ClipboardCheck,
  Users,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminConstructionProjects,
  getAdminConstructionProjectStats,
  getAdminConstructionProjectDetail,
} from "../api/adminConstructionProjects";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const formatNumber = (value) =>
  value == null ? "—" : Number(value).toLocaleString("en-KE");

const formatMoney = (value) =>
  value == null
    ? "—"
    : `KES ${Number(value).toLocaleString("en-KE", {
        maximumFractionDigits: 0,
      })}`;

const formatDate = (value) =>
  value
    ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(
        "en-KE",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

const formatLabel = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const statusStyles = {
  planning: "bg-slate-100 text-slate-700",
  pending_approval: "bg-amber-50 text-amber-700",
  approved: "bg-indigo-50 text-indigo-700",
  in_progress: "bg-blue-50 text-blue-700",
  on_hold: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  not_started: "bg-slate-100 text-slate-600",
  todo: "bg-slate-100 text-slate-600",
  blocked: "bg-red-50 text-red-700",
  overdue: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {formatLabel(status)}
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
        <p className="mt-2 text-xs text-slate-400">{note}</p>
      )}
    </div>
  );
}

function ProgressBar({ value = 0 }) {
  const progress = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div className="min-w-[110px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">
          {progress.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: PRIMARY,
          }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-900">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <p className="p-10 text-center text-sm text-slate-400">
      {message}
    </p>
  );
}

function ProjectDetails({ projectId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("phases");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminConstructionProjectDetail(projectId);
      setDetail(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load project details."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const project = detail?.project;

  const tabs = [
    ["phases", "Phases"],
    ["milestones", "Milestones"],
    ["tasks", "Tasks"],
    ["boq_items", "BOQ"],
    ["progress_updates", "Progress"],
    ["modules", "Other Modules"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Construction project details"
        className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Construction Project
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              UNIT platform project oversight
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
          ) : !project ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error || "Project not found."}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${PRIMARY}12` }}
                >
                  <HardHat size={28} color={PRIMARY} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.project_code} ·{" "}
                    {formatLabel(project.project_type)}
                  </p>
                  <div className="mt-3">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Phases" value={project.phases} />
                <Metric label="Milestones" value={project.milestones} />
                <Metric label="Tasks" value={project.tasks} />
                <Metric label="BOQ Items" value={project.boq_items} />
              </div>

              <section className="rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900">
                    Project Progress
                  </h4>
                  <span className="text-sm font-black" style={{ color: PRIMARY }}>
                    {Number(project.progress || 0).toFixed(1)}%
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar value={project.progress} />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Progress is based on the latest report, or an
                  unweighted average of phase progress.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-100 p-5">
                <h4 className="font-black text-slate-900">
                  Project Information
                </h4>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {[
                    ["Organization", project.organization?.name],
                    ["Property", project.property?.name || "Not linked"],
                    ["Project Manager", project.project_manager?.name || "Unassigned"],
                    ["Approved Budget", formatMoney(project.approved_budget)],
                    ["Start Date", formatDate(project.start_date)],
                    ["Expected End Date", formatDate(project.expected_end_date)],
                    ["Actual End Date", formatDate(project.actual_end_date)],
                    ["Registered", formatDate(project.created_at)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {project.description && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {project.description}
                    </p>
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="flex overflow-x-auto border-b border-slate-100">
                  {tabs.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`whitespace-nowrap px-5 py-4 text-sm font-bold ${
                        tab === key
                          ? "border-b-2"
                          : "text-slate-400"
                      }`}
                      style={
                        tab === key
                          ? { color: PRIMARY, borderColor: PRIMARY }
                          : {}
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {tab === "phases" && (
                  <div className="divide-y divide-slate-100">
                    {detail.phases.map((phase) => (
                      <div key={phase.id} className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800">
                              {phase.sequence}. {phase.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(phase.start_date)} —{" "}
                              {formatDate(phase.end_date)}
                            </p>
                          </div>
                          <StatusBadge status={phase.status} />
                        </div>

                        <div className="mt-4">
                          <ProgressBar value={phase.completion_percentage} />
                        </div>
                      </div>
                    ))}

                    {!detail.phases.length && (
                      <EmptyState message="No phases found." />
                    )}
                  </div>
                )}

                {tab === "milestones" && (
                  <div className="divide-y divide-slate-100">
                    {detail.milestones.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-5"
                      >
                        <Flag size={19} color={PRIMARY} />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Due: {formatDate(item.due_date)}
                          </p>
                        </div>

                        <StatusBadge status={item.status} />
                      </div>
                    ))}

                    {!detail.milestones.length && (
                      <EmptyState message="No milestones found." />
                    )}
                  </div>
                )}

                {tab === "tasks" && (
                  <div className="divide-y divide-slate-100">
                    {detail.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-5"
                      >
                        <ListTodo size={19} color={PRIMARY} />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800">
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {task.assigned_to || "Unassigned"} ·{" "}
                            Due {formatDate(task.due_date)} ·{" "}
                            {formatLabel(task.priority)}
                          </p>
                        </div>

                        <StatusBadge status={task.status} />
                      </div>
                    ))}

                    {!detail.tasks.length && (
                      <EmptyState message="No tasks found." />
                    )}
                  </div>
                )}

                {tab === "boq_items" && (
                  <div className="divide-y divide-slate-100">
                    {detail.boq_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center gap-3 p-5"
                      >
                        <ClipboardCheck size={19} color={PRIMARY} />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800">
                            {item.item_code}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.description}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.quantity} {item.unit} ·{" "}
                            {formatMoney(item.estimated_amount)}
                          </p>
                        </div>

                        <StatusBadge status={item.status} />
                      </div>
                    ))}

                    {!detail.boq_items.length && (
                      <EmptyState message="No BOQ items found." />
                    )}
                  </div>
                )}

                {tab === "progress_updates" && (
                  <div className="divide-y divide-slate-100">
                    {detail.progress_updates.map((item) => (
                      <div key={item.id} className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-slate-800">
                            {Number(item.completion_percentage).toFixed(1)}%
                            complete
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(item.reported_at)}
                          </p>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.summary}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Reported by {item.reported_by}
                        </p>
                      </div>
                    ))}

                    {!detail.progress_updates.length && (
                      <EmptyState message="No progress reports found." />
                    )}
                  </div>
                )}

                {tab === "modules" && (
                  <div className="space-y-5 p-5">
                    <div>
                      <h5 className="mb-3 font-bold text-slate-800">
                        Budget & Expenses
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <Metric
                          label="Expense Records"
                          value={detail.modules?.expenses?.count}
                        />
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">
                            Recorded Expenses
                          </p>
                          <p className="mt-2 text-lg font-black text-slate-900">
                            {formatMoney(detail.modules?.expenses?.total)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-3 font-bold text-slate-800">
                        Workforce
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <Metric
                          label="Workers"
                          value={detail.modules?.workforce?.workers}
                        />
                        <Metric
                          label="Assignments"
                          value={detail.modules?.workforce?.assignments}
                        />
                        <Metric
                          label="Attendance"
                          value={detail.modules?.workforce?.attendance}
                        />
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-3 font-bold text-slate-800">
                        Procurement
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <Metric
                          label="Purchase Orders"
                          value={detail.modules?.procurement?.purchase_orders}
                        />
                        <Metric
                          label="Deliveries"
                          value={detail.modules?.procurement?.deliveries}
                        />
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-3 font-bold text-slate-800">
                        Quality Management
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <Metric
                          label="Inspections"
                          value={detail.modules?.quality?.inspections}
                        />
                        <Metric
                          label="Defects"
                          value={detail.modules?.quality?.defects}
                        />
                      </div>
                    </div>

                    <p className="text-xs leading-5 text-slate-400">
                      A dash means the metric is unavailable from
                      the current model structure, not necessarily zero.
                      Expense figures assume KES.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function ConstructionProjects() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

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
        const [list, summary] = await Promise.all([
          getAdminConstructionProjects({
            page,
            page_size: PAGE_SIZE,
            ...(search && { search }),
            ...(status && { status }),
            ...(type && { type }),
          }),
          getAdminConstructionProjectStats(),
        ]);

        if (cancelled) return;

        setProjects(list.results || []);
        setCount(list.count || 0);
        setStats(summary);
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to load construction projects."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page, search, status, type, reloadKey]);

  const refresh = () => setReloadKey((value) => value + 1);

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Construction Projects
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor project delivery, budgets, progress and
            construction operations across all organizations.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={formatNumber(stats?.total_projects)}
          icon={HardHat}
        />
        <StatCard
          title="In Progress"
          value={formatNumber(stats?.in_progress_projects)}
          icon={TrendingUp}
          color="#2563EB"
        />
        <StatCard
          title="Completed Projects"
          value={formatNumber(stats?.completed_projects)}
          icon={CheckCircle2}
          color="#059669"
        />
        <StatCard
          title="Approved Project Budgets"
          value={formatMoney(stats?.total_approved_budget)}
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Project Tasks"
          value={formatNumber(stats?.total_tasks)}
          icon={ListTodo}
        />
        <StatCard
          title="Completed Tasks"
          value={formatNumber(stats?.completed_tasks)}
          icon={ClipboardCheck}
          color="#059669"
        />
        <StatCard
          title="Overdue Tasks"
          value={formatNumber(stats?.overdue_tasks)}
          icon={Clock3}
          color="#DC2626"
        />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Project Directory
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {formatNumber(count)} matching projects
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
                placeholder="Search projects..."
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
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Types</option>
              <option value="new_construction">New Construction</option>
              <option value="renovation">Renovation</option>
              <option value="extension">Extension</option>
              <option value="fit_out">Fit Out</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="mixed_use">Mixed Use</option>
              <option value="other">Other</option>
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
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Project Manager</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Expected End</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${PRIMARY}12` }}
                        >
                          <HardHat size={20} color={PRIMARY} />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {project.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {project.project_code} ·{" "}
                            {formatLabel(project.project_type)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {project.organization?.name}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {project.project_manager?.name || "Unassigned"}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-800">
                      {formatMoney(project.approved_budget)}
                    </td>

                    <td className="px-5 py-4">
                      <ProgressBar value={project.progress} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(project.expected_end_date)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedId(project.id)}
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

          {!loading && !error && projects.length === 0 && (
            <div className="p-12 text-center">
              <HardHat size={34} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No construction projects found.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} ·{" "}
            {formatNumber(count)} projects
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {selectedId !== null && (
        <ProjectDetails
          projectId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
