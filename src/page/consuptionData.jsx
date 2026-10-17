// import { useMemo } from "react";
// import { useParams } from "react-router";

// import EnergyDonut from "@/components/energy/EnergyDonut";
// import UtilitiesData from "@/components/energy/details/utilitiesData";
// import TotalLoad from "@/components/energy/details/totalLoad";
// import TopCard from "@/components/energy/details/topCard";
// import BuildingEnergyVisual from "@/components/dashboard/BuildingEnergyVisual";
// import AreaChartCard from "@/components/chart/areaChart";
// import ReportTable from "@/components/datalist/reportTable";

// import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";
// import DataLoading from "@/components/common/DataLoading";
// import DataError from "@/components/common/DataError";
// import DataUpdating from "@/components/common/DataUpdating";

// const normalizeDivision = (value) => {
//   try {
//     return decodeURIComponent(String(value ?? ""))
//       .trim()
//       .replace(/[-_]+/g, " ")
//       .toLowerCase();
//   } catch {
//     return String(value ?? "")
//       .trim()
//       .replace(/[-_]+/g, " ")
//       .toLowerCase();
//   }
// };

// const ConsumptionData = () => {
//   const { divisionName } = useParams();

//   const division = useMemo(() => {
//     const normalized = normalizeDivision(divisionName || "Dyeing");

//     return normalized
//       ? normalized.replace(/\b\w/g, (char) => char.toUpperCase())
//       : "Dyeing";
//   }, [divisionName]);

//   const {
//     data: utilis,
//     isPending,
//     isError,
//     error,
//     isFetching,
//     refetch,
//   } = useAuroraDyeingUtilities(division);

//   if (isPending) {
//     return <DataLoading />;
//   }

//   if (isError) {
//     return <DataError error={error} onRetry={refetch} />;
//   }

//   if (!utilis || typeof utilis !== "object") {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#070C11] text-white">
//         <p className="text-sm text-white/60">
//           No utility data available for {division}.
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen w-full overflow-x-hidden bg-[#070C11] font-sans text-white">
//       {isFetching && <DataUpdating />}

//       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-5 sm:px-5 md:px-6 lg:px-7 xl:px-8">
//         <header className="mb-4">
//           <p className="text-xs uppercase tracking-widest text-slate-500">
//             Energy Management
//           </p>
//           <h1 className="mt-1 text-xl font-semibold">
//             {division} Consumption
//           </h1>
//         </header>

//         <div className="w-full shrink-0">
//           <TopCard utilis={utilis} />
//         </div>

//         <section className="mt-5 flex-1">
//           <div className="grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[250px_minmax(0,1fr)_250px] 2xl:grid-cols-[270px_minmax(0,1fr)_270px]">
//             {/* Left: utilities */}
//             <div className="min-w-0">
//               <div className="h-full">
//                 <UtilitiesData data={utilis} />
//               </div>
//             </div>

//             {/* Center: building visualization */}
//             <div className="min-w-0">
//               <div className="min-h-[500px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090F15]/40 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:min-h-[560px] xl:min-h-[580px]">
//                 <div className="h-full w-full">
//                   <BuildingEnergyVisual />
//                 </div>
//               </div>
//             </div>

//             {/* Right: donut and total load */}
//             <div className="flex min-w-0 flex-col gap-4">
//               <div className="relative flex min-h-[350px] w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090F15]/60 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:min-h-[400px] xl:min-h-[430px]">
//                 <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-3xl" />

//                 <div className="relative z-10 flex h-full w-full items-center justify-center px-2 py-4">
//                   <EnergyDonut data={utilis?.departments?.data} />
//                 </div>
//               </div>

//               <div className="w-full shrink-0 rounded-2xl border border-white/[0.07] bg-[#090F15]/60 shadow-[0_0_35px_rgba(0,0,0,0.16)] backdrop-blur-sm">
//                 <TotalLoad data={utilis} />
//               </div>
//             </div>

//             {/* Bottom: chart and report */}
//             <div className="col-span-1 mt-1 min-w-0 lg:col-span-3">
//               <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[30%_minmax(0,70%)]">
//                 <div className="min-w-0 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090F15]/60 shadow-[0_0_35px_rgba(0,0,0,0.16)] backdrop-blur-sm">
//                   <AreaChartCard
//                     data={utilis}
//                     label={division}
//                     unit="kWh"
//                   />
//                 </div>

//                 <div className="min-w-0 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090F15]/60 shadow-[0_0_35px_rgba(0,0,0,0.16)] backdrop-blur-sm">
//                   <ReportTable
//                     data={utilis}
//                     showMeters={5}
//                     headerAllow
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default ConsumptionData;

import { useMemo } from "react";
import { useParams } from "react-router";

import UtilitiesData from "@/components/energy/details/utilitiesData";
import TotalLoad from "@/components/energy/details/totalLoad";
import TopCard from "@/components/energy/details/topCard";
import BuildingEnergyVisual from "@/components/dashboard/BuildingEnergyVisual";

import PieChartCard from "@/components/chart/pieChartText";
import LineChart from "@/components/chart/lineChart";
import AreaChartCard from "@/components/chart/areaChart";
import ReportTable from "@/components/datalist/reportTable";

import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";
import DataLoading from "@/components/common/DataLoading";
import DataError from "@/components/common/DataError";
import DataUpdating from "@/components/common/DataUpdating";

const normalizeDivision = (value) => {
  try {
    return decodeURIComponent(String(value ?? ""))
      .trim()
      .replace(/[-_]+/g, " ")
      .toLowerCase();
  } catch {
    return String(value ?? "")
      .trim()
      .replace(/[-_]+/g, " ")
      .toLowerCase();
  }
};

const Panel = ({ children, className = "" }) => (
  <section
    className={`min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1118]/90 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${className}`}
  >
    {children}
  </section>
);

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mb-4">
    {eyebrow && (
      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-cyan-300/75">
        {eyebrow}
      </p>
    )}

    <h2 className="mt-1 text-sm font-semibold text-slate-100 sm:text-base">
      {title}
    </h2>

    {description && (
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    )}
  </div>
);

