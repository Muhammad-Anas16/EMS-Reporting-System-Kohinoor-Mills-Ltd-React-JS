// import React from "react";
// import { useLocation } from "react-router";

// const PerDepartmentPage = () => {
//   const { pathname } = useLocation();
//   const location = pathname.split("/").splice(1, 2);
//   console.log(location[0].toLocaleString())
//   console.log(location[1].toLocaleString())
//   return (
//     <div>
//       <h1>department</h1>
//     </div>
//   );
// };

// export default PerDepartmentPage;

import React, { useMemo } from "react";
import { useParams } from "react-router";

import ReportTable from "@/components/datalist/reportTable";
import CardsComponent from "@/components/card/cards";
import PieChartCard from "@/components/chart/pieChartText";
import AreaChartCard from "@/components/chart/areaChart";

import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";

import DataLoading from "@/components/common/DataLoading";
import DataError from "@/components/common/DataError";
import DataUpdating from "@/components/common/DataUpdating";

const PerDepartmentPage = () => {
  const { divisionName, department } = useParams();

  // console.log("Division =>", divisionName);
  // console.log("Department =>", department);

  const division = useMemo(() => {
    return decodeURIComponent(divisionName || "")
      .trim()
      .replace(/[-_]+/g, " ");
  }, [divisionName]);

  const departmentName = useMemo(() => {
    return decodeURIComponent(department || "")
      .trim()
      .replace(/[-_]+/g, " ");
  }, [department]);

  const {
    data: divisionData,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuroraDyeingUtilities(
    division ? division.charAt(0).toUpperCase() + division.slice(1) : "Dyeing",
  );

  // --------------------------------
  // Selected Department Data
  // --------------------------------

  const systemData = useMemo(() => {
    if (!divisionData) {
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
      (key) => key.toLowerCase() === departmentName.toLowerCase(),
    );

    if (!departmentKey) {
      return null;
    }

    const departmentMeters = Array.isArray(departments[departmentKey])
      ? departments[departmentKey]
      : [];

    const totalValue = departmentMeters.reduce((total, meter) => {
      const value = Number(
        meter?.value ??
          meter?.liveValue ??
          meter?.currentValue ??
          meter?.bacnetValue ??
          0,
      );

      return Number.isFinite(value) ? total + value : total;
    }, 0);

    return {
      ...divisionData,

      division,

      department: departmentKey,

      departments: {
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

      bacnetData: divisionData?.bacnetData || [],
    };
  }, [divisionData, division, departmentName]);

  // --------------------------------
  // Loading
  // --------------------------------

  if (isPending) {
    return <DataLoading />;
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (isError) {
    return <DataError error={error} onRetry={refetch} />;
  }

  // --------------------------------
  // Department Not Found
  // --------------------------------

  if (!systemData) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#070C11] text-white">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Department not found</h1>

          <p className="mt-2 text-sm text-white/50">
            {departmentName || "Unknown Department"}
          </p>

          <button
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

        {/* KPI Cards */}
        <section className="w-full">
          <CardsComponent data={systemData} />
        </section>

        {/* Charts */}
        <section className="mt-4 w-full">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-10">
            {/* Area Chart */}
            <div className="min-w-0 lg:col-span-7">
              <AreaChartCard data={systemData} label="Department" unit="kWh" />
            </div>

            {/* Pie Chart */}
            <div className="min-w-0 lg:col-span-3">
              <PieChartCard
                data={systemData}
                label={systemData.department}
                unit="Meters"
              />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-4 w-full min-w-0">
          <ReportTable
            data={systemData}
            showMeters={8}
            headerAllow={true}
            pagiantionAllow={true}
          />
        </section>
      </main>
    </div>
  );
};

export default PerDepartmentPage;
