import TopCard from "../components/topCard";
import AlertsCard from "../components/dashboard/AlertsCard";
import BuildingEnergyVisual from "../components/dashboard/BuildingEnergyVisual";
import ConsumptionChart from "../components/dashboard/ConsumptionChart";
import ResourceMix from "../components/dashboard/ResourceMix";
import EnergySummary from "../components/dashboard/EnergySummary";

import { statCards1, statCards2 } from "../data/dashboardData";
import DivisionInfoCard from "@/components/dashboard/DivisionInfoCard";

const DashboardPage = () => {
  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 pb-8 pt-6 sm:px-6 xl:px-8">
      {/* =====================================================
          TOP CARDS
      ===================================================== */}

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards1.map((card) => (
          <TopCard key={card.id} card={card} />
        ))}
      </section>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards2.map((card) => (
          <TopCard key={card.id} card={card} />
        ))}
      </section>

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <section className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)_355px]">
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="space-y-4">
          <DivisionInfoCard />

          <AlertsCard />
        </div>

        {/* ===================================================
            CENTER COLUMN
        =================================================== */}

        <div className="min-w-0 space-y-4">
          <BuildingEnergyVisual />

          <EnergySummary />
        </div>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="min-w-0 space-y-4">
          <ConsumptionChart />
          <ResourceMix /> // pieChart Component
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
