import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
  X,
  House,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";


import Colors from "../constants/colors";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: Building2,
  },
  {
    name: "Users",
    path: "/users",
    icon: Users,
  },
  {
    name: "Properties",
    path: "/properties",
    icon: House,
  },
  {
    name: "Subscriptions",
    path: "/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  open,
  setOpen,
}) {
  return (
    <>
      {/* MOBILE OVERLAY */}

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        style={{
          backgroundColor:
            Colors.primary,
        }}
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72
          flex-col
          text-white
          shadow-xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* DECORATIVE BACKGROUND */}

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10"
        />

        <div
          className="pointer-events-none absolute left-6 top-40 h-28 w-28 rounded-full bg-white/5"
        />

        {/* LOGO */}

        <div className="relative flex h-24 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Building2
                size={25}
                color={
                  Colors.primary
                }
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                UNIT
              </h1>

              <p className="mt-0.5 text-xs font-medium text-white/65">
                Admin Console
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* MENU LABEL */}

        <div className="relative px-6 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            Management
          </p>
        </div>

        {/* NAVIGATION */}

        <nav className="relative flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          {menuItems.map(
            ({
              name,
              path,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={
                  path === "/"
                }
                onClick={() =>
                  setOpen(false)
                }
                className={({
                  isActive,
                }) =>
                  `
                    group
                    flex items-center
                    gap-3
                    rounded-2xl
                    px-4 py-3.5
                    text-sm font-semibold
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-white shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }
                  `
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    <div
                      className={`
                        flex h-9 w-9
                        items-center
                        justify-center
                        rounded-xl
                        transition
                        ${
                          isActive
                            ? "bg-orange-50"
                            : "bg-white/10 group-hover:bg-white/15"
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        color={
                          isActive
                            ? Colors.primary
                            : "#FFFFFF"
                        }
                      />
                    </div>

                    <span
                      style={
                        isActive
                          ? {
                              color:
                                Colors.primary,
                            }
                          : {}
                      }
                    >
                      {name}
                    </span>
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* BOTTOM CARD */}

        <div className="relative px-4 pb-5">
          <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Building2
                  size={19}
                  color="#FFFFFF"
                />
              </div>

              <div>
                <p className="text-sm font-bold">
                  UNIT Platform
                </p>

                <p className="text-[11px] text-white/60">
                  Property Management
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-white/60">
              Manage organizations,
              properties, users,
              subscriptions and platform
              operations.
            </p>
          </div>

          <p className="mt-4 text-center text-[10px] text-white/40">
            UNIT Admin Console
          </p>
        </div>
      </aside>
    </>
  );
}