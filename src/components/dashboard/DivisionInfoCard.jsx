// import { Activity, ChevronRight } from "lucide-react";
// import Panel from "./Panel";
// import { useNavigate } from "react-router";

// const locations = [
//   {
//     name: "dyeing",
//     utilities: [
//       { name: "Electrical", value: "1,024 kW", color: "bg-emerald-400" },
//       { name: "Water", value: "820 m³", color: "bg-cyan-400" },
//       { name: "Steam", value: "540 kg/h", color: "bg-violet-400" },
//       { name: "Gas", value: "320 m³/h", color: "bg-amber-400" },
//       { name: "Air", value: "180 m³/h", color: "bg-sky-400" },
//     ],
//   },
//   {
//     name: "weaving",
//     utilities: [
//       { name: "Electrical", value: "842 kW", color: "bg-emerald-400" },
//       { name: "Water", value: "610 m³", color: "bg-cyan-400" },
//       { name: "Steam", value: "420 kg/h", color: "bg-violet-400" },
//       { name: "Gas", value: "250 m³/h", color: "bg-amber-400" },
//       { name: "Air", value: "150 m³/h", color: "bg-sky-400" },
//     ],
//   },
//   {
//     name: "apparel",
//     utilities: [
//       { name: "Electrical", value: "676 kW", color: "bg-emerald-400" },
//       { name: "Water", value: "480 m³", color: "bg-cyan-400" },
//       { name: "Steam", value: "310 kg/h", color: "bg-violet-400" },
//       { name: "Gas", value: "190 m³/h", color: "bg-amber-400" },
//       { name: "Air", value: "120 m³/h", color: "bg-sky-400" },
//     ],
//   },
//   {
//     name: "kgl",
//     utilities: [
//       { name: "Electrical", value: "512 kW", color: "bg-emerald-400" },
//       { name: "Water", value: "350 m³", color: "bg-cyan-400" },
//       { name: "Steam", value: "240 kg/h", color: "bg-violet-400" },
//       { name: "Gas", value: "140 m³/h", color: "bg-amber-400" },
//       { name: "Air", value: "90 m³/h", color: "bg-sky-400" },
//     ],
//   },
// ];

// const DivisionInfoCard = () => {
//   const navigate = useNavigate();

//   return (
//     <Panel className="overflow-hidden">
//       <div className="flex items-center gap-2 px-4 pt-4">
//         <Activity size={17} className="text-slate-400" />

//         <h3 className="text-sm font-semibold text-slate-100">Division Info</h3>
//       </div>

//       <div className="mt-3">
//         {locations.map((division, index) => (
//           <div
//             key={division.name}
//             className={`px-4 py-4 ${
//               index !== locations.length - 1
//                 ? "border-b border-white/[0.05]"
//                 : ""
//             }`}
//           >
//             {/* Division Header */}
//             <div className="flex items-center gap-3">
//               <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400" />

//               <span
//                 onClick={() => navigate(`/${division.name}`)}
//                 className="min-w-0 flex-1 text-xs font-semibold cursor-pointer text-slate-200 uppercase hover:underline"
//                 title={`Click to Navigate on ${division.name}`}
//               >
//                 {division.name}
//               </span>

//               <ChevronRight size={14} className="text-slate-600" />
//             </div>

//             {/* Utility Values */}
//             <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pl-5 sm:grid-cols-5">
//               {division.utilities.map((utility) => (
//                 <div key={utility.name} className="flex items-center gap-2">
//                   <span
//                     className={`h-2 w-2 shrink-0 rounded-full ${utility.color}`}
//                   />

//                   <div className="min-w-0">
//                     <p className="text-[10px] text-slate-500">{utility.name}</p>

//                     <p className="text-xs font-medium text-slate-200">
//                       {utility.value}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </Panel>
//   );
// };

// export default DivisionInfoCard;
import {
  Activity,
  ChevronRight,
  Droplets,
  Flame,
  Wind,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router";
import Panel from "./Panel";

const locations = [
  {
    name: "Dyeing",
    route: "/dyeing",
    color: "#22d3ee",
    utilities: [
      { name: "Electricity", value: "1,024 kW", color: "#34d399" },
      { name: "Water", value: "820 m³", color: "#22d3ee" },
      { name: "Steam", value: "540 kg/h", color: "#a78bfa" },
      { name: "Gas", value: "320 m³/h", color: "#fbbf24" },
      { name: "Air", value: "180 m³/h", color: "#60a5fa" },
    ],
  },
  {
    name: "Weaving",
    route: "/weaving",
    color: "#60a5fa",
    utilities: [
      { name: "Electricity", value: "842 kW", color: "#34d399" },
      { name: "Water", value: "610 m³", color: "#22d3ee" },
      { name: "Steam", value: "420 kg/h", color: "#a78bfa" },
      { name: "Gas", value: "250 m³/h", color: "#fbbf24" },
      { name: "Air", value: "150 m³/h", color: "#60a5fa" },
    ],
  },
  {
    name: "Apparel",
    route: "/apparel",
    color: "#a78bfa",
    utilities: [
      { name: "Electricity", value: "676 kW", color: "#34d399" },
      { name: "Water", value: "480 m³", color: "#22d3ee" },
      { name: "Steam", value: "310 kg/h", color: "#a78bfa" },
      { name: "Gas", value: "190 m³/h", color: "#fbbf24" },
      { name: "Air", value: "120 m³/h", color: "#60a5fa" },
    ],
  },
  {
    name: "KGL",
    route: "/kgl",
    color: "#34d399",
    utilities: [
      { name: "Electricity", value: "512 kW", color: "#34d399" },
      { name: "Water", value: "350 m³", color: "#22d3ee" },
      { name: "Steam", value: "240 kg/h", color: "#a78bfa" },
      { name: "Gas", value: "140 m³/h", color: "#fbbf24" },
      { name: "Air", value: "90 m³/h", color: "#60a5fa" },
    ],
  },
];

const utilityIcons = {
  Electricity: Zap,
  Water: Droplets,
  Steam: Flame,
  Gas: Flame,
  Air: Wind,
};

const DivisionInfoCard = () => {
  const navigate = useNavigate();

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Activity size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Division Utilities
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Current division overview
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          {locations.length} divisions
        </span>
      </div>

      <div className="grid gap-3 p-4 sm:p-5">
        {locations.map((division) => (
          <button
            key={division.name}
            type="button"
            onClick={() => navigate(division.route)}
            className="group w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition duration-200 hover:border-cyan-300/30 hover:bg-cyan-300/[0.04] focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: division.color,
                    boxShadow: `0 0 12px ${division.color}55`,
                  }}
                />

                <span className="text-sm font-semibold text-slate-100">
                  {division.name}
                </span>
              </div>

              <span className="flex items-center gap-1 text-[10px] text-cyan-300 opacity-80 transition group-hover:opacity-100">
                Open division
                <ChevronRight size={14} />
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {division.utilities.map((utility) => {
                const Icon = utilityIcons[utility.name] || Zap;

                return (
                  <div
                    key={utility.name}
                    className="min-w-0 rounded-xl border border-white/[0.05] bg-slate-950/30 p-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={13} style={{ color: utility.color }} />
                      <span className="truncate text-[10px] text-slate-400">
                        {utility.name}
                      </span>
                    </div>

                    <p className="mt-2 break-words text-xs font-semibold text-slate-200">
                      {utility.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
};

export default DivisionInfoCard;
