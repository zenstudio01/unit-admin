import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import Colors from "../constants/colors";

export default function Topbar({
  setSidebarOpen,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
      {/* LEFT */}

      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="font-bold text-slate-900">
            Administration
          </h2>

          <p className="text-xs text-slate-500">
            Manage the UNIT platform
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">
        {/* SEARCH */}

        <div className="hidden h-11 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-200 focus-within:bg-white md:flex">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search UNIT..."
            className="w-52 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <Bell size={20} />

          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* DIVIDER */}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* ADMIN PROFILE */}

        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 transition hover:bg-slate-50"
        >
          <div
            style={{
              backgroundColor:
                Colors.primary,
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-black text-white shadow-sm"
          >
            A
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-bold text-slate-800">
              Administrator
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Super Admin
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}