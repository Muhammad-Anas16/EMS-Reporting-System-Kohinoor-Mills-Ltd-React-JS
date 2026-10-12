import React from "react";
import EnergyDonut from "@/components/energy/EnergyDonut";
import UtilitiesData from "@/components/energy/details/utilitiesData";
import TotalLoad from "@/components/energy/details/totalLoad";
import TopCard from "@/components/energy/details/topCard";
import BuildingEnergyVisual from "@/components/dashboard/BuildingEnergyVisual";
import AreaChartCard from "@/components/chart/areaChart";
import ReportTable from "@/components/datalist/reportTable";
import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";
import DataLoading from "@/components/common/DataLoading";
import DataError from "@/components/common/DataError";
import DataUpdating from "@/components/common/DataUpdating";

const ConsumptionData = () => {
  const {
    data: utilis,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuroraDyeingUtilities("Dyeing");

  // console.log("Consumption Data =>", utilis);

  // Initial loading
  if (isPending) {
    return <DataLoading />;
  }

  // Error state
  if (isError) {
    return <DataError error={error} onRetry={refetch} />;
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#070C11] font-sans text-white">
      {/* Background update indicator */}
      {isFetching && <DataUpdating />}

      {/* Main Content */}
      <div
        className="
          relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px]
          flex-col px-4 py-5
          sm:px-5
          md:px-6
          lg:px-7
          xl:px-8
        "
      >
        {/* ===================================================== */}
        {/* TOP SUMMARY CARDS */}
        {/* ===================================================== */}
        <div className="w-full shrink-0">
          <TopCard utilis={utilis} />
        </div>

        {/* ===================================================== */}
        {/* MAIN DASHBOARD */}
        {/* ===================================================== */}
        <section className="mt-5 flex-1">
          {/* Main 3 Column Layout */}
          <div
            className="
              grid
              w-full
              items-stretch
              gap-4

              grid-cols-1

              lg:grid-cols-[220px_minmax(0,1fr)_220px]

              xl:grid-cols-[250px_minmax(0,1fr)_250px]

              2xl:grid-cols-[270px_minmax(0,1fr)_270px]
            "
          >
            {/* ================================================= */}
            {/* LEFT - UTILITIES */}
            {/* ================================================= */}
            <div className="min-w-0">
              <div className="h-full">
                <UtilitiesData data={utilis} />
              </div>
            </div>

            {/* ================================================= */}
            {/* CENTER - BUILDING ENERGY VISUAL */}
            {/* ================================================= */}
            <div className="min-w-0">
              <div
                className="
                  h-full
                  min-h-[500px]

                  lg:min-h-[560px]
                  xl:min-h-[580px]

                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#090F15]/40
                  backdrop-blur-sm

                  shadow-[0_0_40px_rgba(0,0,0,0.18)]
                "
              >
                <div className="h-full w-full">
                  <BuildingEnergyVisual />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT - DONUT + TOTAL LOAD */}
            {/* ================================================= */}
            <div
              className="
                flex
                min-w-0
                flex-col
                gap-4
              "
            >
              {/* Energy Donut */}
              <div
                className="
                  relative
                  flex
                  min-h-[350px]
                  flex-1
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#090F15]/60
                  backdrop-blur-sm

                  lg:min-h-[400px]
                  xl:min-h-[430px]

                  shadow-[0_0_40px_rgba(0,0,0,0.18)]
                "
              >
                {/* Background Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-64
                    w-64
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-cyan-400/[0.035]
                    blur-3xl
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    px-2
                    py-4
                  "
                >
                  <EnergyDonut data={utilis?.departments?.data} />
                </div>
              </div>

              {/* Total Load */}
              <div className="w-full shrink-0">
                <div
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#090F15]/60
                    backdrop-blur-sm

                    shadow-[0_0_35px_rgba(0,0,0,0.16)]
                  "
                >
                  <TotalLoad data={utilis} />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* BOTTOM - AREA CHART + REPORT TABLE */}
            {/* ================================================= */}
            <div
              className="
                col-span-1
                min-w-0

                lg:col-span-3

                mt-1
              "
            >
              <div
                className="
                  grid
                  w-full
                  min-w-0
                  gap-4

                  grid-cols-1

                  lg:grid-cols-[30%_minmax(0,70%)]
                "
              >
                {/* ============================================= */}
                {/* AREA CHART - 30% */}
                {/* ============================================= */}
                <div
                  className="
                    min-w-0
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#090F15]/60
                    backdrop-blur-sm
                    shadow-[0_0_35px_rgba(0,0,0,0.16)]
                  "
                >
                  <AreaChartCard data={utilis} label="Division" unit="kWh" />
                </div>

                {/* ============================================= */}
                {/* REPORT TABLE - 70% */}
                {/* ============================================= */}
                <div
                  className="
                    min-w-0
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#090F15]/60
                    backdrop-blur-sm
                    shadow-[0_0_35px_rgba(0,0,0,0.16)]
                  "
                >
                  <ReportTable
                    data={utilis}
                    showMeters={5}
                    headerAllow={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ConsumptionData;