const ConsumptionData = () => {
  const { divisionName } = useParams();

  const division = useMemo(() => {
    const normalized = normalizeDivision(divisionName || "Dyeing");

    return normalized
      ? normalized.replace(/\b\w/g, (char) => char.toUpperCase())
      : "Dyeing";
  }, [divisionName]);

  const {
    data: utilis,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuroraDyeingUtilities(division);

  if (isPending) {
    return <DataLoading />;
  }

  if (isError) {
    return <DataError error={error} onRetry={refetch} />;
  }

  if (!utilis || typeof utilis !== "object") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070c11] px-4 text-white">
        <div className="rounded-2xl border border-white/10 bg-[#0a1118] p-6 text-center">
          <p className="text-sm font-medium">No utility data available</p>
          <p className="mt-2 text-xs text-slate-500">
            No data was returned for {division}.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/15"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const departmentData = utilis?.departments?.data ?? {};

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#070c11] font-sans text-white">
      {isFetching && <DataUpdating />}

      <div className="mx-auto flex w-full max-w-[1700px] flex-col px-3 py-4 sm:px-5 sm:py-5 lg:px-6 xl:px-8">
        {/* Page heading */}
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
              Energy Management System
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {division} Consumption
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Live utility monitoring, department meters and energy overview.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              Monitoring
            </span>
          </div>
        </header>

        {/* KPI cards */}
        <div className="min-w-0">
          <TopCard utilis={utilis} />
        </div>

        {/* Main dashboard */}
        {/* <section className="mt-1 grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(230px,0.8fr)_minmax(0,2.2fr)_minmax(260px,0.9fr)] bg-amber-300">
          <div className="min-w-0">
            <UtilitiesData data={utilis} division={division} />
          </div>

          <Panel className="flex min-h-[360px] flex-col sm:min-h-[450px] xl:min-h-[520px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Facility overview
                </p>
                <h2 className="mt-1 text-sm font-semibold text-slate-100">
                  Building Energy Map
                </h2>
              </div>

              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live view
              </span>
            </div>

            <div className="relative min-h-[320px] flex-1 sm:min-h-[400px] xl:min-h-[460px]">
              <BuildingEnergyVisual />
            </div>
          </Panel>

          <div className="flex min-w-0 h-full flex-col gap-4">
            <Panel>
              <div className="p-3 sm:p-4">
                <PieChartCard
                  data={departmentData}
                  label={`${division} Departments`}
                  unit="Meters"
                />
              </div>
            </Panel>

            <Panel className="p-4">
              <TotalLoad data={utilis} />
            </Panel>
          </div>
        </section> */}

        {/* MAIN DASHBOARD */}
        <section
          className="
    mt-3 grid min-w-0 grid-cols-1 items-stretch gap-4
    xl:grid-cols-[minmax(220px,0.85fr)_minmax(0,2.2fr)_minmax(250px,0.95fr)]
    xl:min-h-[520px]
  "
        >
          {/* LEFT: DEPARTMENTS */}
          <div className="h-full min-h-0 min-w-0 overflow-hidden">
            <UtilitiesData data={utilis} division={division} />
          </div>

          {/* CENTER: BUILDING */}
          <Panel className="flex min-h-[430px] min-w-0 flex-col overflow-hidden xl:min-h-[520px]">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Facility overview
                </p>

                <h2 className="mt-1 text-sm font-semibold text-slate-100">
                  Building Energy Map
                </h2>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live view
              </span>
            </div>

            <div className="relative min-h-[360px] flex-1 xl:min-h-0">
              <BuildingEnergyVisual />
            </div>
          </Panel>

          {/* RIGHT: DISTRIBUTION + LOAD */}
          <div className="flex min-w-0 flex-col gap-4">
            <Panel className="min-h-[350px] min-w-0 flex-1 overflow-hidden">
              <div className="h-full min-w-0 p-3 sm:p-4">
                <PieChartCard
                  data={departmentData}
                  label={`${division} Departments`}
                  unit="Meters"
                />
              </div>
            </Panel>

            <Panel className="shrink-0 p-4">
              <TotalLoad data={utilis} />
            </Panel>
          </div>
        </section>

        {/* ANALYTICS */}
        <section className="mt-6 min-w-0 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300/80">
              Analytics
            </p>

            <h2 className="mt-1 text-base font-semibold text-white">
              Consumption Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Department meter readings and available consumption data.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 2xl:grid-cols-2">
            <Panel className="min-h-[350px] min-w-0 overflow-hidden">
              <div className="h-full min-w-0">
                <AreaChartCard data={utilis} label={division} unit="Units" />
              </div>
            </Panel>

            <Panel className="min-h-[350px] min-w-0 overflow-hidden">
              <div className="h-full min-w-0 p-3 sm:p-4">
                <LineChart />
              </div>
            </Panel>
          </div>
        </section>

        {/* Charts */}
        <section className="mt-5">
          <SectionHeading
            eyebrow="Analytics"
            title="Consumption Charts"
            description="Review the available meter readings and the line chart."
          />

          <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 2xl:grid-cols-2">
            <Panel className="min-h-[330px]">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Department Meter Readings
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  Area chart · values available in the returned meter data
                </p>
              </div>

              <div className="min-w-0 p-2 sm:p-4">
                <AreaChartCard
                  data={utilis}
                  label={`${division} Meter Readings`}
                  unit="Reading"
                />
              </div>
            </Panel>

            {/* Existing line chart */}
            <Panel className="min-h-[330px]">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Power Load Trend
                </h3>
                <p className="mt-1 text-[11px] text-amber-300/70">
                  Existing line chart · replace sample values with historical
                  API data for a live trend.
                </p>
              </div>

              <div className="min-w-0 p-2 sm:p-4">
                <LineChart />
              </div>
            </Panel>
          </div>
        </section>

        {/* Meter report */}
        <section className="mt-5">
          <SectionHeading
            eyebrow="Meter inventory"
            title="Department Meter Report"
            description="Meter status, department assignment and available readings."
          />

          <Panel>
            <ReportTable data={utilis} showMeters={5} headerAllow />
          </Panel>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
          <p className="text-[10px] text-slate-600">
            EMS · {division} overview
          </p>
          <p className="text-[10px] text-slate-600">
            Dashboard values depend on the connected data source.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default ConsumptionData;
