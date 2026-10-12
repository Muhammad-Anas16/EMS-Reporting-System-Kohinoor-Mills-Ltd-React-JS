import {
  ArrowUpRight,
  Droplets,
  Flame,
  Sun,
  Thermometer,
  Zap,
} from "lucide-react";

import Panel from "./Panel";

const summaryItems = [
  {
    name: "Electricity",
    value: "1,648",
    percent: "58%",
    color: "#3b82f6",
    icon: Zap,
  },
  {
    name: "Gas",
    value: "455",
    percent: "16%",
    color: "#f97316",
    icon: Flame,
  },
  {
    name: "Water",
    value: "256",
    percent: "9%",
    color: "#38bdf8",
    icon: Droplets,
  },
  {
    name: "Thermal",
    value: "199",
    percent: "7%",
    color: "#a855f7",
    icon: Thermometer,
  },
  {
    name: "Solar",
    value: "287",
    percent: "10%",
    color: "#facc15",
    icon: Sun,
  },
];

const EnergySummary = () => {
  return (
    <Panel className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight size={17} className="text-emerald-400" />

          <h3 className="text-sm font-semibold text-slate-100">
            Energy Summary
          </h3>
        </div>

        <span className="rounded-lg border border-white/[0.06] bg-[#0d151d] px-2.5 py-1.5 text-[10px] text-slate-400">
          Today
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="rounded-xl border border-white/[0.05] bg-[#0b1219] p-3"
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}17`,
                }}
              >
                <Icon size={15} />
              </div>

              <p className="text-[10px] text-slate-500">{item.name}</p>

              <p className="mt-1 text-sm font-semibold text-white">
                {item.value}

                <span className="ml-1 text-[9px] font-normal text-slate-500">
                  kWh
                </span>
              </p>

              <p className="mt-1 text-[9px] text-slate-600">{item.percent}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default EnergySummary;
