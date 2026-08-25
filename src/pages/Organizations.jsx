import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Users,
  House,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";


import Colors from "../constants/colors";

const mockOrganizations = [
  {
    id: 1,
    name: "Sammy Prop Limited",
    code: "ORG-001",
    owner: "Samuel Kamau",
    email: "sammy@example.com",
    phone: "+254 712 345 678",
    properties: 8,
    units: 74,
    members: 12,
    package: "Growth",
    billing_cycle: "Monthly",
    subscription_status: "active",
    organization_status: "active",
    joined_at: "2026-08-02",
  },

  {
    id: 2,
    name: "Green Homes Limited",
    code: "ORG-002",
    owner: "Mary Wanjiku",
    email: "mary@example.com",
    phone: "+254 722 556 712",
    properties: 4,
    units: 38,
    members: 7,
    package: "Starter",
    billing_cycle: "Monthly",
    subscription_status: "trial",
    organization_status: "active",
    joined_at: "2026-08-11",
  },

  {
    id: 3,
    name: "Prime Estate Managers",
    code: "ORG-003",
    owner: "Kevin Mutua",
    email: "kevin@example.com",
    phone: "+254 733 468 210",
    properties: 15,
    units: 190,
    members: 23,
    package: "Professional",
    billing_cycle: "Yearly",
    subscription_status: "active",
    organization_status: "active",
    joined_at: "2026-07-15",
  },

  {
    id: 4,
    name: "City Point Properties",
    code: "ORG-004",
    owner: "Jane Njeri",
    email: "jane@example.com",
    phone: "+254 710 498 760",
    properties: 2,
    units: 16,
    members: 4,
    package: "Starter",
    billing_cycle: "Monthly",
    subscription_status: "expired",
    organization_status: "suspended",
    joined_at: "2026-06-28",
  },

  {
    id: 5,
    name: "North Ridge Property Group",
    code: "ORG-005",
    owner: "Brian Mwangi",
    email: "brian@example.com",
    phone: "+254 701 887 430",
    properties: 6,
    units: 61,
    members: 10,
    package: "Growth",
    billing_cycle: "Monthly",
    subscription_status: "trial",
    organization_status: "active",
    joined_at: "2026-08-18",
  },
];

