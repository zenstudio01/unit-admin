import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  MoreVertical,
  Search,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Colors from "../constants/colors";

const mockMaintenance = [
  {
    id: 1,
    ticket_number:
      "MNT-4-BE00DE397E",

    title:
      "Kitchen sink is leaking",

    description:
      "The kitchen sink has been leaking continuously and needs a plumber.",

    organization:
      "Sammy Prop Limited",

    property:
      "Meru Morning Apartments",

    building:
      "Block A",

    unit:
      "Unit A01",

    category:
      "plumbing",

    priority:
      "high",

    status:
      "in_progress",

    source:
      "tenant",

    reported_by:
      "John Mwangi",

    assigned_worker:
      "Peter Kamau",

    service_provider:
      "Kaskazi",

    created_at:
      "2026-08-21",

    scheduled_at:
      "2026-08-22T09:00:00",
  },

  {
    id: 2,
    ticket_number:
      "MNT-7-7821AF",

    title:
      "Electrical socket issue",

    description:
      "One of the wall sockets is sparking when appliances are connected.",

    organization:
      "Green Homes Limited",

    property:
      "Green View Apartments",

    building:
      "Main Block",

    unit:
      "B12",

    category:
      "electrical",

    priority:
      "urgent",

    status:
      "open",

    source:
      "tenant",

    reported_by:
      "Mary Njeri",

    assigned_worker:
      null,

    service_provider:
      null,

    created_at:
      "2026-08-24",

    scheduled_at:
      null,
  },

  {
    id: 3,
    ticket_number:
      "MNT-8-2399AB",

    title:
      "Repaint hallway",

    description:
      "Hallway walls need repainting after recent repairs.",

    organization:
      "Prime Estate Managers",

    property:
      "Prime Residence",

    building:
      "Tower 2",

    unit:
      null,

    category:
      "painting",

    priority:
      "medium",

    status:
      "under_review",

    source:
      "manager",

    reported_by:
      "Kevin Mutua",

    assigned_worker:
      null,

    service_provider:
      null,

    created_at:
      "2026-08-20",

    scheduled_at:
      null,
  },

  {
    id: 4,
    ticket_number:
      "MNT-10-17A9D3",

    title:
      "Replace broken door lock",

    description:
      "Main entrance door lock is damaged and needs replacement.",

    organization:
      "City Point Properties",

    property:
      "City Point Residences",

    building:
      "Block C",

    unit:
      "C07",

    category:
      "carpentry",

    priority:
      "high",

    status:
      "completed",

    source:
      "manager",

    reported_by:
      "Jane Njeri",

    assigned_worker:
      "David Otieno",

    service_provider:
      "Kaskazi",

    created_at:
      "2026-08-18",

    scheduled_at:
      "2026-08-19T14:00:00",
  },

  {
    id: 5,
    ticket_number:
      "MNT-11-F20A91",

    title:
      "Water tank cleaning",

    description:
      "Scheduled cleaning for the rooftop water tank.",

    organization:
      "North Ridge Property Group",

    property:
      "North Ridge Villas",

    building:
      null,

    unit:
      null,

    category:
      "cleaning",

    priority:
      "low",

    status:
      "approved",

    source:
      "manager",

    reported_by:
      "Brian Mwangi",

    assigned_worker:
      null,

    service_provider:
      null,

    created_at:
      "2026-08-23",

    scheduled_at:
      "2026-08-27T10:30:00",
  },

  {
    id: 6,
    ticket_number:
      "MNT-14-C92AC1",

    title:
      "Air conditioner not cooling",

    description:
      "Office air conditioner is running but not cooling the room.",

    organization:
      "Prime Estate Managers",

    property:
      "Prime Business Centre",

    building:
      "Office Wing",

    unit:
      "Office 204",

    category:
      "hvac",

    priority:
      "medium",

    status:
      "assigned",

    source:
      "tenant",

    reported_by:
      "Faith Muthoni",

    assigned_worker:
      "Joseph Maina",

    service_provider:
      "Kaskazi",

    created_at:
      "2026-08-24",

    scheduled_at:
      "2026-08-26T11:00:00",
  },
];

