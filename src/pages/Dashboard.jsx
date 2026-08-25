import {
  ArrowRight,
  Building2,
  CreditCard,
  House,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import StatCard from "../components/StatCard";
import Colors from "../constants/colors";

const organizations = [
  {
    id: 1,
    name: "Sammy Prop Limited",
    owner: "Samuel Kamau",
    properties: 8,
    units: 74,
    plan: "Growth",
    status: "Active",
  },
  {
    id: 2,
    name: "Green Homes Ltd",
    owner: "Mary Wanjiku",
    properties: 4,
    units: 38,
    plan: "Starter",
    status: "Trial",
  },
  {
    id: 3,
    name: "Prime Estate Managers",
    owner: "Kevin Mutua",
    properties: 15,
    units: 190,
    plan: "Professional",
    status: "Active",
  },
];

const maintenance = [
  {
    id: 1,
    ticket: "MNT-4-BE00DE397E",
    property:
      "Meru Morning Apartments",
    title:
      "Kitchen sink is leaking",
    status:
      "In Progress",
  },
  {
    id: 2,
    ticket: "MNT-7-7821AF",
    property:
      "Green View Apartments",
    title:
      "Electrical socket issue",
    status:
      "Open",
  },
];

export default function Dashboard() {
  const navigate =
    useNavigate();

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-sm font-bold"
            style={{
              color:
                Colors.primary,
            }}
          >
            UNIT Admin
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor organizations,
            properties, users,
            subscriptions and platform
            activity across UNIT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-medium text-slate-400">
              Platform Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-sm font-bold text-slate-700">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Organizations"
          value="24"
          description="+3 this month"
          icon={Building2}
        />

        <StatCard
          title="Properties"
          value="128"
          description="+12 this month"
          icon={House}
        />

        <StatCard
          title="Active Users"
          value="486"
          description="+34 this month"
          icon={Users}
        />

        <StatCard
          title="Active Subscriptions"
          value="19"
          description="79% conversion"
          icon={CreditCard}
        />
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {/* ================= ORGANIZATIONS ================= */}

        <div className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recent Organizations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest organizations
                registered on UNIT.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/organizations"
                )
              }
              className="flex items-center gap-2 text-sm font-bold"
              style={{
                color:
                  Colors.primary,
              }}
            >
              View all

              <ArrowRight
                size={16}
              />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Organization
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Properties
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Units
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Plan
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {organizations.map(
                  (
                    organization
                  ) => (
                    <tr
                      key={
                        organization.id
                      }
                      className="border-b border-slate-50 transition hover:bg-slate-50/70 last:border-0"
                    >
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

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                organization.owner
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {
                          organization.properties
                        }
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                        {
                          organization.units
                        }
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                          {
                            organization.plan
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`
                            rounded-full
                            px-3 py-1.5
                            text-xs font-bold
                            ${
                              organization.status ===
                              "Active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-600"
                            }
                          `}
                        >
                          {
                            organization.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SUBSCRIPTION ================= */}

        <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
          <div
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full"
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
              color:
                Colors.primary,
            }}
          >
            <CreditCard
              size={26}
            />
          </div>

          <h2 className="relative mt-5 text-xl font-black text-slate-900">
            Subscription Revenue
          </h2>

          <p className="relative mt-1 text-sm leading-6 text-slate-500">
            Estimated recurring
            revenue from active
            organization plans.
          </p>

          <div className="relative mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Monthly Revenue
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              KES 184,500
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                <TrendingUp
                  size={15}
                  className="text-emerald-600"
                />
              </div>

              <p className="text-sm font-bold text-emerald-600">
                +12.5% this month
              </p>
            </div>
          </div>

          <div className="relative mt-7 space-y-3">
            <PlanRow
              name="Starter"
              count={8}
            />

            <PlanRow
              name="Growth"
              count={7}
            />

            <PlanRow
              name="Professional"
              count={4}
            />
          </div>

          <button
            onClick={() =>
              navigate(
                "/subscriptions"
              )
            }
            className="relative mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{
              backgroundColor:
                Colors.primary,
            }}
          >
            Manage Subscriptions

            <ArrowRight
              size={17}
            />
          </button>
        </div>
      </div>

      {/* =================================================
          MAINTENANCE
      ================================================= */}

      <div className="mt-8 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Recent Maintenance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest maintenance
              requests across UNIT.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
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

            <button
              onClick={() =>
                navigate(
                  "/maintenance"
                )
              }
              className="hidden items-center gap-2 text-sm font-bold sm:flex"
              style={{
                color:
                  Colors.primary,
              }}
            >
              View all

              <ArrowRight
                size={16}
              />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {maintenance.map(
            (
              item
            ) => (
              <div
                key={
                  item.id
                }
                className="flex flex-col gap-4 p-6 transition hover:bg-slate-50/60 sm:flex-row sm:items-center"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor:
                      `${Colors.primary}10`,
                  }}
                >
                  <Wrench
                    size={20}
                    color={
                      Colors.primary
                    }
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-800">
                    {
                      item.title
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.ticket}
                    {" · "}
                    {item.property}
                  </p>
                </div>

                <MaintenanceStatus
                  status={
                    item.status
                  }
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * PLAN ROW
 * =====================================================
 */

function PlanRow({
  name,
  count,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5">
      <div>
        <span className="text-sm font-semibold text-slate-600">
          {name}
        </span>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Active organizations
        </p>
      </div>

      <span
        className="flex h-8 min-w-8 items-center justify-center rounded-xl px-2 text-sm font-black"
        style={{
          backgroundColor:
            `${Colors.primary}12`,
          color:
            Colors.primary,
        }}
      >
        {count}
      </span>
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

  let className =
    "bg-slate-100 text-slate-600";

  if (
    normalized ===
    "in progress"
  ) {
    className =
      "bg-blue-50 text-blue-600";
  }

  if (
    normalized ===
    "open"
  ) {
    className =
      "bg-orange-50 text-orange-600";
  }

  if (
    normalized ===
    "completed"
  ) {
    className =
      "bg-emerald-50 text-emerald-600";
  }

  if (
    normalized ===
    "cancelled"
  ) {
    className =
      "bg-red-50 text-red-600";
  }

  return (
    <span
      className={`
        self-start rounded-full
        px-3 py-1.5
        text-xs font-bold
        ${className}
      `}
    >
      {status}
    </span>
  );
}