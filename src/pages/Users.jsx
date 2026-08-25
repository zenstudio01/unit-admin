import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  MoreVertical,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Colors from "../constants/colors";

const mockUsers = [
  {
    id: 1,
    full_name: "Samuel Kamau",
    email: "samuel@example.com",
    phone: "+254 712 345 678",
    role: "organization_owner",
    organization: "Sammy Prop Limited",
    status: "active",
    verified: true,
    joined_at: "2026-08-02",
  },

  {
    id: 2,
    full_name: "Mary Wanjiku",
    email: "mary@example.com",
    phone: "+254 722 556 712",
    role: "property_manager",
    organization: "Green Homes Limited",
    status: "active",
    verified: true,
    joined_at: "2026-08-11",
  },

  {
    id: 3,
    full_name: "Kevin Mutua",
    email: "kevin@example.com",
    phone: "+254 733 468 210",
    role: "accountant",
    organization: "Prime Estate Managers",
    status: "active",
    verified: false,
    joined_at: "2026-07-15",
  },

  {
    id: 4,
    full_name: "Jane Njeri",
    email: "jane@example.com",
    phone: "+254 710 498 760",
    role: "tenant",
    organization: "City Point Properties",
    status: "suspended",
    verified: true,
    joined_at: "2026-06-28",
  },

  {
    id: 5,
    full_name: "Brian Mwangi",
    email: "brian@example.com",
    phone: "+254 701 887 430",
    role: "caretaker",
    organization: "North Ridge Property Group",
    status: "active",
    verified: true,
    joined_at: "2026-08-18",
  },

  {
    id: 6,
    full_name: "Faith Muthoni",
    email: "faith@example.com",
    phone: "+254 719 324 786",
    role: "leasing_agent",
    organization: "Sammy Prop Limited",
    status: "active",
    verified: true,
    joined_at: "2026-08-20",
  },
];