export default function Organizations() {
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
    page,
    setPage,
  ] = useState(1);

  const perPage = 5;

  /*
   * =====================================================
   * FILTERED DATA
   * =====================================================
   */

  const filteredOrganizations =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return mockOrganizations.filter(
        (organization) => {
          const matchesSearch =
            !keyword ||
            organization.name
              .toLowerCase()
              .includes(
                keyword
              ) ||
            organization.code
              .toLowerCase()
              .includes(
                keyword
              ) ||
            organization.owner
              .toLowerCase()
              .includes(
                keyword
              ) ||
            organization.email
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesStatus =
            statusFilter === "all" ||
            organization.organization_status ===
              statusFilter;

          const matchesPackage =
            packageFilter === "all" ||
            organization.package
              .toLowerCase() ===
              packageFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPackage
          );
        }
      );
    }, [
      search,
      statusFilter,
      packageFilter,
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
        filteredOrganizations.length /
          perPage
      )
    );

  const startIndex =
    (page - 1) *
    perPage;

  const paginatedOrganizations =
    filteredOrganizations.slice(
      startIndex,
      startIndex +
        perPage
    );

  /*
   * =====================================================
   * SUMMARY
   * =====================================================
   */

  const totalOrganizations =
    mockOrganizations.length;

  const activeOrganizations =
    mockOrganizations.filter(
      (item) =>
        item.organization_status ===
        "active"
    ).length;

  const trialOrganizations =
    mockOrganizations.filter(
      (item) =>
        item.subscription_status ===
        "trial"
    ).length;

  const totalUnits =
    mockOrganizations.reduce(
      (
        total,
        item
      ) =>
        total +
        item.units,
      0
    );

  /*
   * =====================================================
   * RESET FILTERS
   * =====================================================
   */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPackageFilter("all");
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
            Organization Management
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Organizations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View and manage organizations
            registered on UNIT, their
            properties, members and
            subscription status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "Create organization"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <Plus size={18} />

          Add Organization
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Building2}
          label="Organizations"
          value={
            totalOrganizations
          }
          helper="Total registered"
        />

        <SummaryCard
          icon={House}
          label="Managed Units"
          value={
            totalUnits
          }
          helper="Across all organizations"
        />

        <SummaryCard
          icon={Users}
          label="Active Organizations"
          value={
            activeOrganizations
          }
          helper="Currently operational"
        />

        <SummaryCard
          icon={CreditCard}
          label="On Trial"
          value={
            trialOrganizations
          }
          helper="Trial subscriptions"
        />
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
              placeholder="Search organization, owner, email or code..."
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

              <option value="suspended">
                Suspended
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
        {/* TABLE HEADER */}

        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Registered Organizations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredOrganizations.length
              }{" "}
              organization
              {filteredOrganizations.length ===
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
            Export List
          </button>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <TableHead>
                  Organization
                </TableHead>

                <TableHead>
                  Owner
                </TableHead>

                <TableHead>
                  Properties
                </TableHead>

                <TableHead>
                  Units
                </TableHead>

                <TableHead>
                  Members
                </TableHead>

                <TableHead>
                  Subscription
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Joined
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedOrganizations.map(
                (
                  organization
                ) => (
                  <tr
                    key={
                      organization.id
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
                          <Building2
                            size={20}
                            color={
                              Colors.primary
                            }
                          />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {
                              organization.name
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {
                              organization.code
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OWNER */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {
                          organization.owner
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {
                          organization.email
                        }
                      </p>
                    </td>

                    {/* PROPERTIES */}

                    <td className="px-6 py-5 text-sm font-bold text-slate-700">
                      {
                        organization.properties
                      }
                    </td>

                    {/* UNITS */}

                    <td className="px-6 py-5 text-sm font-bold text-slate-700">
                      {
                        organization.units
                      }
                    </td>

                    {/* MEMBERS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Users
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm font-semibold text-slate-600">
                          {
                            organization.members
                          }
                        </span>
                      </div>
                    </td>

                    {/* SUBSCRIPTION */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">
                        {
                          organization.package
                        }
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {
                            organization.billing_cycle
                          }
                        </span>

                        <SubscriptionBadge
                          status={
                            organization.subscription_status
                          }
                        />
                      </div>
                    </td>

                    {/* ORG STATUS */}

                    <td className="px-6 py-5">
                      <OrganizationBadge
                        status={
                          organization.organization_status
                        }
                      />
                    </td>

                    {/* JOINED */}

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDate(
                        organization.joined_at
                      )}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "View organization:",
                              organization.id
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

        {/* MOBILE CARDS */}

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedOrganizations.map(
            (
              organization
            ) => (
              <div
                key={
                  organization.id
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
                    <Building2
                      size={21}
                      color={
                        Colors.primary
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-800">
                      {
                        organization.name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        organization.code
                      }
                    </p>
                  </div>

                  <OrganizationBadge
                    status={
                      organization.organization_status
                    }
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MobileField
                    label="Owner"
                    value={
                      organization.owner
                    }
                  />

                  <MobileField
                    label="Plan"
                    value={
                      organization.package
                    }
                  />

                  <MobileField
                    label="Properties"
                    value={
                      organization.properties
                    }
                  />

                  <MobileField
                    label="Units"
                    value={
                      organization.units
                    }
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
                >
                  <Eye size={17} />

                  View Organization
                </button>
              </div>
            )
          )}
        </div>

        {/* EMPTY */}

        {paginatedOrganizations.length ===
          0 && (
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{
                backgroundColor:
                  `${Colors.primary}10`,
              }}
            >
              <Building2
                size={34}
                color={
                  Colors.primary
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No organizations found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing the search
              term or filters.
            </p>

            <button
              onClick={
                resetFilters
              }
              type="button"
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

        {filteredOrganizations.length >
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
                  filteredOrganizations.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredOrganizations.length
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
 * ORGANIZATION STATUS
 * =====================================================
 */

function OrganizationBadge({
  status,
}) {
  const normalized =
    String(
      status
    ).toLowerCase();

  if (
    normalized ===
    "active"
  ) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-600">
        Active
      </span>
    );
  }

  if (
    normalized ===
    "suspended"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold capitalize text-red-600">
        Suspended
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
 * SUBSCRIPTION STATUS
 * =====================================================
 */

function SubscriptionBadge({
  status,
}) {
  const normalized =
    String(
      status
    ).toLowerCase();

  let classes =
    "bg-slate-100 text-slate-500";

  if (
    normalized ===
    "active"
  ) {
    classes =
      "bg-emerald-50 text-emerald-600";
  }

  if (
    normalized ===
    "trial"
  ) {
    classes =
      "bg-orange-50 text-orange-600";
  }

  if (
    normalized ===
    "expired"
  ) {
    classes =
      "bg-red-50 text-red-600";
  }

  return (
    <span
      className={`
        rounded-full
        px-2 py-0.5
        text-[10px] font-bold
        capitalize
        ${classes}
      `}
    >
      {status}
    </span>
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
        {value}
      </p>
    </div>
  );
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