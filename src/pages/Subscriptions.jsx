import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  MoreVertical,
  RefreshCcw,
  Search,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Colors from "../constants/colors";

const mockSubscriptions = [
  {
    id: 1,
    organization: "Sammy Prop Limited",
    organization_code: "ORG-001",
    package: "Growth",
    billing_cycle: "monthly",
    amount: 7500,
    currency: "KES",
    status: "active",
    started_at: "2026-08-02",
    expires_at: "2026-09-02",
    trial: false,
    properties: 8,
    units: 74,
  },

  {
    id: 2,
    organization: "Green Homes Limited",
    organization_code: "ORG-002",
    package: "Starter",
    billing_cycle: "monthly",
    amount: 3500,
    currency: "KES",
    status: "trial",
    started_at: "2026-08-11",
    expires_at: "2026-09-11",
    trial: true,
    properties: 4,
    units: 38,
  },

  {
    id: 3,
    organization: "Prime Estate Managers",
    organization_code: "ORG-003",
    package: "Professional",
    billing_cycle: "yearly",
    amount: 120000,
    currency: "KES",
    status: "active",
    started_at: "2026-07-15",
    expires_at: "2027-07-15",
    trial: false,
    properties: 15,
    units: 190,
  },

  {
    id: 4,
    organization: "City Point Properties",
    organization_code: "ORG-004",
    package: "Starter",
    billing_cycle: "monthly",
    amount: 3500,
    currency: "KES",
    status: "expired",
    started_at: "2026-06-28",
    expires_at: "2026-07-28",
    trial: false,
    properties: 2,
    units: 16,
  },

  {
    id: 5,
    organization: "North Ridge Property Group",
    organization_code: "ORG-005",
    package: "Growth",
    billing_cycle: "monthly",
    amount: 7500,
    currency: "KES",
    status: "trial",
    started_at: "2026-08-18",
    expires_at: "2026-09-18",
    trial: true,
    properties: 6,
    units: 61,
  },

  {
    id: 6,
    organization: "Sunrise Lettings",
    organization_code: "ORG-006",
    package: "Professional",
    billing_cycle: "monthly",
    amount: 12000,
    currency: "KES",
    status: "active",
    started_at: "2026-08-20",
    expires_at: "2026-09-20",
    trial: false,
    properties: 11,
    units: 126,
  },
];

