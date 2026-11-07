
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  House,
  DoorOpen,
  Users,
  Search,
  RefreshCw,
  Eye,
  X,
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Layers,
  Wallet,
  Wrench,
  CheckCircle2,
} from "lucide-react";

import Colors from "../constants/colors";
import {
  getAdminProperties,
  getAdminPropertyStats,
  getAdminPropertyDetail,
} from "../api/adminProperties";

const PRIMARY = Colors.primary || "#FF5722";
const PAGE_SIZE = 10;

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-KE");

const formatMoney = (value) =>
  `KES ${Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatLabel = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-600",
    occupied: "bg-blue-50 text-blue-700",
    available: "bg-emerald-50 text-emerald-700",
    under_maintenance: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color = PRIMARY, note }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon size={21} color={color} />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900 xl:text-3xl">
        {value}
      </p>
      {note && (
        <p className="mt-2 text-xs text-slate-400">{note}</p>
      )}
    </div>
  );
}

function OccupancyBar({ occupied, total }) {
  const rate = total > 0 ? (occupied / total) * 100 : 0;

  return (
    <div className="min-w-[120px]">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">
          {rate.toFixed(1)}%
        </span>
        <span className="text-slate-400">
          {occupied}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, rate)}%`,
            backgroundColor: PRIMARY,
          }}
        />
      </div>
    </div>
  );
}