export default function Maintenance() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
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

  const filteredMaintenance =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return mockMaintenance.filter(
        (item) => {
          const matchesSearch =
            !keyword ||
            item.ticket_number
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.title
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.organization
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.property
              .toLowerCase()
              .includes(
                keyword
              ) ||
            item.reported_by
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesStatus =
            statusFilter === "all" ||
            item.status ===
              statusFilter;

          const matchesPriority =
            priorityFilter === "all" ||
            item.priority ===
              priorityFilter;

          const matchesCategory =
            categoryFilter === "all" ||
            item.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesCategory
          );
        }
      );
    }, [
      search,
      statusFilter,
      priorityFilter,
      categoryFilter,
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
        filteredMaintenance.length /
          perPage
      )
    );

  const startIndex =
    (page - 1) *
    perPage;

  const paginatedMaintenance =
    filteredMaintenance.slice(
      startIndex,
      startIndex +
        perPage
    );

  /*
   * =====================================================
   * SUMMARY
   * =====================================================
   */

  const totalRequests =
    mockMaintenance.length;

  const openRequests =
    mockMaintenance.filter(
      (item) =>
        [
          "open",
          "under_review",
          "approved",
        ].includes(
          item.status
        )
    ).length;

  const activeRequests =
    mockMaintenance.filter(
      (item) =>
        [
          "assigned",
          "in_progress",
          "awaiting_approval",
        ].includes(
          item.status
        )
    ).length;

  const completedRequests =
    mockMaintenance.filter(
      (item) =>
        item.status ===
        "completed"
    ).length;

  /*
   * =====================================================
   * RESET FILTERS
   * =====================================================
   */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
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
            Maintenance Operations
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Maintenance
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor maintenance requests
            across UNIT organizations,
            properties and units, including
            Kaskazi worker assignments and
            job progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "Maintenance reports"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <Wrench
            size={18}
          />

          Maintenance Report
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Wrench}
          label="Requests"
          value={
            totalRequests
          }
          helper="Total maintenance tickets"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Open Requests"
          value={
            openRequests
          }
          helper="Awaiting action"
        />

        <SummaryCard
          icon={Clock3}
          label="Active Jobs"
          value={
            activeRequests
          }
          helper="Assigned or in progress"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={
            completedRequests
          }
          helper="Completed maintenance work"
        />
      </div>

      {/* =================================================
          OPERATIONS OVERVIEW
      ================================================= */}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* ACTIVE STATUS */}

        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Maintenance Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ticket distribution by
                operational status.
              </p>
            </div>

            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  `${Colors.primary}12`,
              }}
            >
              <Wrench
                size={22}
                color={
                  Colors.primary
                }
              />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatusMiniCard
              title="Open"
              value={
                mockMaintenance.filter(
                  (item) =>
                    item.status ===
                    "open"
                ).length
              }
            />

            <StatusMiniCard
              title="Under Review"
              value={
                mockMaintenance.filter(
                  (item) =>
                    item.status ===
                    "under_review"
                ).length
              }
            />

            <StatusMiniCard
              title="Assigned"
              value={
                mockMaintenance.filter(
                  (item) =>
                    item.status ===
                    "assigned"
                ).length
              }
            />

            <StatusMiniCard
              title="In Progress"
              value={
                mockMaintenance.filter(
                  (item) =>
                    item.status ===
                    "in_progress"
                ).length
              }
            />
          </div>
        </div>

        {/* KASKAZI */}

        <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
          <div
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full"
            style={{
              backgroundColor:
                `${Colors.primary}08`,
            }}
          />

          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                `${Colors.primary}12`,
            }}
          >
            <ShieldCheck
              size={26}
              color={
                Colors.primary
              }
            />
          </div>

          <h2 className="relative mt-5 text-xl font-black text-slate-900">
            Kaskazi Jobs
          </h2>

          <p className="relative mt-2 text-sm leading-6 text-slate-500">
            Maintenance requests currently
            linked to Kaskazi workers.
          </p>

          <p className="relative mt-6 text-4xl font-black text-slate-900">
            {
              mockMaintenance.filter(
                (item) =>
                  item.service_provider ===
                  "Kaskazi"
              ).length
            }
          </p>

          <p
            className="relative mt-2 text-sm font-bold"
            style={{
              color:
                Colors.primary,
            }}
          >
            External maintenance jobs
          </p>
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
              placeholder="Search ticket, property, organization or reporter..."
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

              <option value="open">
                Open
              </option>

              <option value="under_review">
                Under Review
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="published_to_kaskazi">
                Published to Kaskazi
              </option>

              <option value="assigned">
                Assigned
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="awaiting_approval">
                Awaiting Approval
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="closed">
                Closed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* PRIORITY */}

          <select
            value={
              priorityFilter
            }
            onChange={(
              event
            ) => {
              setPriorityFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
          >
            <option value="all">
              All priorities
            </option>

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

            <option value="urgent">
              Urgent
            </option>

            <option value="emergency">
              Emergency
            </option>
          </select>

          {/* CATEGORY */}

          <select
            value={
              categoryFilter
            }
            onChange={(
              event
            ) => {
              setCategoryFilter(
                event.target.value
              );

              setPage(1);
            }}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
          >
            <option value="all">
              All categories
            </option>

            <option value="plumbing">
              Plumbing
            </option>

            <option value="electrical">
              Electrical
            </option>

            <option value="carpentry">
              Carpentry
            </option>

            <option value="painting">
              Painting
            </option>

            <option value="cleaning">
              Cleaning
            </option>

            <option value="hvac">
              HVAC
            </option>

            <option value="security">
              Security
            </option>

            <option value="appliance">
              Appliance
            </option>

            <option value="roofing">
              Roofing
            </option>

            <option value="landscaping">
              Landscaping
            </option>

            <option value="general">
              General
            </option>

            <option value="other">
              Other
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
          MAINTENANCE TABLE
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Maintenance Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredMaintenance.length
              }{" "}
              request
              {filteredMaintenance.length ===
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
            Export Maintenance
          </button>
        </div>

        {/* =================================================
            DESKTOP
        ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <TableHead>
                  Request
                </TableHead>

                <TableHead>
                  Property
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Priority
                </TableHead>

                <TableHead>
                  Reported By
                </TableHead>

                <TableHead>
                  Worker
                </TableHead>

                <TableHead>
                  Schedule
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Created
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedMaintenance.map(
                (
                  item
                ) => (
                  <tr
                    key={
                      item.id
                    }
                    className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0"
                  >
                    {/* REQUEST */}

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            backgroundColor:
                              `${Colors.primary}12`,
                          }}
                        >
                          <Wrench
                            size={20}
                            color={
                              Colors.primary
                            }
                          />
                        </div>

                        <div>
                          <p className="max-w-[250px] font-bold text-slate-800">
                            {
                              item.title
                            }
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-400">
                            {
                              item.ticket_number
                            }
                          </p>

                          <p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
                            {
                              item.description
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PROPERTY */}

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <Building2
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {
                              item.property
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              item.organization
                            }
                          </p>

                          {(item.building ||
                            item.unit) && (
                            <p className="mt-1 text-xs text-slate-400">
                              {item.building ||
                                ""}
                              {item.building &&
                              item.unit
                                ? " · "
                                : ""}
                              {item.unit ||
                                ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-5">
                      <CategoryBadge
                        category={
                          item.category
                        }
                      />
                    </td>

                    {/* PRIORITY */}

                    <td className="px-6 py-5">
                      <PriorityBadge
                        priority={
                          item.priority
                        }
                      />
                    </td>

                    {/* REPORTER */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {
                          item.reported_by
                        }
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-400">
                        {
                          item.source
                        }
                      </p>
                    </td>

                    {/* WORKER */}

                    <td className="px-6 py-5">
                      {item.assigned_worker ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <Users
                              size={15}
                              className="text-slate-400"
                            />

                            <span className="text-sm font-semibold text-slate-700">
                              {
                                item.assigned_worker
                              }
                            </span>
                          </div>

                          {item.service_provider && (
                            <span
                              className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black"
                              style={{
                                color:
                                  Colors.primary,
                                backgroundColor:
                                  `${Colors.primary}10`,
                              }}
                            >
                              {
                                item.service_provider
                              }
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* SCHEDULE */}

                    <td className="px-6 py-5">
                      {item.scheduled_at ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={14}
                              className="text-slate-400"
                            />

                            <span className="text-sm text-slate-600">
                              {formatDateTime(
                                item.scheduled_at,
                                "date"
                              )}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <Clock3
                              size={14}
                              className="text-slate-400"
                            />

                            <span className="text-xs text-slate-400">
                              {formatDateTime(
                                item.scheduled_at,
                                "time"
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not scheduled
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <MaintenanceStatus
                        status={
                          item.status
                        }
                      />
                    </td>

                    {/* CREATED */}

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDate(
                        item.created_at
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "View maintenance",
                              item.id
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

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedMaintenance.map(
            (
              item
            ) => (
              <div
                key={
                  item.id
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
                    <Wrench
                      size={21}
                      color={
                        Colors.primary
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800">
                      {
                        item.title
                      }
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {
                        item.ticket_number
                      }
                    </p>
                  </div>

                  <PriorityBadge
                    priority={
                      item.priority
                    }
                  />
                </div>

                <div className="mt-4">
                  <MaintenanceStatus
                    status={
                      item.status
                    }
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MobileField
                    label="Property"
                    value={
                      item.property
                    }
                  />

                  <MobileField
                    label="Organization"
                    value={
                      item.organization
                    }
                  />

                  <MobileField
                    label="Category"
                    value={
                      formatText(
                        item.category
                      )
                    }
                  />

                  <MobileField
                    label="Reported By"
                    value={
                      item.reported_by
                    }
                  />

                  <MobileField
                    label="Worker"
                    value={
                      item.assigned_worker ||
                      "Not assigned"
                    }
                  />

                  <MobileField
                    label="Created"
                    value={
                      formatDate(
                        item.created_at
                      )
                    }
                  />
                </div>

                {item.service_provider ===
                  "Kaskazi" && (
                  <div
                    className="mt-5 rounded-2xl p-4"
                    style={{
                      backgroundColor:
                        `${Colors.primary}08`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        size={17}
                        color={
                          Colors.primary
                        }
                      />

                      <p
                        className="text-sm font-bold"
                        style={{
                          color:
                            Colors.primary,
                        }}
                      >
                        Kaskazi Job
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      This maintenance request
                      is linked to a Kaskazi
                      service provider.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
                >
                  <Eye
                    size={17}
                  />

                  View Maintenance
                </button>
              </div>
            )
          )}
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {paginatedMaintenance.length ===
          0 && (
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{
                backgroundColor:
                  `${Colors.primary}10`,
              }}
            >
              <Wrench
                size={34}
                color={
                  Colors.primary
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No maintenance requests found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing the search,
              status, priority or category.
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

        {filteredMaintenance.length >
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
                  filteredMaintenance.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredMaintenance.length
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
 * MINI STATUS CARD
 * =====================================================
 */

function StatusMiniCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-400">
        {title}
      </p>

      <p
        className="mt-2 text-2xl font-black"
        style={{
          color:
            Colors.primary,
        }}
      >
        {value}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * MAINTENANCE STATUS
 * =====================================================
 */

function MaintenanceStatus({
  status,
}) {
  const normalized =
    String(
      status ||
      ""
    ).toLowerCase();

  const config = {
    open:
      "bg-orange-50 text-orange-600",

    under_review:
      "bg-amber-50 text-amber-600",

    approved:
      "bg-cyan-50 text-cyan-600",

    published_to_kaskazi:
      "bg-purple-50 text-purple-600",

    assigned:
      "bg-indigo-50 text-indigo-600",

    in_progress:
      "bg-blue-50 text-blue-600",

    awaiting_approval:
      "bg-yellow-50 text-yellow-700",

    completed:
      "bg-emerald-50 text-emerald-600",

    closed:
      "bg-slate-100 text-slate-600",

    cancelled:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1.5
        text-xs font-bold
        ${
          config[
            normalized
          ] ||
          "bg-slate-100 text-slate-500"
        }
      `}
    >
      {formatText(
        status
      )}
    </span>
  );
}

/*
 * =====================================================
 * PRIORITY
 * =====================================================
 */

function PriorityBadge({
  priority,
}) {
  const normalized =
    String(
      priority ||
      ""
    ).toLowerCase();

  const config = {
    low:
      "bg-slate-100 text-slate-500",

    medium:
      "bg-blue-50 text-blue-600",

    high:
      "bg-orange-50 text-orange-600",

    urgent:
      "bg-red-50 text-red-600",

    emergency:
      "bg-red-600 text-white",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1.5
        text-xs font-bold
        ${
          config[
            normalized
          ] ||
          "bg-slate-100 text-slate-500"
        }
      `}
    >
      {formatText(
        priority
      )}
    </span>
  );
}

/*
 * =====================================================
 * CATEGORY
 * =====================================================
 */

function CategoryBadge({
  category,
}) {
  return (
    <span
      className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        backgroundColor:
          `${Colors.primary}10`,
        color:
          Colors.primary,
      }}
    >
      {formatText(
        category
      )}
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
 * FORMAT TEXT
 * =====================================================
 */

function formatText(
  value
) {
  if (!value) {
    return "—";
  }

  return String(
    value
  )
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/*
 * =====================================================
 * FORMAT DATE
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
 * DATE TIME
 * =====================================================
 */

function formatDateTime(
  value,
  type
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    type ===
    "time"
  ) {
    return date.toLocaleTimeString(
      "en-KE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return date.toLocaleDateString(
    "en-KE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}