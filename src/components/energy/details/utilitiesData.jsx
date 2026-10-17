import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Droplets,
  Factory,
  Flame,
  Gauge,
  Search,
  Settings2,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const MAX_VISIBLE_DEPARTMENTS = 22;

const COLORS = [
  {
    accent: "#22d3ee",
    soft: "rgba(34,211,238,0.09)",
    border: "rgba(34,211,238,0.24)",
  },
  {
    accent: "#a78bfa",
    soft: "rgba(167,139,250,0.09)",
    border: "rgba(167,139,250,0.24)",
  },
  {
    accent: "#34d399",
    soft: "rgba(52,211,153,0.09)",
    border: "rgba(52,211,153,0.24)",
  },
  {
    accent: "#fbbf24",
    soft: "rgba(251,191,36,0.09)",
    border: "rgba(251,191,36,0.24)",
  },
  {
    accent: "#fb7185",
    soft: "rgba(251,113,133,0.09)",
    border: "rgba(251,113,133,0.24)",
  },
  {
    accent: "#60a5fa",
    soft: "rgba(96,165,250,0.09)",
    border: "rgba(96,165,250,0.24)",
  },
  {
    accent: "#2dd4bf",
    soft: "rgba(45,212,191,0.09)",
    border: "rgba(45,212,191,0.24)",
  },
];

const getDepartmentIcon = (name) => {
  const value = String(name ?? "").toLowerCase();

  if (/steam|boiler|gas|heater|thermal/.test(value)) return Flame;
  if (/water|pump|cooling|\bro\b/.test(value)) return Droplets;
  if (/air|compressor|hvac|vent/.test(value)) return Wind;
  if (/power|electric|electrical|\bdbs\b/.test(value)) return Zap;
  if (/meter|load/.test(value)) return Gauge;
  if (/utility|utilities/.test(value)) return Settings2;

  return Factory;
};

const formatName = (name) =>
  String(name ?? "Not Defined")
    .replace(/[_-]+/g, " ")
    .trim() || "Not Defined";