export default function UsersPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
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
   * FILTER USERS
   * =====================================================
   */

  const filteredUsers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return mockUsers.filter(
        (user) => {
          const matchesSearch =
            !keyword ||
            user.full_name
              .toLowerCase()
              .includes(
                keyword
              ) ||
            user.email
              .toLowerCase()
              .includes(
                keyword
              ) ||
            user.phone
              .toLowerCase()
              .includes(
                keyword
              ) ||
            user.organization
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesRole =
            roleFilter === "all" ||
            user.role ===
              roleFilter;

          const matchesStatus =
            statusFilter === "all" ||
            user.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      search,
      roleFilter,
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
        filteredUsers.length /
          perPage
      )
    );

  const startIndex =
    (page - 1) *
    perPage;

  const paginatedUsers =
    filteredUsers.slice(
      startIndex,
      startIndex +
        perPage
    );

  /*
   * =====================================================
   * SUMMARY
   * =====================================================
   */

  const totalUsers =
    mockUsers.length;

  const activeUsers =
    mockUsers.filter(
      (user) =>
        user.status ===
        "active"
    ).length;

  const verifiedUsers =
    mockUsers.filter(
      (user) =>
        user.verified
    ).length;

  const managers =
    mockUsers.filter(
      (user) =>
        user.role ===
        "property_manager"
    ).length;

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
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
            User Management
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage users registered on
            UNIT, their roles,
            organizations, account
            status and verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              "Add user"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <UserPlus
            size={18}
          />

          Add User
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Total Users"
          value={
            totalUsers
          }
          helper="Registered accounts"
        />

        <SummaryCard
          icon={UserCheck}
          label="Active Users"
          value={
            activeUsers
          }
          helper="Currently active"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Verified Users"
          value={
            verifiedUsers
          }
          helper="Verified accounts"
        />

        <SummaryCard
          icon={Users}
          label="Property Managers"
          value={
            managers
          }
          helper="Manager accounts"
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
              placeholder="Search name, email, phone or organization..."
              className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* ROLE */}

          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="hidden text-slate-400 sm:block"
            />

            <select
              value={
                roleFilter
              }
              onChange={(
                event
              ) => {
                setRoleFilter(
                  event.target.value
                );

                setPage(1);
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none"
            >
              <option value="all">
                All roles
              </option>

              <option value="organization_owner">
                Organization Owner
              </option>

              <option value="organization_admin">
                Organization Admin
              </option>

              <option value="property_manager">
                Property Manager
              </option>

              <option value="accountant">
                Accountant
              </option>

              <option value="landlord">
                Landlord
              </option>

              <option value="tenant">
                Tenant
              </option>

              <option value="investor">
                Investor
              </option>

              <option value="caretaker">
                Caretaker
              </option>

              <option value="leasing_agent">
                Leasing Agent
              </option>

              <option value="support_agent">
                Support Agent
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

            <option value="suspended">
              Suspended
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
          USERS LIST
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredUsers.length
              }{" "}
              user
              {filteredUsers.length ===
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
            Export Users
          </button>
        </div>

        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <TableHead>
                  User
                </TableHead>

                <TableHead>
                  Organization
                </TableHead>

                <TableHead>
                  Role
                </TableHead>

                <TableHead>
                  Verification
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
              {paginatedUsers.map(
                (
                  user
                ) => (
                  <tr
                    key={
                      user.id
                    }
                    className="border-b border-slate-50 transition hover:bg-slate-50/60 last:border-0"
                  >
                    {/* USER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={
                            user.full_name
                          }
                        />

                        <div>
                          <p className="font-bold text-slate-800">
                            {
                              user.full_name
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              user.email
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              user.phone
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ORGANIZATION */}

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {
                          user.organization
                        }
                      </p>
                    </td>

                    {/* ROLE */}

                    <td className="px-6 py-5">
                      <RoleBadge
                        role={
                          user.role
                        }
                      />
                    </td>

                    {/* VERIFIED */}

                    <td className="px-6 py-5">
                      {user.verified ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                          <ShieldCheck
                            size={17}
                          />

                          Verified
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-slate-400">
                          Not verified
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <UserStatusBadge
                        status={
                          user.status
                        }
                      />
                    </td>

                    {/* JOINED */}

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDate(
                        user.joined_at
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "View user",
                              user.id
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
          {paginatedUsers.map(
            (
              user
            ) => (
              <div
                key={
                  user.id
                }
                className="p-5"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={
                      user.full_name
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-800">
                      {
                        user.full_name
                      }
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {
                        user.email
                      }
                    </p>
                  </div>

                  <UserStatusBadge
                    status={
                      user.status
                    }
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MobileField
                    label="Organization"
                    value={
                      user.organization
                    }
                  />

                  <MobileField
                    label="Role"
                    value={
                      formatRole(
                        user.role
                      )
                    }
                  />

                  <MobileField
                    label="Phone"
                    value={
                      user.phone
                    }
                  />

                  <MobileField
                    label="Verification"
                    value={
                      user.verified
                        ? "Verified"
                        : "Not verified"
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

                  View User
                </button>
              </div>
            )
          )}
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {paginatedUsers.length ===
          0 && (
          <div className="px-6 py-20 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{
                backgroundColor:
                  `${Colors.primary}10`,
              }}
            >
              <Users
                size={34}
                color={
                  Colors.primary
                }
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-800">
              No users found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Try changing your
              search or filters.
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

        {filteredUsers.length >
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
                  filteredUsers.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredUsers.length
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
 * AVATAR
 * =====================================================
 */

function UserAvatar({
  name,
}) {
  const initials =
    String(
      name ||
      "U"
    )
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .toUpperCase();

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black"
      style={{
        backgroundColor:
          `${Colors.primary}12`,
        color:
          Colors.primary,
      }}
    >
      {initials}
    </div>
  );
}

/*
 * =====================================================
 * ROLE BADGE
 * =====================================================
 */

function RoleBadge({
  role,
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
      {formatRole(
        role
      )}
    </span>
  );
}

/*
 * =====================================================
 * USER STATUS
 * =====================================================
 */

function UserStatusBadge({
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
    "suspended"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
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
        {value || "—"}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * FORMAT ROLE
 * =====================================================
 */

function formatRole(
  role
) {
  if (!role) {
    return "No Role";
  }

  return String(
    role
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