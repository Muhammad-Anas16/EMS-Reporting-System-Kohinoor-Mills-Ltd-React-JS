import { Gauge } from "lucide-react";

import Panel from "./Panel";

import { resourceMix } from "../../data/dashboardData";

const ResourceMix = () => {
  const colors = resourceMix.colors;

  const donutStyle = {
    background: `
      conic-gradient(
        ${colors[0]} 0% 58%,
        ${colors[1]} 58% 74%,
        ${colors[2]} 74% 83%,
        ${colors[3]} 83% 90%,
        ${colors[4]} 90% 100%
      )
    `,
  };

  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={17} className="text-slate-400" />

          <h3 className="text-sm font-semibold text-slate-100">Resource Mix</h3>
        </div>

        <span className="rounded-lg border border-white/[0.06] bg-[#0d151d] px-2.5 py-1.5 text-[10px] text-slate-400">
          Today
        </span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        {/* DONUT */}

        <div
          className="relative h-28 w-28 shrink-0 rounded-full"
          style={donutStyle}
        >
          <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-[#0a0f14]">
            <span className="text-sm font-semibold text-white">
              {resourceMix.total.toLocaleString()}
            </span>

            <span className="text-[9px] text-slate-500">kWh</span>
          </div>
        </div>

        {/* LIST */}

        <div className="min-w-0 flex-1 space-y-2">
          {resourceMix.labels.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: colors[index],
                }}
              />

              <span className="min-w-0 flex-1 truncate text-[10px] text-slate-400">
                {label}
              </span>

              <span className="text-[10px] font-medium text-slate-300">
                {resourceMix.values[index]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILS */}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {resourceMix.labels.slice(0, 4).map((label, index) => (
          <div key={label} className="rounded-lg bg-white/[0.025] px-2.5 py-2">
            <p className="text-[9px] text-slate-600">{label}</p>

            <p className="mt-0.5 text-[11px] font-medium text-slate-300">
              {(resourceMix.consumption[index] || 0).toLocaleString()} kWh
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ResourceMix;
