import { useMemo } from "react";
import { useParams } from "react-router";

import ReportTable from "@/components/datalist/reportTable";
import CardsComponent from "@/components/card/cards";
import PieChartCard from "@/components/chart/pieChartText";
import AreaChartCard from "@/components/chart/areaChart";

import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";
import DataLoading from "@/components/common/DataLoading";
import DataError from "@/components/common/DataError";
import DataUpdating from "@/components/common/DataUpdating";

const normalizeDivision = (value) => {
  try {
    return decodeURIComponent(String(value ?? ""))
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  } catch {
    return String(value ?? "")
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  }
};

const ReportPage = () => {
  const { divisionName } = useParams();

  const division = useMemo(
    () => normalizeDivision(divisionName || "Dyeing"),
    [divisionName],
  );

  const {
    data: systemData,
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

  if (!systemData || typeof systemData !== "object") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070C11] text-white">
        <div className="text-center">
          <h1 className="text-lg font-semibold">No report data available</h1>
          <p className="mt-2 text-sm text-white/50">Division: {division}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="dark min-h-screen w-full bg-[#070C11] text-white">
      {isFetching && <DataUpdating />}

      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Energy Management
          </p>
          <h1 className="mt-1 text-xl font-semibold">{division} Report</h1>
        </header>

        {/* KPI cards */}
        <section className="w-full">
          <CardsComponent data={systemData} />
        </section>

        {/* Charts */}
        <section className="mt-4 w-full">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="min-w-0 lg:col-span-7">
              <AreaChartCard data={systemData} label={division} unit="kWh" />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <PieChartCard data={systemData} label={division} unit="Meters" />
            </div>
          </div>
        </section>

        {/* Meter table */}
        <section className="mt-4 w-full min-w-0">
          <ReportTable
            data={systemData}
            showMeters={8}
            headerAllow
            pagiantionAllow
          />
        </section>
      </main>
    </div>
  );
};

export default ReportPage;
