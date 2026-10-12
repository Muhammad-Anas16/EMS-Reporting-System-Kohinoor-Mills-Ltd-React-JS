// import React from "react";

// const TopCard = ({ utilis }) => {
//   const formatValue = (value) => {
//     const number = Number(value);

//     if (!Number.isFinite(number)) {
//       return "0";
//     }

//     if (Math.abs(number) >= 1_000_000_000) {
//       return `${(number / 1_000_000_000).toFixed(1)}B`;
//     }

//     if (Math.abs(number) >= 1_000_000) {
//       return `${(number / 1_000_000).toFixed(1)}M`;
//     }

//     if (Math.abs(number) >= 1_000) {
//       return `${(number / 1_000).toFixed(1)}K`;
//     }

//     return number.toFixed(1);
//   };

//   return (
//     <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//       {/* Connected Utilities */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
//         <div className="flex items-center justify-between">
//           {/* <span className="text-xs text-slate-400">Connected Utilities</span> */}
//           <span className="text-xs text-slate-400">Connected Division</span>

//           <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-300">
//             LIVE
//           </span>
//         </div>

//         <div className="mt-2 flex items-end gap-2">
//           <span className="text-2xl font-bold text-white">
//             {/* {utilis?.dataType?.length || 0} */}
//             {utilis?.departments?.type?.length || 0}
//           </span>

//           {/* <span className="pb-1 text-xs text-slate-500">utilities</span> */}
//           <span className="pb-1 text-xs text-slate-500">Division</span>
//         </div>
//       </div>

//       {/* Consumption View */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-slate-400">Consumption View</span>

//           <span className="text-[11px] text-slate-600">EMS</span>
//         </div>

//         <div className="mt-2">
//           <span className="text-lg font-semibold text-white">
//             {utilis?.division || "Distribution"}
//           </span>

//           <p className="mt-0.5 text-[11px] text-slate-500">
//             Utility-wise energy breakdown
//           </p>
//         </div>
//       </div>

//       {/* Current Load */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-2 lg:col-span-1">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-slate-400">Current Load</span>

//           <span className="rounded-md bg-blue-400/10 px-2 py-1 text-[10px] font-medium text-blue-300">
//             kW
//           </span>
//         </div>

//         <div className="mt-2 flex min-w-0 items-end gap-2">
//           <span className="truncate text-2xl font-bold text-white">
//             {formatValue(utilis?.totalValue?.value)}
//           </span>

//           <span className="shrink-0 pb-1 text-xs text-slate-500">
//             electrical load
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TopCard;
import React from "react";
import { Building2, Activity, Zap, Radio, ChevronRight } from "lucide-react";