const UtilitiesData = ({ data, division }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Build department cards from the existing API data.
  const departments = useMemo(() => {
    const source = data?.departments;
    const meterData = source?.data ?? {};

    const names = Array.isArray(source?.type)
      ? source.type
      : Object.keys(meterData);

    const uniqueNames = [
      ...new Set(
        names
          .filter(
            (name) =>
              name !== null && name !== undefined && String(name).trim() !== "",
          )
          .map(String),
      ),
    ];

    return uniqueNames.map((name, index) => {
      const meters = Array.isArray(meterData[name]) ? meterData[name] : [];

      return {
        name,
        meterCount: meters.length,
        Icon: getDepartmentIcon(name),
        color: COLORS[index % COLORS.length],
      };
    });
  }, [data]);

  // Show no more than 12 cards in the main panel.
  const visibleDepartments = useMemo(
    () => departments.slice(0, MAX_VISIBLE_DEPARTMENTS),
    [departments],
  );

  // The modal displays all departments and supports searching.
  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return departments;

    return departments.filter((department) =>
      formatName(department.name).toLowerCase().includes(query),
    );
  }, [departments, search]);

  // Show the modal button only when there are more than 12 departments.
  const hasMoreDepartments = departments.length > MAX_VISIBLE_DEPARTMENTS;

  const openDepartment = (name) => {
    const basePath = location.pathname.replace(/\/+$/, "");

    navigate(`${basePath}/${encodeURIComponent(name)}`);
    setIsOpen(false);
  };

  const openModal = () => {
    setSearch("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
  };

  return (
    <>
      <section
        className="
          flex h-full min-h-0 w-full min-w-0 flex-col
          overflow-hidden rounded-2xl
          border border-white/[0.08]
          bg-[#0a1118]/95
          p-3
          shadow-[0_15px_45px_rgba(0,0,0,0.16)]
          sm:p-4
        "
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300/80">
              <Building2 size={12} />
              Department explorer
            </p>

            <h2 className="mt-1.5 text-sm font-semibold text-white">
              Departments
            </h2>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Select a department to view its meters.
            </p>
          </div>

          <div className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-center">
            <p className="text-base font-semibold leading-5 tabular-nums text-white">
              {departments.length}
            </p>

            <p className="text-[9px] text-slate-500">Total</p>
          </div>
        </header>

        {/* Empty state */}
        {departments.length === 0 ? (
          <div className="mt-4 flex min-h-32 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-3 py-6 text-center cursor-pointer">
            <Activity size={20} className="text-slate-600" />

            <p className="mt-3 text-xs font-medium text-slate-400">
              No departments available
            </p>

            <p className="mt-1 text-[10px] text-slate-600">
              {division || data?.division || "This division"} has no department
              data.
            </p>
          </div>
        ) : (
          <>
            {/* Department cards */}
            <div
              className="
                mt-3 grid min-w-0 grid-cols-1 content-start gap-2
                sm:grid-cols-2
                xl:grid-cols-1
                2xl:grid-cols-2
              "
            >
              {visibleDepartments.map((department) => {
                const Icon = department.Icon;
                const color = department.color;

                return (
                  <button
                    key={department.name}
                    type="button"
                    onClick={() => openDepartment(department.name)}
                    title={`Open ${formatName(department.name)}`}
                    className="
                      group flex min-w-0 items-center gap-2
                      overflow-hidden rounded-xl border
                      bg-[#0b141d] p-2 text-left
                      transition-colors duration-200
                      hover:bg-white/[0.045]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-cyan-300/70 cursor-pointer
                    "
                    style={{ borderColor: color.border }}
                  >
                    {/* Icon */}
                    <span
                      className="
                        flex h-8 w-8 shrink-0 items-center
                        justify-center rounded-lg border
                      "
                      style={{
                        color: color.accent,
                        backgroundColor: color.soft,
                        borderColor: color.border,
                      }}
                    >
                      <Icon size={15} strokeWidth={1.8} />
                    </span>

                    {/* Department name and meter count */}
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate text-xs font-medium capitalize text-slate-100">
                        {formatName(department.name)}
                      </span>

                      <span className="mt-1 block text-[10px] text-slate-500">
                        {department.meterCount}{" "}
                        {department.meterCount === 1 ? "meter" : "meters"}
                      </span>
                    </span>

                    <ChevronRight
                      size={14}
                      className="
                        shrink-0 text-slate-600 transition-colors
                        group-hover:text-slate-300
                      "
                    />
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <footer className="mt-3 shrink-0 border-t border-white/[0.07] pt-3">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <p className="min-w-0 text-[10px] text-slate-500">
                  Showing {visibleDepartments.length} of {departments.length}
                </p>

                <span className="shrink-0 text-[10px] text-slate-600">
                  Departments
                </span>
              </div>

              {/* Button appears ONLY when count exceeds 12 */}
              {hasMoreDepartments && (
                <button
                  type="button"
                  onClick={openModal}
                  className="
                    mt-2.5 inline-flex w-full min-w-0 items-center
                    justify-center gap-2 rounded-xl
                    border border-cyan-300/20
                    bg-cyan-300/[0.08]
                    px-3 py-2.5
                    text-[11px] font-semibold text-cyan-200
                    transition-colors
                    hover:border-cyan-200/40
                    hover:bg-cyan-300/[0.13]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan-300/70
                  "
                >
                  All Departments
                  <ArrowUpRight size={13} />
                </button>
              )}
            </footer>
          </>
        )}
      </section>

      {/* All departments modal: only available when there are more than 12 */}
      {isOpen && hasMoreDepartments && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/75 p-3 backdrop-blur-sm
            sm:p-6
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="departments-modal-title"
            className="
              flex max-h-[88dvh] w-full max-w-4xl min-w-0
              flex-col overflow-hidden rounded-2xl
              border border-white/10 bg-[#080e14]
              shadow-[0_30px_100px_rgba(0,0,0,0.6)]
            "
          >
            {/* Modal header */}
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-300/80">
                  {division || data?.division || "Division"} overview
                </p>

                <h2
                  id="departments-modal-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  All Departments
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search and select a department to continue.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close departments"
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl border border-white/10
                  bg-white/[0.04] text-slate-400
                  transition-colors
                  hover:bg-white/[0.08] hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300/70
                "
              >
                <X size={17} />
              </button>
            </header>

            {/* Search */}
            <div className="shrink-0 border-b border-white/[0.06] p-4 sm:px-5">
              <label className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 focus-within:border-cyan-300/30">
                <Search size={16} className="shrink-0 text-slate-500" />

                <input
                  autoFocus
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search departments..."
                  aria-label="Search departments"
                  className="
                    w-full min-w-0 bg-transparent text-sm text-white
                    outline-none placeholder:text-slate-600
                  "
                />

                <span className="shrink-0 text-[10px] tabular-nums text-slate-500">
                  {filteredDepartments.length}
                </span>
              </label>
            </div>

            {/* Scrollable modal content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
              {filteredDepartments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                  <Search size={22} className="mx-auto text-slate-600" />

                  <p className="mt-3 text-sm text-slate-400">
                    No matching departments
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Try another search term.
                  </p>
                </div>
              ) : (
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDepartments.map((department) => {
                    const Icon = department.Icon;
                    const color = department.color;

                    return (
                      <button
                        key={department.name}
                        type="button"
                        onClick={() => openDepartment(department.name)}
                        title={`Open ${formatName(department.name)}`}
                        className="
                          group min-w-0 overflow-hidden rounded-xl
                          border bg-[#0b141d] p-4 text-left
                          transition-colors hover:bg-white/[0.045]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-cyan-300/70
                        "
                        style={{ borderColor: color.border }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className="
                              flex h-10 w-10 shrink-0 items-center
                              justify-center rounded-xl border
                            "
                            style={{
                              color: color.accent,
                              backgroundColor: color.soft,
                              borderColor: color.border,
                            }}
                          >
                            <Icon size={18} />
                          </span>

                          <ArrowUpRight
                            size={16}
                            className="shrink-0 text-slate-600 transition-colors group-hover:text-slate-300"
                          />
                        </div>

                        <h3 className="mt-3 truncate text-sm font-semibold capitalize text-white">
                          {formatName(department.name)}
                        </h3>

                        <div className="mt-3 flex min-w-0 items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                              Meters
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-200">
                              {department.meterCount}
                            </p>
                          </div>

                          <span
                            className="
                              shrink-0 rounded-lg border px-2 py-1
                              text-[10px] font-medium
                            "
                            style={{
                              color: color.accent,
                              backgroundColor: color.soft,
                              borderColor: color.border,
                            }}
                          >
                            View department
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3 sm:px-5">
              <span className="text-[10px] text-slate-500">
                {departments.length} departments available
              </span>

              <button
                type="button"
                onClick={closeModal}
                className="
                  rounded-lg border border-white/10
                  px-3 py-2 text-xs font-medium text-slate-300
                  transition-colors hover:bg-white/[0.06]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300/70
                "
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};

export default UtilitiesData;
