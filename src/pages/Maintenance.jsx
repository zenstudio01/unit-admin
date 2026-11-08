
import { useEffect, useState } from "react";
import {
  Wrench, Search, RefreshCw, Eye, X, ChevronLeft,
  ChevronRight, AlertTriangle, CheckCircle2, Clock3,
  ClipboardCheck, Building2, CalendarDays, UserRound,
  Image as ImageIcon, MessageSquare, History, ShieldCheck,
  ExternalLink, Wallet, ListFilter,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminMaintenanceTickets,
  getAdminMaintenanceStats,
  getAdminMaintenanceDetail,
} from "../api/adminMaintenance";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const fmt = (v) => Number(v || 0).toLocaleString("en-KE");
const money = (v) => v == null ? "—" : `KES ${fmt(v)}`;
const label = (v) =>
  String(v ?? "—").replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const date = (v) => v
  ? new Date(v).toLocaleDateString("en-KE", {
      day: "numeric", month: "short", year: "numeric",
    })
  : "—";

const dateTime = (v) => v
  ? new Date(v).toLocaleString("en-KE", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  : "—";

const getError = (e) =>
  e.response?.data?.message ||
  e.response?.data?.detail ||
  "Unable to load maintenance information.";

const statusStyles = {
  open: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  approved: "bg-teal-50 text-teal-700",
  published_to_kaskazi: "bg-indigo-50 text-indigo-700",
  assigned: "bg-violet-50 text-violet-700",
  in_progress: "bg-orange-50 text-orange-700",
  awaiting_approval: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-red-50 text-red-700",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-50 text-blue-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-orange-50 text-orange-700",
  emergency: "bg-red-50 text-red-700",
};

function Badge({ value, priority = false }) {
  const styles = priority ? priorityStyles : statusStyles;
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
      styles[value] || "bg-slate-100 text-slate-600"
    }`}>
      {label(value)}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color = PRIMARY, note }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}>
        <Icon size={21} color={color} />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-2 break-words text-2xl font-black text-slate-900">{value}</p>
      {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
    </div>
  );
}

function DetailField({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <div className="mt-2 break-words text-sm font-bold text-slate-800">
        {value ?? "—"}
      </div>
    </div>
  );
}

function Empty({ message }) {
  return (
    <div className="py-12 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

const DETAIL_TABS = [
  ["overview", "Overview"],
  ["media", "Media"],
  ["comments", "Comments"],
  ["history", "History"],
  ["approvals", "Approvals"],
  ["warranties", "Warranties"],
];

function MaintenanceDrawer({ id, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    let active = true;

    getAdminMaintenanceDetail(id)
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

  const ticket = data?.ticket;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 bg-slate-900/50"
        onClick={onClose} aria-label="Close details" />

      <aside role="dialog" aria-modal="true" aria-label="Maintenance ticket details"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

        <div className="flex items-start justify-between gap-4 border-b p-5 sm:p-6">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900">Maintenance Details</h2>
            <p className="mt-1 break-all text-xs text-slate-500">
              {ticket?.ticket_number || `Ticket #${id}`}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="rounded-xl bg-slate-100 p-2.5">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b p-3">
          {DETAIL_TABS.map(([key, title]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${
                tab === key ? "text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
              style={tab === key ? { backgroundColor: PRIMARY } : {}}>
              {title}
              {key !== "overview" && data && (
                <span className="ml-1 opacity-70">
                  ({(data[key === "history" ? "status_history" : key] || []).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {loading && (
            <RefreshCw className="mx-auto animate-spin" color={PRIMARY} />
          )}
          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
          )}

          {ticket && tab === "overview" && (
            <>
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-xl font-black text-slate-900">{ticket.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {ticket.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge value={ticket.status} />
                  <Badge value={ticket.priority} priority />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailField title="Organization" value={ticket.organization?.name} />
                <DetailField title="Property" value={ticket.property?.name} />
                <DetailField title="Building" value={ticket.building?.name} />
                <DetailField title="Unit" value={ticket.unit?.name} />
                <DetailField title="Category" value={label(ticket.category)} />
                <DetailField title="Source" value={label(ticket.source)} />
                <DetailField title="Reported By" value={ticket.reported_by?.name} />
                <DetailField title="Assigned To" value={ticket.assigned_to?.name || "Unassigned"} />
                <DetailField title="Estimated Cost" value={money(ticket.estimated_cost)} />
                <DetailField title="Actual Cost" value={money(ticket.actual_cost)} />
                <DetailField title="Preferred Date" value={date(ticket.preferred_date)} />
                <DetailField title="Scheduled At" value={dateTime(ticket.scheduled_at)} />
                <DetailField title="Completed At" value={dateTime(ticket.completed_at)} />
                <DetailField title="Closed At" value={dateTime(ticket.closed_at)} />
                <DetailField title="Created At" value={dateTime(ticket.created_at)} />
                <DetailField title="Last Updated" value={dateTime(ticket.updated_at)} />
              </div>
            </>
          )}

          {data && tab === "media" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-100">
                  {item.file_type === "image" ? (
                    <img src={item.file_url} alt={item.caption || "Maintenance attachment"}
                      className="h-44 w-full bg-slate-100 object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-slate-50">
                      <ImageIcon className="text-slate-400" size={30} />
                    </div>
                  )}
                  <div className="space-y-2 p-4">
                    <p className="text-sm font-bold text-slate-800">
                      {item.caption || label(item.file_type)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {label(item.media_stage)} · {date(item.created_at)}
                    </p>
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: PRIMARY }}>
                      Open attachment <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
              {!data.media.length && <Empty message="No media attached." />}
            </div>
          )}

          {data && tab === "comments" && (
            <div className="space-y-3">
              {data.comments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">{item.user?.name || "Unknown user"}</p>
                    {item.is_internal && (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                        Internal
                      </span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{item.comment}</p>
                  <p className="mt-3 text-xs text-slate-400">{dateTime(item.created_at)}</p>
                </div>
              ))}
              {!data.comments.length && <Empty message="No comments found." />}
            </div>
          )}

          {data && tab === "history" && (
            <div className="space-y-3">
              {data.status_history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge value={item.previous_status} />
                    <span className="text-slate-400">→</span>
                    <Badge value={item.new_status} />
                  </div>
                  {item.notes && <p className="mt-3 text-sm text-slate-600">{item.notes}</p>}
                  <p className="mt-3 text-xs text-slate-400">
                    {item.changed_by?.name || "System"} · {dateTime(item.created_at)}
                  </p>
                </div>
              ))}
              {!data.status_history.length && <Empty message="No status history found." />}
            </div>
          )}

          {data && tab === "approvals" && (
            <div className="space-y-3">
              {data.approvals.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">{label(item.approval_type)}</p>
                    <Badge value={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Requested from: {item.requested_from?.name || "—"}
                  </p>
                  {item.comments && <p className="mt-2 text-sm text-slate-600">{item.comments}</p>}
                  <p className="mt-3 text-xs text-slate-400">
                    {dateTime(item.approved_at || item.created_at)}
                  </p>
                </div>
              ))}
              {!data.approvals.length && <Empty message="No approval records found." />}
            </div>
          )}

          {data && tab === "warranties" && (
            <div className="space-y-3">
              {data.warranties.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-800">{label(item.provider_type)}</p>
                    <Badge value={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {date(item.start_date)} – {date(item.end_date)}
                  </p>
                  {item.external_provider_id && (
                    <p className="mt-1 text-xs text-slate-500">
                      Provider reference: {item.external_provider_id}
                    </p>
                  )}
                  {item.terms && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{item.terms}</p>
                  )}
                </div>
              ))}
              {!data.warranties.length && <Empty message="No warranties found." />}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Pagination({ page, count, loading, onChange }) {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
      <p className="text-xs text-slate-500">
        Page {page} of {totalPages} · {fmt(count)} tickets
      </p>
      <div className="flex gap-2">
        <button disabled={loading || page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40">
          <ChevronLeft size={18} />
        </button>
        <button disabled={loading || page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Maintenance() {
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
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

    getAdminMaintenanceStats()
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
        const result = await getAdminMaintenanceTickets({
          page,
          page_size: PAGE_SIZE,
          ...(search && { search }),
          ...(status && { status }),
          ...(priority && { priority }),
          ...(category && { category }),
        });

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
  }, [page, search, status, priority, category, reload]);

  const refresh = () => setReload((v) => v + 1);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPriority("");
    setCategory("");
    setPage(1);
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Maintenance
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor maintenance requests, assignments, priorities,
            approvals and repair costs across organizations.
          </p>
        </div>
        <button onClick={refresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold">
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {statsError && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Statistics: {statsError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tickets" value={fmt(stats?.total_tickets)} icon={Wrench} />
        <StatCard title="Open Tickets" value={fmt(stats?.open_tickets)}
          icon={Clock3} color="#2563EB" />
        <StatCard title="In Progress" value={fmt(stats?.in_progress_tickets)}
          icon={RefreshCw} color="#D97706" />
        <StatCard title="Completed / Closed" value={fmt(stats?.completed_tickets)}
          icon={CheckCircle2} color="#059669"
          note={`${stats?.completion_rate ?? 0}% completion rate`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Urgent / Emergency" value={fmt(stats?.urgent_tickets)}
          icon={AlertTriangle} color="#DC2626" />
        <StatCard title="Unassigned Tickets" value={fmt(stats?.unassigned_tickets)}
          icon={UserRound} color="#7C3AED" />
        <StatCard title="Pending Approvals" value={fmt(stats?.pending_approvals)}
          icon={ClipboardCheck} color="#D97706" />
        <StatCard title="New in Last 30 Days" value={fmt(stats?.new_last_30_days)}
          icon={CalendarDays} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Estimated Repair Costs" value={money(stats?.total_estimated_cost)}
          icon={Wallet} />
        <StatCard title="Recorded Actual Repair Costs" value={money(stats?.total_actual_cost)}
          icon={Wallet} color="#059669" />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Maintenance Tickets</h2>
              <p className="mt-1 text-xs text-slate-400">{fmt(count)} matching records</p>
            </div>
            <ListFilter size={20} className="text-slate-400" />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tickets, properties..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Statuses</option>
              {(stats?.status_choices || []).map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Priorities</option>
              {(stats?.priority_choices || []).map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="">All Categories</option>
              {(stats?.category_choices || []).map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <button onClick={clearFilters}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">
              Clear
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Organization / Property</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Assigned To</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.map((item) => (
                <tr key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-4">
                    <p className="max-w-48 truncate text-sm font-bold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.ticket_number}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-700">
                      {item.organization?.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.property?.name}
                      {item.unit?.name ? ` · ${item.unit.name}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{label(item.category)}</td>
                  <td className="px-5 py-4"><Badge value={item.priority} priority /></td>
                  <td className="px-5 py-4"><Badge value={item.status} /></td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.assigned_to?.name || "Unassigned"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {date(item.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedId(item.id)}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-50"
                      style={{ color: PRIMARY }}>
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex justify-center p-12">
              <RefreshCw className="animate-spin" color={PRIMARY} size={26} />
            </div>
          )}
          {!loading && !error && !rows.length && (
            <Empty message="No maintenance tickets match your filters." />
          )}
        </div>

        <Pagination page={page} count={count} loading={loading} onChange={setPage} />
      </section>

      {selectedId !== null && (
        <MaintenanceDrawer id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
