import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        setOpen={
          setSidebarOpen
        }
      />

      <div className="lg:pl-72">
        <Topbar
          setSidebarOpen={
            setSidebarOpen
          }
        />

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}