export default function Subscriptions() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    packageFilter,
    setPackageFilter,
  ] = useState("all");

  const [
    billingFilter,
    setBillingFilter,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const perPage = 5;

  /*
   * =====================================================
   * FILTERING
   * =====================================================
   */

  const filteredSubscriptions =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return mockSubscriptions.filter(
        (subscription) => {
          const matchesSearch =
            !keyword ||
            subscription.organization
              .toLowerCase()
              .includes(
                keyword
              ) ||
            subscription.organization_code
              .toLowerCase()
              .includes(
                keyword
              ) ||
            subscription.package
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesStatus =
            statusFilter === "all" ||
            subscription.status ===
              statusFilter;

          const matchesPackage =
            packageFilter === "all" ||
            subscription.package
              .toLowerCase() ===
              packageFilter;

          const matchesBilling =
            billingFilter === "all" ||
            subscription.billing_cycle ===
              billingFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPackage &&
            matchesBilling
          );
        }
      );
    }, [
      search,
      statusFilter,
      packageFilter,
      billingFilter,
    ]);

  /*
   * =====================================================
   * PAGINATION
   * =====================================================
   */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredSubscriptions.length /
          perPage
      )
    );

  const startIndex =
    (page - 1) *
    perPage;

  const paginatedSubscriptions =
    filteredSubscriptions.slice(
      startIndex,
      startIndex +
        perPage
    );

  /*
   * =====================================================
   * SUMMARY
   * =====================================================
   */

  const totalSubscriptions =
    mockSubscriptions.length;

  const activeSubscriptions =
    mockSubscriptions.filter(
      (subscription) =>
        subscription.status ===
        "active"
    ).length;

  const trialSubscriptions =
    mockSubscriptions.filter(
      (subscription) =>
        subscription.status ===
        "trial"
    ).length;

  const monthlyRevenue =
    mockSubscriptions
      .filter(
        (subscription) =>
          subscription.status ===
            "active" &&
          subscription.billing_cycle ===
            "monthly"
      )
      .reduce(
        (
          total,
          subscription
        ) =>
          total +
          subscription.amount,
        0
      );

  /*
   * =====================================================
   * PLAN COUNTS
   * =====================================================
   */

  const planStats = [
    {
      name: "Starter",
      count:
        mockSubscriptions.filter(
          (subscription) =>
            subscription.package ===
            "Starter"
        ).length,
    },

    {
      name: "Growth",
      count:
        mockSubscriptions.filter(
          (subscription) =>
            subscription.package ===
            "Growth"
        ).length,
    },

    {
      name: "Professional",
      count:
        mockSubscriptions.filter(
          (subscription) =>
            subscription.package ===
            "Professional"
        ).length,
    },
  ];

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPackageFilter("all");
    setBillingFilter("all");
    setPage(1);
  };

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-sm font-bold"
            style={{
              color:
                Colors.primary,
            }}
          >
            Billing & Revenue
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Subscriptions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor organization
            subscriptions, trials,
            billing cycles, plan
            distribution and revenue
            across UNIT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "Manage packages"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <CreditCard
            size={18}
          />

          Manage Packages
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={WalletCards}
          label="Subscriptions"
          value={
            totalSubscriptions
          }
          helper="All organization subscriptions"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Active"
          value={
            activeSubscriptions
          }
          helper="Currently paid and active"
        />

        <SummaryCard
          icon={Users}
          label="Free Trials"
          value={
            trialSubscriptions
          }
          helper="Organizations in trial"
        />

        <SummaryCard
          icon={TrendingUp}
          label="Monthly Revenue"
          value={
            formatCurrency(
              monthlyRevenue
            )
          }
          helper="Active monthly subscriptions"
        />
      </div>

      {/* =================================================
          REVENUE + PLAN BREAKDOWN
      ================================================= */}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {/* REVENUE */}

        <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div
            className="absolute -right-16 -top-16 h-52 w-52 rounded-full"
            style={{
              backgroundColor:
                `${Colors.primary}08`,
            }}
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    `${Colors.primary}12`,
                }}
              >
                <TrendingUp
                  size={26}
                  color={
                    Colors.primary
                  }
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                Subscription Revenue
              </h2>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                Current monthly
                recurring revenue from
                organizations subscribed
                to monthly packages.
              </p>

              <p className="mt-6 text-4xl font-black text-slate-900">
                {formatCurrency(
                  monthlyRevenue
                )}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                <TrendingUp
                  size={14}
                  className="text-emerald-600"
                />

                <span className="text-xs font-bold text-emerald-600">
                  +12.5% this month
                </span>
              </div>
            </div>

            <div className="grid min-w-[250px] grid-cols-2 gap-3">
              <RevenueMiniCard
                title="Monthly"
                value="KES 19,500"
              />

              <RevenueMiniCard
                title="Yearly"
                value="KES 120K"
              />

              <RevenueMiniCard
                title="Paid Plans"
                value={
                  activeSubscriptions
                }
              />

              <RevenueMiniCard
                title="Trials"
                value={
                  trialSubscriptions
                }
              />
            </div>
          </div>
        </div>

        {/* PLAN BREAKDOWN */}

        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Package Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organizations by
              subscription package.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {planStats.map(
              (
                plan
              ) => {
                const percentage =
                  totalSubscriptions >
                  0
                    ? Math.round(
                        (
                          plan.count /
                          totalSubscriptions
                        ) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={
                      plan.name
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {
                            plan.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            plan.count
                          }{" "}
                          organizations
                        </p>
                      </div>

                      <span
                        className="rounded-xl px-3 py-1.5 text-xs font-black"
                        style={{
                          backgroundColor:
                            `${Colors.primary}10`,
                          color:
                            Colors.primary,
                        }}
                      >
                        {
                          percentage
                        }
                        %
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:
                            `${percentage}%`,
                          backgroundColor:
                            Colors.primary,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="mt-8 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* SEARCH */}

          <div className="flex h-12 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-200 focus-within:bg-white">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={
                search
              }
              onChange={(
                event
              ) => {
                setSearch(
                  event.target.value
                );

                setPage(1);
              }}
              type="text"
              placeholder="Search organization, package or code..."
              className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* STATUS */}

          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="hidden text-slate-400 sm:block"
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) => {
                setStatusFilter(
                  event.target.value
                );

                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
            >
              <option value="all">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="trial">
                Trial
              </option>

              <option value="expired">
                Expired
              </option>
            </select>
          </div>

          {/* PACKAGE */}

          <select
            value={
              packageFilter
            }
            onChange={(
              event
            ) => {
              setPackageFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
          >
            <option value="all">
              All packages
            </option>

            <option value="starter">
              Starter
            </option>

            <option value="growth">
              Growth
            </option>

            <option value="professional">
              Professional
            </option>
          </select>

          {/* BILLING */}

          <select
            value={
              billingFilter
            }
            onChange={(
              event
            ) => {
              setBillingFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
          >
            <option value="all">
              All billing cycles
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>
          </select>

          <button
            type="button"
            onClick={
              resetFilters
            }
            className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Organization Subscriptions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredSubscriptions.length
              }{" "}
              subscription
              {filteredSubscriptions.length ===
              1
                ? ""
                : "s"}{" "}
              found.
            </p>
          </div>

          <button
            type="button"
            className="self-start text-sm font-bold sm:self-auto"
            style={{
              color:
                Colors.primary,
            }}
          >
            Export Billing
          </button>
        </div>

        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <TableHead>
                  Organization
                </TableHead>

                <TableHead>
                  Package
                </TableHead>

                <TableHead>
                  Billing
                </TableHead>

                <TableHead>
                  Amount
                </TableHead>

                <TableHead>
                  Usage
                </TableHead>

                <TableHead>
                  Started
                </TableHead>

                <TableHead>
                  Expires
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedSubscriptions.map(
                (
                  subscription
                ) => (
                  <tr
                    key={
                      subscription.id
                    }
                    className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0"
                  >
                    {/* ORGANIZATION */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl"
                          style={{
                            backgroundColor:
                              `${Colors.primary}12`,
                          }}
                        >
                          <CreditCard
                            size={20}
                            color={
                              Colors.primary
                            }
                          />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {
                              subscription.organization
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {
                              subscription.organization_code
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PACKAGE */}

                    <td className="px-6 py-5">
                      <span
                        className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold"
                        style={{
                          backgroundColor:
                            `${Colors.primary}10`,
                          color:
                            Colors.primary,
                        }}
                      >
                        {
                          subscription.package
                        }
                      </span>
                    </td>

                    {/* BILLING */}

                    <td className="px-6 py-5">
                      <BillingBadge
                        cycle={
                          subscription.billing_cycle
                        }
                      />
                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-800">
                        {formatCurrency(
                          subscription.amount
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400 capitalize">
                        per{" "}
                        {
                          subscription.billing_cycle
                        }
                      </p>
                    </td>

                    {/* USAGE */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {
                          subscription.properties
                        }{" "}
                        properties
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {
                          subscription.units
                        }{" "}
                        units
                      </p>
                    </td>

                    {/* START */}

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDate(
                        subscription.started_at
                      )}
                    </td>

                    {/* EXPIRY */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm text-slate-500">
                          {formatDate(
                            subscription.expires_at
                          )}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <SubscriptionStatus
                        status={
                          subscription.status
                        }
                      />
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "View subscription",
                              subscription.id
                            );
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        >
                          <Eye
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          title="Refresh subscription"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        >
                          <RefreshCcw
                            size={16}
                          />
                        </button>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        >
                          <MoreVertical
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedSubscriptions.map(
            (
              subscription
            ) => (
              <div
                key={
                  subscription.id
                }
                className="p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor:
                        `${Colors.primary}12`,
                    }}
                  >
                    <CreditCard
                      size={21}
                      color={
                        Colors.primary
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-800">
                      {
                        subscription.organization
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        subscription.organization_code
                      }
                    </p>
                  </div>

                  <SubscriptionStatus
                    status={
                      subscription.status
                    }
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MobileField
                    label="Package"
                    value={
                      subscription.package
                    }
                  />

                  <MobileField
                    label="Billing"
                    value={
                      capitalize(
                        subscription.billing_cycle
                      )
                    }
                  />

                  <MobileField
                    label="Amount"
                    value={
                      formatCurrency(
                        subscription.amount
                      )
                    }
                  />

                  <MobileField
                    label="Units"
                    value={
                      subscription.units
                    }
                  />

                  <MobileField
                    label="Started"
                    value={
                      formatDate(
                        subscription.started_at
                      )
                    }
                  />

                  <MobileField
                    label="Expires"
                    value={
                      formatDate(
                        subscription.expires_at
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
                >
                  <Eye
                    size={17}
                  />

                  View Subscription
                </button>
              </div>
            )
          )}
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {paginatedSubscriptions.length ===
          0 && (
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{
                backgroundColor:
                  `${Colors.primary}10`,
              }}
            >
              <CreditCard
                size={34}
                color={
                  Colors.primary
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No subscriptions found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing the
              subscription status,
              package or billing cycle.
            </p>

            <button
              type="button"
              onClick={
                resetFilters
              }
              className="mt-5 font-bold"
              style={{
                color:
                  Colors.primary,
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {filteredSubscriptions.length >
          0 && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {startIndex +
                  1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-700">
                {Math.min(
                  startIndex +
                    perPage,
                  filteredSubscriptions.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredSubscriptions.length
                }
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    (
                      current
                    ) =>
                      Math.max(
                        1,
                        current -
                          1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <div
                className="flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-black text-white"
                style={{
                  backgroundColor:
                    Colors.primary,
                }}
              >
                {page}
              </div>

              <span className="text-sm text-slate-400">
                of{" "}
                {
                  totalPages
                }
              </span>

              <button
                type="button"
                disabled={
                  page ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (
                      current
                    ) =>
                      Math.min(
                        totalPages,
                        current +
                          1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * =====================================================
 * SUMMARY CARD
 * =====================================================
 */

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
}) {
  return (
    <div className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor:
              `${Colors.primary}12`,
          }}
        >
          <Icon
            size={22}
            color={
              Colors.primary
            }
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {helper}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * MINI REVENUE CARD
 * =====================================================
 */

function RevenueMiniCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-lg font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * STATUS
 * =====================================================
 */

function SubscriptionStatus({
  status,
}) {
  const normalized =
    String(
      status ||
      ""
    ).toLowerCase();

  if (
    normalized ===
    "active"
  ) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
        Active
      </span>
    );
  }

  if (
    normalized ===
    "trial"
  ) {
    return (
      <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
        Trial
      </span>
    );
  }

  if (
    normalized ===
    "expired"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-500">
      {status}
    </span>
  );
}

/*
 * =====================================================
 * BILLING
 * =====================================================
 */

function BillingBadge({
  cycle,
}) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-600">
      {cycle}
    </span>
  );
}

/*
 * =====================================================
 * TABLE HEAD
 * =====================================================
 */

function TableHead({
  children,
}) {
  return (
    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

/*
 * =====================================================
 * MOBILE FIELD
 * =====================================================
 */

function MobileField({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">
        {value ?? "—"}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * CURRENCY
 * =====================================================
 */

function formatCurrency(
  value
) {
  const amount =
    Number(
      value ||
      0
    );

  return `KES ${amount.toLocaleString(
    "en-KE"
  )}`;
}

/*
 * =====================================================
 * DATE
 * =====================================================
 */

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  return new Date(
    `${value}T00:00:00`
  ).toLocaleDateString(
    "en-KE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/*
 * =====================================================
 * CAPITALIZE
 * =====================================================
 */

function capitalize(
  value
) {
  if (!value) {
    return "—";
  }

  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}