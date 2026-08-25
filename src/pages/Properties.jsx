import {
  Building2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Eye,
  Filter,
  House,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Colors from "../constants/colors";

const mockProperties = [
  {
    id: 1,
    name: "Meru Morning Apartments",
    code: "PROP-001",
    organization: "Sammy Prop Limited",
    type: "Apartment",
    location: "Makutano, Meru",
    buildings: 2,
    units: 24,
    occupied_units: 20,
    vacant_units: 4,
    managers: 2,
    status: "active",
    created_at: "2026-08-04",
  },

  {
    id: 2,
    name: "Green View Apartments",
    code: "PROP-002",
    organization: "Green Homes Limited",
    type: "Apartment",
    location: "Milimani, Nakuru",
    buildings: 1,
    units: 18,
    occupied_units: 16,
    vacant_units: 2,
    managers: 1,
    status: "active",
    created_at: "2026-08-11",
  },

  {
    id: 3,
    name: "Prime Business Centre",
    code: "PROP-003",
    organization: "Prime Estate Managers",
    type: "Commercial",
    location: "Westlands, Nairobi",
    buildings: 1,
    units: 35,
    occupied_units: 31,
    vacant_units: 4,
    managers: 3,
    status: "active",
    created_at: "2026-07-15",
  },

  {
    id: 4,
    name: "City Point Residences",
    code: "PROP-004",
    organization: "City Point Properties",
    type: "Mixed Use",
    location: "Thika Road, Nairobi",
    buildings: 3,
    units: 52,
    occupied_units: 38,
    vacant_units: 14,
    managers: 2,
    status: "inactive",
    created_at: "2026-06-28",
  },

  {
    id: 5,
    name: "North Ridge Villas",
    code: "PROP-005",
    organization: "North Ridge Property Group",
    type: "Residential",
    location: "Ruiru, Kiambu",
    buildings: 8,
    units: 8,
    occupied_units: 6,
    vacant_units: 2,
    managers: 1,
    status: "active",
    created_at: "2026-08-18",
  },

  {
    id: 6,
    name: "Sunset Court",
    code: "PROP-006",
    organization: "Sammy Prop Limited",
    type: "Apartment",
    location: "Kileleshwa, Nairobi",
    buildings: 2,
    units: 28,
    occupied_units: 27,
    vacant_units: 1,
    managers: 2,
    status: "active",
    created_at: "2026-08-20",
  },
];

export default function Properties() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const perPage = 5;

  /*
   * =====================================================
   * FILTERS
   * =====================================================
   */

  const filteredProperties =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return mockProperties.filter(
        (property) => {
          const matchesSearch =
            !keyword ||
            property.name
              .toLowerCase()
              .includes(
                keyword
              ) ||
            property.code
              .toLowerCase()
              .includes(
                keyword
              ) ||
            property.organization
              .toLowerCase()
              .includes(
                keyword
              ) ||
            property.location
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesType =
            typeFilter === "all" ||
            property.type
              .toLowerCase()
              .replace(/\s+/g, "_") ===
              typeFilter;

          const matchesStatus =
            statusFilter === "all" ||
            property.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      search,
      typeFilter,
      statusFilter,
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
        filteredProperties.length /
          perPage
      )
    );

  const startIndex =
    (page - 1) *
    perPage;

  const paginatedProperties =
    filteredProperties.slice(
      startIndex,
      startIndex +
        perPage
    );

  /*
   * =====================================================
   * SUMMARY
   * =====================================================
   */

  const totalProperties =
    mockProperties.length;

  const totalUnits =
    mockProperties.reduce(
      (
        total,
        property
      ) =>
        total +
        property.units,
      0
    );

  const occupiedUnits =
    mockProperties.reduce(
      (
        total,
        property
      ) =>
        total +
        property.occupied_units,
      0
    );

  const vacantUnits =
    mockProperties.reduce(
      (
        total,
        property
      ) =>
        total +
        property.vacant_units,
      0
    );

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
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
            Property Management
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Properties
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View all properties
            registered on UNIT and
            monitor their buildings,
            units, occupancy and
            managing organizations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "Add property"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <Plus size={18} />

          Add Property
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={House}
          label="Properties"
          value={
            totalProperties
          }
          helper="Registered properties"
        />

        <SummaryCard
          icon={DoorOpen}
          label="Total Units"
          value={
            totalUnits
          }
          helper="Across all properties"
        />

        <SummaryCard
          icon={Users}
          label="Occupied Units"
          value={
            occupiedUnits
          }
          helper="Currently occupied"
        />

        <SummaryCard
          icon={DoorOpen}
          label="Vacant Units"
          value={
            vacantUnits
          }
          helper="Available units"
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
              placeholder="Search property, organization, location or code..."
              className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* TYPE */}

          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="hidden text-slate-400 sm:block"
            />

            <select
              value={
                typeFilter
              }
              onChange={(
                event
              ) => {
                setTypeFilter(
                  event.target.value
                );

                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
            >
              <option value="all">
                All property types
              </option>

              <option value="apartment">
                Apartment
              </option>

              <option value="residential">
                Residential
              </option>

              <option value="commercial">
                Commercial
              </option>

              <option value="mixed_use">
                Mixed Use
              </option>
            </select>
          </div>

          {/* STATUS */}

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

            <option value="inactive">
              Inactive
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
              Registered Properties
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredProperties.length
              }{" "}
              propert
              {filteredProperties.length ===
              1
                ? "y"
                : "ies"}{" "}
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
            Export Properties
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
                  Property
                </TableHead>

                <TableHead>
                  Organization
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead>
                  Buildings
                </TableHead>

                <TableHead>
                  Units
                </TableHead>

                <TableHead>
                  Occupancy
                </TableHead>

                <TableHead>
                  Managers
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Added
                </TableHead>

                <TableHead>
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedProperties.map(
                (
                  property
                ) => {
                  const occupancy =
                    property.units > 0
                      ? Math.round(
                          (
                            property.occupied_units /
                            property.units
                          ) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={
                        property.id
                      }
                      className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0"
                    >
                      {/* PROPERTY */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor:
                                `${Colors.primary}12`,
                            }}
                          >
                            <House
                              size={20}
                              color={
                                Colors.primary
                              }
                            />
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {
                                property.name
                              }
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                              <MapPin
                                size={12}
                                className="text-slate-400"
                              />

                              <p className="text-xs text-slate-400">
                                {
                                  property.location
                                }
                              </p>
                            </div>

                            <p className="mt-1 text-[10px] font-semibold text-slate-300">
                              {
                                property.code
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ORGANIZATION */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Building2
                            size={15}
                            className="text-slate-400"
                          />

                          <p className="text-sm font-semibold text-slate-700">
                            {
                              property.organization
                            }
                          </p>
                        </div>
                      </td>

                      {/* TYPE */}

                      <td className="px-6 py-5">
                        <span
                          className="inline-flex rounded-full px-3 py-1.5 text-xs font-bold"
                          style={{
                            color:
                              Colors.primary,
                            backgroundColor:
                              `${Colors.primary}10`,
                          }}
                        >
                          {
                            property.type
                          }
                        </span>
                      </td>

                      {/* BUILDINGS */}

                      <td className="px-6 py-5 text-sm font-bold text-slate-700">
                        {
                          property.buildings
                        }
                      </td>

                      {/* UNITS */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {
                            property.units
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            property.vacant_units
                          }{" "}
                          vacant
                        </p>
                      </td>

                      {/* OCCUPANCY */}

                      <td className="px-6 py-5">
                        <div className="w-32">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">
                              {
                                occupancy
                              }
                              %
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {
                                property.occupied_units
                              }
                              /
                              {
                                property.units
                              }
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width:
                                  `${occupancy}%`,
                                backgroundColor:
                                  occupancy >=
                                  90
                                    ? "#16A34A"
                                    : occupancy >=
                                      70
                                    ? Colors.primary
                                    : "#F59E0B",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* MANAGERS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Users
                            size={15}
                            className="text-slate-400"
                          />

                          <span className="text-sm font-semibold text-slate-600">
                            {
                              property.managers
                            }
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <PropertyStatus
                          status={
                            property.status
                          }
                        />
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {formatDate(
                          property.created_at
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              console.log(
                                "View property",
                                property.id
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
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedProperties.map(
            (
              property
            ) => {
              const occupancy =
                property.units >
                0
                  ? Math.round(
                      (
                        property.occupied_units /
                        property.units
                      ) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={
                    property.id
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
                      <House
                        size={21}
                        color={
                          Colors.primary
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-800">
                        {
                          property.name
                        }
                      </p>

                      <div className="mt-1 flex items-center gap-1">
                        <MapPin
                          size={12}
                          className="text-slate-400"
                        />

                        <p className="truncate text-xs text-slate-400">
                          {
                            property.location
                          }
                        </p>
                      </div>
                    </div>

                    <PropertyStatus
                      status={
                        property.status
                      }
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <MobileField
                      label="Organization"
                      value={
                        property.organization
                      }
                    />

                    <MobileField
                      label="Type"
                      value={
                        property.type
                      }
                    />

                    <MobileField
                      label="Buildings"
                      value={
                        property.buildings
                      }
                    />

                    <MobileField
                      label="Units"
                      value={
                        property.units
                      }
                    />

                    <MobileField
                      label="Occupied"
                      value={
                        property.occupied_units
                      }
                    />

                    <MobileField
                      label="Vacant"
                      value={
                        property.vacant_units
                      }
                    />
                  </div>

                  {/* OCCUPANCY */}

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Occupancy
                      </span>

                      <span
                        className="text-sm font-black"
                        style={{
                          color:
                            Colors.primary,
                        }}
                      >
                        {
                          occupancy
                        }
                        %
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:
                            `${occupancy}%`,
                          backgroundColor:
                            Colors.primary,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
                  >
                    <Eye
                      size={17}
                    />

                    View Property
                  </button>
                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {paginatedProperties.length ===
          0 && (
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{
                backgroundColor:
                  `${Colors.primary}10`,
              }}
            >
              <House
                size={34}
                color={
                  Colors.primary
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No properties found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing the
              property type, status
              or search term.
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

        {filteredProperties.length >
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
                  filteredProperties.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredProperties.length
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
 * PROPERTY STATUS
 * =====================================================
 */

function PropertyStatus({
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
    "inactive"
  ) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
        Inactive
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