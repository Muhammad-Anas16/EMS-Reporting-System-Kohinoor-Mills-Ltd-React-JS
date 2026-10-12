import { Activity, ChevronDown } from "lucide-react";

import Panel from "./Panel";

import { energyConsumption } from "../../data/dashboardData";

const chartColors = ["#38bdf8", "#fb923c", "#22d3ee", "#a855f7", "#facc15"];

const buildPoints = (data, width, height) => {
  const max = Math.max(...data, 1000);

  const step = width / (data.length - 1);

  return data
    .map((value, index) => {
      const x = index * step;

      const y = height - (value / max) * height;

      return `${x},${y}`;
    })
    .join(" ");
};

const ConsumptionChart = () => {
  const width = 700;
  const height = 220;

  return (
    <Panel className="overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={17} className="text-slate-400" />

          <h3 className="text-sm font-semibold text-slate-100">
            Energy Consumption
          </h3>
        </div>

        <button className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#0d151d] px-2.5 py-1.5 text-[10px] text-slate-400">
          Last 24 Hours
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="mt-4 h-[190px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* GRID */}

          {[0, 1, 2, 3, 4].map((line) => {
            const y = (height / 4) * line;

            return (
              <line
                key={line}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* LINES */}

          {energyConsumption.datasets.slice(0, 5).map((dataset, index) => (
            <polyline
              key={dataset.label}
              fill="none"
              stroke={chartColors[index]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildPoints(dataset.data, width, height)}
            />
          ))}
        </svg>
      </div>

      {/* LEGEND */}

      <div className="mt-2 grid grid-cols-2 gap-y-2 sm:grid-cols-5">
        {energyConsumption.datasets.slice(0, 5).map((dataset, index) => (
          <div key={dataset.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: chartColors[index],
              }}
            />

            <span className="text-[10px] text-slate-500">{dataset.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ConsumptionChart;