const TopCard = ({ utilis }) => {
  const formatValue = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    if (Math.abs(number) >= 1_000_000_000) {
      return `${(number / 1_000_000_000).toFixed(1)}B`;
    }

    if (Math.abs(number) >= 1_000_000) {
      return `${(number / 1_000_000).toFixed(1)}M`;
    }

    if (Math.abs(number) >= 1_000) {
      return `${(number / 1_000).toFixed(1)}K`;
    }

    return number.toFixed(1);
  };

  const divisionCount = utilis?.departments?.type?.length || 0;
  const currentLoad = formatValue(utilis?.totalValue?.value);
  const consumptionView = utilis?.division || "Distribution";

  return (
    <section className="mb-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* ===================================================== */}
      {/* CONNECTED DIVISION */}
      {/* ===================================================== */}
      <div
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-[#0A1118]/80
          px-4 py-4
          backdrop-blur-xl
          transition-all duration-300
          hover:-translate-y-[1px]
          hover:border-cyan-400/20
          hover:bg-[#0B141C]
          hover:shadow-[0_10px_35px_rgba(0,0,0,0.20)]
        "
      >
        {/* Accent Glow */}
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-10
            h-28 w-28
            rounded-full
            bg-cyan-400/[0.06]
            blur-3xl
            transition-all duration-500
            group-hover:bg-cyan-400/[0.10]
          "
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Icon */}
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl
                border border-cyan-400/15
                bg-cyan-400/[0.07]
                shadow-[0_0_20px_rgba(34,211,238,0.05)]
              "
            >
              <Building2
                size={20}
                strokeWidth={1.8}
                className="text-cyan-400"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                Connected Division
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight text-white">
                  {divisionCount}
                </span>

                <span className="text-[11px] text-slate-500">Division</span>
              </div>
            </div>
          </div>

          {/* Live Status */}
          <div
            className="
              flex shrink-0 items-center gap-1.5
              rounded-lg
              border border-emerald-400/10
              bg-emerald-400/[0.06]
              px-2 py-1
            "
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-semibold tracking-[0.08em] text-emerald-300">
              LIVE
            </span>
          </div>
        </div>

        {/* Bottom Detail */}
        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2.5">
          <span className="text-[10px] text-slate-600">Active monitoring</span>

          <Radio size={13} strokeWidth={1.7} className="text-cyan-500/60" />
        </div>
      </div>

      {/* ===================================================== */}
      {/* CONSUMPTION VIEW */}
      {/* ===================================================== */}
      <div
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-[#0A1118]/80
          px-4 py-4
          backdrop-blur-xl
          transition-all duration-300
          hover:-translate-y-[1px]
          hover:border-violet-400/20
          hover:bg-[#0B141C]
          hover:shadow-[0_10px_35px_rgba(0,0,0,0.20)]
        "
      >
        {/* Accent Glow */}
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-10
            h-28 w-28
            rounded-full
            bg-violet-500/[0.05]
            blur-3xl
            transition-all duration-500
            group-hover:bg-violet-500/[0.09]
          "
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Icon */}
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl
                border border-violet-400/15
                bg-violet-400/[0.07]
              "
            >
              <Activity
                size={20}
                strokeWidth={1.8}
                className="text-violet-400"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                Consumption View
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-white">
                {consumptionView}
              </h2>
            </div>
          </div>

          {/* EMS Badge */}
          <span
            className="
              shrink-0
              rounded-lg
              border border-white/[0.06]
              bg-white/[0.025]
              px-2 py-1
              text-[9px]
              font-medium
              tracking-[0.08em]
              text-slate-500
            "
          >
            EMS
          </span>
        </div>

        {/* Description */}
        <div className="relative z-10 mt-3 border-t border-white/[0.05] pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] text-slate-600">
              Utility-wise energy breakdown
            </p>

            <ChevronRight
              size={14}
              strokeWidth={1.7}
              className="
                shrink-0
                text-slate-600
                transition-transform duration-300
                group-hover:translate-x-0.5
                group-hover:text-violet-400
              "
            />
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* CURRENT LOAD */}
      {/* ===================================================== */}
      <div
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-[#0A1118]/80
          px-4 py-4
          backdrop-blur-xl
          transition-all duration-300
          hover:-translate-y-[1px]
          hover:border-blue-400/20
          hover:bg-[#0B141C]
          hover:shadow-[0_10px_35px_rgba(0,0,0,0.20)]
          sm:col-span-2
          lg:col-span-1
        "
      >
        {/* Accent Glow */}
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-10
            h-28 w-28
            rounded-full
            bg-blue-500/[0.06]
            blur-3xl
            transition-all duration-500
            group-hover:bg-blue-500/[0.10]
          "
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Icon */}
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl
                border border-blue-400/15
                bg-blue-400/[0.07]
              "
            >
              <Zap size={20} strokeWidth={1.8} className="text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                Current Load
              </p>

              <div className="mt-1 flex min-w-0 items-baseline gap-2">
                <span className="truncate text-2xl font-semibold tracking-tight text-white">
                  {currentLoad}
                </span>

                <span className="shrink-0 text-[11px] text-slate-500">kW</span>
              </div>
            </div>
          </div>

          {/* Unit Badge */}
          <span
            className="
              shrink-0
              rounded-lg
              border border-blue-400/10
              bg-blue-400/[0.06]
              px-2 py-1
              text-[9px]
              font-semibold
              tracking-[0.08em]
              text-blue-300
            "
          >
            POWER
          </span>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] text-slate-500">Electrical load</span>
          </div>

          <span className="text-[10px] font-medium text-emerald-400/80">
            Live
          </span>
        </div>
      </div>
    </section>
  );
};

export default TopCard;
