import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { CalendarDays, ArrowUpRight } from "lucide-react";

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
import IncomingUtilities from "@/components/energy/details/IncomingUtilities";
import DivisionWiseComparison from "@/components/energy/details/DivisionWiseComparison";
import HTGroupsCards from "@/components/energy/details/HTGroupsCards";
import WaterSteamGasCards from "@/components/energy/details/WaterSteamGasCards";

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
  const navigate = useNavigate();

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

  // Today's Consumption page par current division ke saath navigate karein.
  const handleTodaysConsumption = () => {
    navigate(`/${encodeURIComponent(division)}/todays-consumption`);
  };

  useEffect(() => {
    if (!utilis) return;

    console.log("Incoming Config:", utilis.incoming?.config);
    console.log("Incoming Instances:", utilis.incoming?.instances);
    console.log("Incoming Values:", utilis.incoming?.values);
    console.table(utilis.incoming?.data ?? []);
  }, [utilis, division]);

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
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0">
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

          <div className="flex flex-wrap items-center gap-3">
            {/* Today's Consumption navigation */}
            <button
              type="button"
              onClick={handleTodaysConsumption}
              aria-label={`Open Today's Consumption for ${division}`}
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 text-xs font-semibold text-cyan-200 shadow-lg shadow-cyan-950/10 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-400/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:text-sm"
            >
              <CalendarDays className="h-4 w-4" />
              Today's Consumption
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>

            {/* Monitoring status */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Monitoring
              </span>
            </div>
          </div>
        </header>

        {/* KPI cards */}
        <div className="min-w-0">
          <TopCard utilis={utilis} />
        </div>

        {/* Incoming Utilities */}
        <div className="mt-3">
          <IncomingUtilities data={utilis} division={division} />
        </div>

        {/* Division-wise Comparison */}
        <DivisionWiseComparison data={utilis} division={division} />

        <HTGroupsCards data={utilis} division={division} />

        <WaterSteamGasCards data={utilis} division={division} />

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

        {/* Footer */}
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
