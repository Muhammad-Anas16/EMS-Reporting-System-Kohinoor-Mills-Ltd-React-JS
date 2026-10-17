// import TopCard from "../components/topCard";
// import AlertsCard from "../components/dashboard/AlertsCard";
// import BuildingEnergyVisual from "../components/dashboard/BuildingEnergyVisual";
// import ConsumptionChart from "../components/dashboard/ConsumptionChart";
// import ResourceMix from "../components/dashboard/ResourceMix";
// import EnergySummary from "../components/dashboard/EnergySummary";

// import { statCards1, statCards2 } from "../data/dashboardData";
// import DivisionInfoCard from "@/components/dashboard/DivisionInfoCard";

// const DashboardPage = () => {
//   return (
//     <main className="mx-auto w-full max-w-[1700px] px-4 pb-8 pt-6 sm:px-6 xl:px-8">
//       {/* Top summary cards */}
//       <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//         {statCards1.map((card) => (
//           <TopCard key={card.id} card={card} />
//         ))}
//       </section>

//       <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {statCards2.map((card) => (
//           <TopCard key={card.id} card={card} />
//         ))}
//       </section>

//       {/* Main dashboard */}
//       <section className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)_355px]">
//         {/* Left column */}
//         <div className="min-w-0 space-y-4">
//           <DivisionInfoCard />
//           <AlertsCard />
//         </div>

//         {/* Center column */}
//         <div className="min-w-0 space-y-4">
//           <BuildingEnergyVisual />
//           <EnergySummary />
//         </div>

//         {/* Right column */}
//         <div className="min-w-0 space-y-4">
//           <ConsumptionChart />
//           <ResourceMix />
//         </div>
//       </section>
//     </main>
//   );
// };

// export default DashboardPage;
import TopCard from "../components/topCard";
import AlertsCard from "../components/dashboard/AlertsCard";
import BuildingEnergyVisual from "../components/dashboard/BuildingEnergyVisual";
import ConsumptionChart from "../components/dashboard/ConsumptionChart";
import ResourceMix from "../components/dashboard/ResourceMix";
import EnergySummary from "../components/dashboard/EnergySummary";
import DivisionInfoCard from "../components/dashboard/DivisionInfoCard";

import { statCards1, statCards2 } from "../data/dashboardData";

const DashboardPage = () => {
  return (
    <main className="ems-dashboard mx-auto w-full max-w-[1800px] px-4 pb-8 pt-5 sm:px-6 xl:px-8">
      {/* Welcome section */}
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="glass-label">
            KOHINOOR MILLS · ENERGY MANAGEMENT
          </span>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Industrial Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Monitor factory divisions, energy consumption and utilities.
          </p>
        </div>

        <div className="glass-status">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          <span>Monitoring Overview</span>
        </div>
      </section>

      {/* KPI cards */}
      <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards1.map((card) => (
          <TopCard key={card.id} card={card} />
        ))}
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards2.map((card) => (
          <TopCard key={card.id} card={card} />
        ))}
      </section>

      {/* Factory image and consumption analytics */}
      <section className="mb-5 grid grid-cols-1 gap-5 2xl:grid-cols-[1.5fr_1fr]">
        <BuildingEnergyVisual />

        <div className="grid min-w-0 gap-5">
          <ConsumptionChart />
          <ResourceMix />
        </div>
      </section>

      {/* Division cards and energy summary */}
      <section className="mb-5 grid grid-cols-1 gap-5 2xl:grid-cols-[1.15fr_1fr]">
        <DivisionInfoCard />
        <EnergySummary />
      </section>

      {/* Alerts */}
      <section className="grid grid-cols-1 gap-5">
        <AlertsCard />
      </section>

      <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-500">
        <span>Kohinoor Mills · Energy Management System</span>
        <span>Industrial Monitoring Dashboard</span>
      </footer>
    </main>
  );
};

export default DashboardPage;
