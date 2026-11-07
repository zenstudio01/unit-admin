
import { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Building2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminPayments,
  getAdminPaymentStats,
  getAdminPaymentDetail,
  getAdminSubscriptionTransactions,
  getAdminPaymentReconciliations,
} from "../api/adminPayments";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const number = (value) =>
  Number(value || 0).toLocaleString("en-KE");

const money = (amount, currency = "KES") => {
  if (amount == null) return "—";
  return `${currency} ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const date = (value) =>
  value
    ? new Date(value).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const label = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const errorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.detail ||
  "Unable to load payment information.";

const statusColors = {
  completed: "bg-emerald-50 text-emerald-700",
  matched: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  partially_matched: "bg-amber-50 text-amber-700",
  mismatch: "bg-red-50 text-red-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  refunded: "bg-purple-50 text-purple-700",
  partially_refunded: "bg-purple-50 text-purple-700",
  reviewed: "bg-blue-50 text-blue-700",
  closed: "bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
        statusColors[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {label(status)}
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
      <p className="mt-2 break-words text-2xl font-black text-slate-900">
        {value}
      </p>
      {note && (
        <p className="mt-2 text-xs text-slate-400">{note}</p>
      )}
    </div>
  );
}

function CurrencyTotals({ title, rows = [], icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="rounded-xl p-3"
          style={{ backgroundColor: `${PRIMARY}12` }}
        >
          <Icon color={PRIMARY} size={21} />
        </div>
        <h3 className="font-black text-slate-900">{title}</h3>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map((item) => (
          <div
            key={item.currency}
            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"
          >
            <div>
              <p className="text-xs font-bold text-slate-500">
                {item.currency}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {number(item.count)} transactions
              </p>
            </div>
            <p className="text-lg font-black text-slate-900">
              {money(item.total, item.currency)}
            </p>
          </div>
        ))}

        {!rows.length && (
          <p className="text-sm text-slate-400">
            No completed transactions recorded.
          </p>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, count, loading, onChange }) {
  const totalPages = Math.max(
    1,
    Math.ceil(count / PAGE_SIZE)
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
      <p className="text-xs text-slate-500">
        Page {page} of {totalPages} · {number(count)} records
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
          disabled={loading || page >= totalPages}
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

function DetailField({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function PaymentDrawer({ paymentId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAdminPaymentDetail(paymentId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  const payment = data?.payment;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        onClick={onClose}
        aria-label="Close payment details"
        className="absolute inset-0 bg-slate-900/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Payment details"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Payment Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Transaction and allocation overview
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
              color={PRIMARY}
              className="mx-auto animate-spin"
            />
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {payment && (
            <>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs text-slate-500">
                  Payment Amount
                </p>
                <h3 className="mt-2 text-3xl font-black text-slate-900">
                  {money(payment.amount, payment.currency)}
                </h3>
                <p className="mt-2 break-all text-sm text-slate-500">
                  {payment.payment_reference}
                </p>
                <div className="mt-4">
                  <StatusBadge status={payment.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailField
                  title="Organization"
                  value={payment.organization?.name}
                />
                <DetailField
                  title="Tenant"
                  value={payment.tenant?.name || "Not linked"}
                />
                <DetailField
                  title="Provider"
                  value={label(payment.provider)}
                />
                <DetailField
                  title="Payment Method"
                  value={label(payment.payment_method)}
                />
                <DetailField
                  title="External Reference"
                  value={payment.external_reference}
                />
                <DetailField
                  title="Received By"
                  value={payment.received_by}
                />
                <DetailField
                  title="Paid At"
                  value={date(payment.paid_at)}
                />
                <DetailField
                  title="Created At"
                  value={date(payment.created_at)}
                />
              </div>

              <section>
                <h3 className="mb-4 font-black text-slate-900">
                  Invoice Allocations
                </h3>

                <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                  {(data.allocations || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {item.invoice_number}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {label(item.invoice_type)} ·{" "}
                          {date(item.allocated_at)}
                        </p>
                      </div>

                      <p className="text-sm font-black text-slate-800">
                        {money(
                          item.allocated_amount,
                          payment.currency
                        )}
                      </p>
                    </div>
                  ))}

                  {!data.allocations?.length && (
                    <p className="p-6 text-center text-sm text-slate-400">
                      No invoice allocations.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-4 font-black text-slate-900">
                  Receipts
                </h3>

                <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                  {(data.receipts || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {item.receipt_number}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {date(item.issued_at)}
                        </p>
                      </div>

                      {item.file_url && (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold"
                          style={{ color: PRIMARY }}
                        >
                          Open <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}

                  {!data.receipts?.length && (
                    <p className="p-6 text-center text-sm text-slate-400">
                      No receipts found.
                    </p>
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

const TABS = [
  {
    key: "property",
    title: "Property Payments",
    icon: Wallet,
  },
  {
    key: "subscription",
    title: "SaaS Payments",
    icon: CreditCard,
  },
  {
    key: "reconciliation",
    title: "Reconciliations",
    icon: ShieldCheck,
  },
];

const STATUS_OPTIONS = {
  property: [
    "pending",
    "processing",
    "completed",
    "failed",
    "cancelled",
    "refunded",
    "partially_refunded",
  ],
  subscription: [
    "pending",
    "completed",
    "failed",
    "refunded",
  ],
  reconciliation: [
    "pending",
    "matched",
    "partially_matched",
    "mismatch",
    "reviewed",
    "closed",
  ],
};

const PROVIDERS = [
  "mpesa",
  "paystack",
  "stripe",
  "bank",
  "cash",
  "other",
];

export default function Payments() {
  const [tab, setTab] = useState("property");
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [reload, setReload] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    getAdminPaymentStats()
      .then((result) => {
        if (!cancelled) {
          setStats(result);
          setStatsError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatsError(errorMessage(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reload]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: PAGE_SIZE,
        ...(search && { search }),
        ...(status && { status }),
        ...(provider && tab !== "subscription"
          ? { provider }
          : {}),
      };

      try {
        let result;

        if (tab === "property") {
          result = await getAdminPayments(params);
        } else if (tab === "subscription") {
          result = await getAdminSubscriptionTransactions(params);
        } else {
          result = await getAdminPaymentReconciliations(params);
        }

        if (!cancelled) {
          setRows(result.results || []);
          setCount(result.count || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setCount(0);
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [tab, page, search, status, provider, reload]);

  const changeTab = (next) => {
    setTab(next);
    setPage(1);
    setStatus("");
    setProvider("");
    setSearchInput("");
    setSearch("");
    setError("");
  };

  const refresh = () => setReload((value) => value + 1);

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
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor organization collections, SaaS billing,
            payment providers and reconciliation activity.
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
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Statistics: {statsError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Property Transactions"
          value={number(stats?.property_payments?.total)}
          icon={Building2}
        />
        <StatCard
          title="Completed Property Payments"
          value={number(stats?.property_payments?.completed)}
          icon={CheckCircle2}
          color="#059669"
        />
        <StatCard
          title="Completed SaaS Payments"
          value={number(stats?.subscription_payments?.completed)}
          icon={CreditCard}
          color="#2563EB"
        />
        <StatCard
          title="Reconciliations Needing Attention"
          value={number(stats?.reconciliations?.needs_attention)}
          icon={AlertTriangle}
          color="#DC2626"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CurrencyTotals
          title="Completed Property Collections"
          rows={stats?.property_payments?.completed_amounts}
          icon={Wallet}
        />
        <CurrencyTotals
          title="Completed UNIT SaaS Payments"
          rows={stats?.subscription_payments?.completed_amounts}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Pending Property Payments"
          value={number(stats?.property_payments?.pending)}
          icon={Clock3}
          color="#D97706"
        />
        <StatCard
          title="Failed Property Payments"
          value={number(stats?.property_payments?.failed)}
          icon={AlertTriangle}
          color="#DC2626"
        />
        <StatCard
          title="Refunded / Partially Refunded"
          value={number(stats?.property_payments?.refunded)}
          icon={ReceiptText}
          color="#7C3AED"
        />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-3">
          {TABS.map(({ key, title, icon: Icon }) => (
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
              {TABS.find((item) => item.key === tab)?.title}
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
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder="Search transactions..."
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
              {STATUS_OPTIONS[tab].map((item) => (
                <option key={item} value={item}>
                  {label(item)}
                </option>
              ))}
            </select>

            {tab !== "subscription" && (
              <select
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="">All Providers</option>
                {PROVIDERS.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50/80">
              {tab === "reconciliation" ? (
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Statement</th>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Expected</th>
                  <th className="px-5 py-4">Received</th>
                  <th className="px-5 py-4">Difference</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              ) : (
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">
                    {tab === "property" ? "Tenant" : "Package"}
                  </th>
                  <th className="px-5 py-4">Provider / Method</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              )}
            </thead>

            <tbody>
              {!loading &&
                rows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    {tab === "reconciliation" ? (
                      <>
                        <td className="px-5 py-4 text-sm font-bold text-slate-800">
                          {item.statement_reference}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.organization?.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {label(item.provider)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold">
                          {number(item.expected_amount)}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold">
                          {number(item.received_amount)}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold">
                          {number(item.difference)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-4">
                          <p className="max-w-[180px] break-all text-sm font-bold text-slate-800">
                            {item.payment_reference}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            #{item.id}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {item.organization?.name}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {tab === "property"
                            ? item.tenant?.name || "—"
                            : item.package?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {label(
                            tab === "property"
                              ? item.provider
                              : item.payment_method
                          )}
                          {tab === "property" && (
                            <p className="mt-1 text-xs text-slate-400">
                              {label(item.payment_method)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-black text-slate-900">
                          {money(item.amount, item.currency)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {date(item.paid_at || item.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          {tab === "property" ? (
                            <button
                              onClick={() =>
                                setSelectedPayment(item.id)
                              }
                              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-50"
                              style={{ color: PRIMARY }}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Read only
                            </span>
                          )}
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
            <div className="p-12 text-center">
              <ReceiptText
                size={34}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No matching records found.
              </p>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          count={count}
          loading={loading}
          onChange={setPage}
        />
      </section>

      {selectedPayment !== null && (
        <PaymentDrawer
          paymentId={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
