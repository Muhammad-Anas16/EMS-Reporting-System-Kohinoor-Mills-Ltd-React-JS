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

const decodeParam = (value) => {
  try {
    return decodeURIComponent(String(value ?? ""));
  } catch {
    return String(value ?? "");
  }
};

const normalizeName = (value) =>
  decodeParam(value).trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

const getMeterValue = (meter) => {
  const rawValue =
    meter?.value ??
    meter?.liveValue ??
    meter?.currentValue ??
    meter?.bacnetValue;

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return 0;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : 0;
};

const PerDepartmentPage = () => {
  const { divisionName, department } = useParams();

  const division = useMemo(
    () => normalizeName(divisionName || "Dyeing"),
    [divisionName],
  );

  const departmentName = useMemo(() => normalizeName(department), [department]);

  const {
    data: divisionData,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuroraDyeingUtilities(division);

  const systemData = useMemo(() => {
    if (!divisionData || !departmentName) {
      return null;
    }

    const departments = divisionData?.departments?.data;

    if (
      !departments ||
      typeof departments !== "object" ||
      Array.isArray(departments)
    ) {
      return null;
    }

    const departmentKey = Object.keys(departments).find(
      (key) =>
        normalizeName(key).toLowerCase() === departmentName.toLowerCase(),
    );

    if (!departmentKey) {
      return null;
    }

    const sourceMeters = departments[departmentKey];

    const departmentMeters = Array.isArray(sourceMeters) ? sourceMeters : [];

    const totalValue = departmentMeters.reduce(
      (total, meter) => total + getMeterValue(meter),
      0,
    );

    return {
      ...divisionData,
      division,
      department: departmentKey,

      departments: {
        ...divisionData.departments,
        type: [departmentKey],
        data: {
          [departmentKey]: departmentMeters,
        },
      },

      Data: departmentMeters,
      dataCount: departmentMeters.length,

      totalValue: {
        value: totalValue,
        totaObject: departmentMeters.length,
      },

      totalLoad: totalValue,
      totalConsumption: totalValue,
      bacnetData: divisionData?.bacnetData ?? [],
    };
  }, [divisionData, division, departmentName]);

  if (isPending) {
    return <DataLoading />;
  }

  if (isError) {
    return <DataError error={error} onRetry={refetch} />;
  }

  if (!systemData) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#070C11] text-white">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Department not found</h1>

          <p className="mt-2 text-sm text-white/50">
            {departmentName || "Unknown Department"}
          </p>

          <p className="mt-1 text-xs text-white/40">Division: {division}</p>

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
        <section className="mb-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#090F15]/70 p-4 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Department
            </p>

            <h1 className="mt-1 text-xl font-semibold text-white">
              {systemData.department}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Division: {systemData.division}
            </p>
          </div>
        </section>

        {/* KPI cards */}
        <section className="w-full">
          <CardsComponent data={systemData} />
        </section>

        {/* Charts */}
        <section className="mt-4 w-full">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="min-w-0 lg:col-span-7">
              <AreaChartCard data={systemData} label="Department" unit="kWh" />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <PieChartCard
                data={systemData}
                label={systemData.department}
                unit="Meters"
              />
            </div>
          </div>
        </section>

        {/* Report table */}
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

export default PerDepartmentPage;
