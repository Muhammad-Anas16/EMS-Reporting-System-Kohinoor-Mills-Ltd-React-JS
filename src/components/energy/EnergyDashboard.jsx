import React from "react";
import EnergyDonut from "./EnergyDonut";

const EnergyDashboard = () => {
  return (
    <main className="bg-[#050b13] text-white flex flex-col justify-between font-sans">
      <section className="flex-1 flex items-center justify-center py-6">
        <EnergyDonut />
      </section>
    </main>
  );
};

export default EnergyDashboard;