function PropertyDetails({ propertyId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("units");
  const [unitSearch, setUnitSearch] = useState("");

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminPropertyDetail(propertyId);
      setDetail(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load property details."
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const property = detail?.property;

  const filteredUnits = (detail?.units || []).filter((unit) => {
    const query = unitSearch.trim().toLowerCase();
    return (
      !query ||
      [unit.name, unit.unit_code, unit.unit_type, unit.building]
        .some((value) =>
          String(value || "").toLowerCase().includes(query)
        )
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close property details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Property details"
        className="relative z-10 flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Property Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              UNIT property portfolio
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw
                size={28}
                color={PRIMARY}
                className="animate-spin"
              />
            </div>
          ) : !property ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error || "Property not found."}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${PRIMARY}12` }}
                >
                  <Building2 size={28} color={PRIMARY} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {property.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {property.property_code} ·{" "}
                    {formatLabel(property.property_type)}
                  </p>
                  <div className="mt-3">
                    <StatusBadge status={property.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Units", property.total_units],
                  ["Occupied", property.occupied_units],
                  ["Available", property.available_units],
                  ["Buildings", property.total_buildings],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-4 text-center"
                  >
                    <p className="text-2xl font-black text-slate-900">
                      {formatNumber(value)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <section className="rounded-2xl border border-slate-100 p-5">
                <h4 className="font-black text-slate-900">
                  Property Information
                </h4>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Organization", property.organization?.name],
                    ["Portfolio", property.portfolio?.name],
                    ["Property Type", formatLabel(property.property_type)],
                    ["Ownership Type", formatLabel(property.ownership_type)],
                    ["Location", [
                      property.address,
                      property.city,
                      property.county,
                    ].filter(Boolean).join(", ")],
                    ["Year Built", property.year_built || "—"],
                    ["Registered", formatDate(property.created_at)],
                    ["Occupancy", `${property.occupancy_rate}%`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                </div>

                {property.description && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">Description</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {property.description}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900">
                    Occupancy Overview
                  </h4>
                  <span
                    className="text-sm font-black"
                    style={{ color: PRIMARY }}
                  >
                    {property.occupancy_rate}%
                  </span>
                </div>

                <div className="mt-4">
                  <OccupancyBar
                    occupied={property.occupied_units}
                    total={property.total_units}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {property.occupied_units} occupied ·{" "}
                  {property.available_units} available ·{" "}
                  {property.maintenance_units} under maintenance
                </p>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="flex overflow-x-auto border-b border-slate-100">
                  {[
                    ["units", "Rental Units"],
                    ["buildings", "Buildings & Floors"],
                    ["owners", "Property Owners"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`whitespace-nowrap px-5 py-4 text-sm font-bold ${
                        tab === key
                          ? "border-b-2"
                          : "text-slate-400"
                      }`}
                      style={
                        tab === key
                          ? { color: PRIMARY, borderColor: PRIMARY }
                          : {}
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {tab === "units" && (
                  <div>
                    <div className="border-b border-slate-100 p-4">
                      <div className="relative">
                        <Search
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          value={unitSearch}
                          onChange={(e) => setUnitSearch(e.target.value)}
                          placeholder="Search units..."
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {filteredUnits.map((unit) => (
                        <div
                          key={unit.id}
                          className="flex flex-wrap items-center gap-3 p-4"
                        >
                          <div
                            className="rounded-xl p-3"
                            style={{ backgroundColor: `${PRIMARY}12` }}
                          >
                            <DoorOpen size={19} color={PRIMARY} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800">
                              {unit.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {unit.unit_code} · {unit.building} ·{" "}
                              {unit.floor}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-600">
                              {formatMoney(unit.monthly_rent)}/month
                            </p>
                          </div>

                          <StatusBadge status={unit.status} />
                        </div>
                      ))}

                      {filteredUnits.length === 0 && (
                        <p className="p-10 text-center text-sm text-slate-400">
                          No units found.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {tab === "buildings" && (
                  <div className="divide-y divide-slate-100">
                    {detail.buildings.map((building) => (
                      <div key={building.id} className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800">
                              {building.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {building.building_code} ·{" "}
                              {building.number_of_floors} floors
                            </p>
                          </div>
                          <StatusBadge status={building.status} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {building.floors.map((floor) => (
                            <span
                              key={floor.id}
                              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
                            >
                              {floor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {!detail.buildings.length && (
                      <p className="p-10 text-center text-sm text-slate-400">
                        No buildings found.
                      </p>
                    )}
                  </div>
                )}

                {tab === "owners" && (
                  <div className="divide-y divide-slate-100">
                    {detail.owners.map((owner) => (
                      <div
                        key={owner.id}
                        className="flex items-center gap-3 p-5"
                      >
                        <Users size={20} color={PRIMARY} />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800">
                            {owner.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {owner.email}
                          </p>
                        </div>

                        <span className="text-sm font-black text-slate-700">
                          {owner.ownership_percentage}%
                        </span>
                      </div>
                    ))}

                    {!detail.owners.length && (
                      <p className="p-10 text-center text-sm text-slate-400">
                        No active property ownership records found.
                      </p>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [list, summary] = await Promise.all([
          getAdminProperties({
            page,
            page_size: PAGE_SIZE,
            ...(search && { search }),
            ...(status && { status }),
            ...(type && { type }),
          }),
          getAdminPropertyStats(),
        ]);

        if (cancelled) return;

        setProperties(list.results || []);
        setCount(list.count || 0);
        setStats(summary);
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to load properties."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page, search, status, type, reloadKey]);

  const refresh = () => setReloadKey((prev) => prev + 1);

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold" style={{ color: PRIMARY }}>
            UNIT ADMINISTRATION
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Properties
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor properties, rental units, occupancy and ownership
            across all UNIT organizations.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={formatNumber(stats?.total_properties)}
          icon={Building2}
        />
        <StatCard
          title="Total Rental Units"
          value={formatNumber(stats?.total_units)}
          icon={DoorOpen}
          color="#2563EB"
        />
        <StatCard
          title="Occupied Units"
          value={formatNumber(stats?.occupied_units)}
          icon={Users}
          color="#059669"
          note={`${stats?.occupancy_rate || 0}% occupancy rate`}
        />
        <StatCard
          title="Available Units"
          value={formatNumber(stats?.available_units)}
          icon={House}
          color="#D97706"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Wallet size={21} color={PRIMARY} />
            <p className="text-sm font-bold text-slate-700">
              Monthly Rent Potential
            </p>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {formatMoney(stats?.monthly_rent_potential)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Sum of monthly rent across all registered units.
            This is not actual rent collected.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={21} color="#059669" />
            <p className="text-sm font-bold text-slate-700">
              Occupied Unit Rent
            </p>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {formatMoney(stats?.occupied_monthly_rent)}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Sum of listed monthly rent for occupied units,
            not verified payments.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Property Directory
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {formatNumber(count)} matching properties
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search properties..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="office">Office</option>
              <option value="mall">Mall</option>
              <option value="warehouse">Warehouse</option>
              <option value="hostel">Hostel</option>
              <option value="residential">Residential</option>
              <option value="retail">Retail</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
              <option value="mixed_use">Mixed Use</option>
              <option value="student_housing">Student Housing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-4">Property</th>
                <th className="px-5 py-4">Organization</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Units</th>
                <th className="px-5 py-4">Occupancy</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${PRIMARY}12` }}
                        >
                          <Building2 size={20} color={PRIMARY} />
                        </div>

                        <div>
                          <p className="font-bold text-slate-800">
                            {property.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {property.property_code} ·{" "}
                            {formatLabel(property.property_type)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {property.organization?.name}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {property.city}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {property.county}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {formatNumber(property.total_units)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {property.available_units} available
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <OccupancyBar
                        occupied={property.occupied_units}
                        total={property.total_units}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={property.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(property.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedId(property.id)}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold hover:bg-orange-50"
                        style={{ color: PRIMARY }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
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

          {!loading && !error && properties.length === 0 && (
            <div className="p-12 text-center">
              <Building2
                size={34}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No properties found.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} ·{" "}
            {formatNumber(count)} properties
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border border-slate-200 p-2.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {selectedId !== null && (
        <PropertyDetails
          propertyId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
