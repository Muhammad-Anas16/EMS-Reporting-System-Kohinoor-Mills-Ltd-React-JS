import { Activity, ChevronRight } from "lucide-react";
import Panel from "./Panel";
import { useNavigate } from "react-router";

const locations = [
  {
    name: "dyeing",
    utilities: [
      { name: "Electrical", value: "1,024 kW", color: "bg-emerald-400" },
      { name: "Water", value: "820 m³", color: "bg-cyan-400" },
      { name: "Steam", value: "540 kg/h", color: "bg-violet-400" },
      { name: "Gas", value: "320 m³/h", color: "bg-amber-400" },
      { name: "Air", value: "180 m³/h", color: "bg-sky-400" },
    ],
  },
  {
    name: "weaving",
    utilities: [
      { name: "Electrical", value: "842 kW", color: "bg-emerald-400" },
      { name: "Water", value: "610 m³", color: "bg-cyan-400" },
      { name: "Steam", value: "420 kg/h", color: "bg-violet-400" },
      { name: "Gas", value: "250 m³/h", color: "bg-amber-400" },
      { name: "Air", value: "150 m³/h", color: "bg-sky-400" },
    ],
  },
  {
    name: "apparel",
    utilities: [
      { name: "Electrical", value: "676 kW", color: "bg-emerald-400" },
      { name: "Water", value: "480 m³", color: "bg-cyan-400" },
      { name: "Steam", value: "310 kg/h", color: "bg-violet-400" },
      { name: "Gas", value: "190 m³/h", color: "bg-amber-400" },
      { name: "Air", value: "120 m³/h", color: "bg-sky-400" },
    ],
  },
  {
    name: "kgl",
    utilities: [
      { name: "Electrical", value: "512 kW", color: "bg-emerald-400" },
      { name: "Water", value: "350 m³", color: "bg-cyan-400" },
      { name: "Steam", value: "240 kg/h", color: "bg-violet-400" },
      { name: "Gas", value: "140 m³/h", color: "bg-amber-400" },
      { name: "Air", value: "90 m³/h", color: "bg-sky-400" },
    ],
  },
];

const DivisionInfoCard = () => {
  const navigate = useNavigate();

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4">
        <Activity size={17} className="text-slate-400" />

        <h3 className="text-sm font-semibold text-slate-100">Division Info</h3>
      </div>

      <div className="mt-3">
        {locations.map((division, index) => (
          <div
            key={division.name}
            className={`px-4 py-4 ${
              index !== locations.length - 1
                ? "border-b border-white/[0.05]"
                : ""
            }`}
          >
            {/* Division Header */}
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" />

              <span
                onClick={() => navigate(`/${division.name}`)}
                className="min-w-0 flex-1 text-xs font-semibold cursor-pointer text-slate-200 uppercase hover:underline"
                title={`Click to Navigate on ${division.name}`}
              >
                {division.name}
              </span>

              <ChevronRight size={14} className="text-slate-600" />
            </div>

            {/* Utility Values */}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pl-5 sm:grid-cols-5">
              {division.utilities.map((utility) => (
                <div key={utility.name} className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${utility.color}`}
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">{utility.name}</p>

                    <p className="text-xs font-medium text-slate-200">
                      {utility.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default DivisionInfoCard;
