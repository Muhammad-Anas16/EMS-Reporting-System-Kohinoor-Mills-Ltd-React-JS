import {
  Zap,
  Flame,
  Sun,
  Gauge,
  Activity,
  Droplets,
  Wind,
  ArrowUpRight,
  Radio,
  CircleAlert,
} from "lucide-react";
import { useNavigate } from "react-router";

const UTILITY_META = {
  lesco: {
    label: "LESCO",
    icon: Zap,
    unit: "kWh",
    color: "text-yellow-300",
    glow: "bg-yellow-400/10",
  },
  kgl: {
    label: "KGL",
    icon: Flame,
    unit: "kWh",
    color: "text-orange-300",
    glow: "bg-orange-400/10",
  },
  solar: {
    label: "Solar",
    icon: Sun,
    unit: "kWh",
    color: "text-emerald-300",
    glow: "bg-emerald-400/10",
  },
  boiler_out: {
    label: "Boiler Output",
    icon: Gauge,
    unit: "Configured units",
    color: "text-cyan-300",
    glow: "bg-cyan-400/10",
  },
  total_current: {
    label: "Total Current",
    icon: Activity,
    unit: "Configured units",
    color: "text-violet-300",
    glow: "bg-violet-400/10",
  },
  total_kwh_today: {
    label: "Today's Energy",
    icon: Zap,
    unit: "kWh",
    color: "text-blue-300",
    glow: "bg-blue-400/10",
  },
  water: {
    label: "Water",
    icon: Droplets,
    unit: "Configured units",
    color: "text-sky-300",
    glow: "bg-sky-400/10",
  },
  steam: {
    label: "Steam",
    icon: Wind,
    unit: "Configured units",
    color: "text-slate-300",
    glow: "bg-slate-400/10",
  },
  gas: {
    label: "Gas",
    icon: Flame,
    unit: "Configured units",
    color: "text-orange-300",
    glow: "bg-orange-400/10",
  },
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const getDisplayValue = (item) => {
  if (item?.hasLiveValue && item?.liveValue != null) {
    return item.liveValue;
  }

  return item?.value;
};

const IncomingUtilities = ({ data, division }) => {
  const navigate = useNavigate();

  const items = Array.isArray(data?.incoming?.data) ? data.incoming.data : [];

  const divisionName = String(division || "Dyeing").trim();

  const liveCount = items.filter(
    (item) => item?.hasLiveValue === true && item?.liveValue != null,
  ).length;

  const handleNavigate = () => {
    navigate(`/${encodeURIComponent(divisionName)}/current-load`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <section
      role="link"
      tabIndex={0}
      aria-label={`Open Current Load for ${divisionName}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#101b27] via-[#0a111a] to-[#080d14] p-4 shadow-lg shadow-black/10 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-950/20 focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:p-5"
    >
      {/* Subtle decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-cyan-400/[0.06] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.12]"
      />

      {/* Header */}
      <div className="relative mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-cyan-300/10 bg-cyan-400/[0.08] p-3">
            <Activity className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Energy Monitoring
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
              Incoming Utilities
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {divisionName} · Incoming meter readings
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
            {liveCount > 0 ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-medium text-emerald-300">
                  {liveCount} Live
                </span>
              </>
            ) : (
              <>
                <CircleAlert className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-[11px] font-medium text-amber-300">
                  No Live Readings
                </span>
              </>
            )}
          </div>

          <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />
        </div>
      </div>

      {/* Summary */}
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2 border-y border-white/[0.07] py-3">
        <p className="text-xs text-slate-400">Configured sources</p>

        <p className="text-xs font-medium tabular-nums text-slate-200">
          {items.length} {items.length === 1 ? "source" : "sources"}
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-emerald-300">{liveCount} live</span>
        </p>
      </div>

      {/* Utility cards */}
      {items.length === 0 ? (
        <div className="relative rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-8 text-center">
          <Radio className="mx-auto h-7 w-7 text-slate-500" />

          <p className="mt-3 text-sm font-medium text-slate-300">
            No incoming sources configured
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
            Incoming meter configuration for {divisionName} is not available.
            You can still open the Current Load page.
          </p>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const key = String(item?.key || "unknown").toLowerCase();

            const meta = UTILITY_META[key] ?? {
              label: key
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              icon: Gauge,
              unit: "Configured units",
              color: "text-cyan-300",
              glow: "bg-cyan-400/10",
            };

            const Icon = meta.icon;
            const isLive =
              item?.hasLiveValue === true && item?.liveValue != null;

            return (
              <article
                key={`${key}-${item?.instance ?? index}`}
                className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0b131d]/90 p-4 transition-all duration-300 hover:border-white/[0.15] hover:bg-[#101b28]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-400">
                      {meta.label}
                    </p>

                    <p
                      className="mt-3 break-words text-2xl font-semibold tracking-tight text-white"
                      title={String(getDisplayValue(item) ?? "")}
                    >
                      {formatValue(getDisplayValue(item))}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {meta.unit}
                    </p>
                  </div>

                  <div
                    className={`shrink-0 rounded-xl border border-white/[0.04] p-3 ${meta.glow} ${meta.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                  <span className="text-[10px] text-slate-500">
                    Instance{" "}
                    <span className="font-medium tabular-nums text-slate-300">
                      {item?.instance ?? "—"}
                    </span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
                      isLive ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isLive ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {isLive ? "Live reading" : "Unavailable"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Navigation footer */}
      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
        <p className="text-[11px] text-slate-500">
          View detailed electrical load and meters
        </p>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200">
          Current Load
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </section>
  );
};

export default IncomingUtilities;
