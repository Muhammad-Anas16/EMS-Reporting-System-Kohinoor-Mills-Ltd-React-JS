// import { Droplets, Flame, MapPin, Sun, Thermometer, Zap } from "lucide-react";
// import Panel from "./Panel";
// import buildingImage from "../../assets/image.jpg";
// import { buildingEnergy } from "../../data/dashboardData";

// const iconMap = {
//   sun: Sun,
//   zap: Zap,
//   droplet: Droplets,
//   flame: Flame,
//   thermometer: Thermometer,
// };

// const positionMap = {
//   "top-left": "left-[2%] top-[12%] sm:left-[7%] sm:top-[13%]",
//   "middle-left": "left-[2%] top-[41%] sm:left-[3%] sm:top-[43%]",
//   "bottom-left": "left-[2%] top-[69%] sm:left-[6%] sm:top-[69%]",
//   "top-right": "right-[2%] top-[16%] sm:right-[5%] sm:top-[17%]",
//   "middle-right": "right-[2%] top-[42%] sm:right-[3%] sm:top-[43%]",
//   "bottom-right": "right-[2%] top-[69%] sm:right-[6%] sm:top-[69%]",
// };

// const EnergyValue = ({ item }) => {
//   const Icon = iconMap[item.icon] || Zap;

//   const isLeft = item.position?.includes("left");

//   return (
//     <div className={`absolute z-20 ${positionMap[item.position] || ""}`}>
//       <div
//         className="relative flex min-w-[125px] items-center gap-2.5 rounded-2xl border bg-[#071017]/95 px-3 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:min-w-[145px]"
//         style={{
//           borderColor: `${item.color}66`,
//         }}
//       >
//         {/* ICON */}

//         <div
//           className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
//           style={{
//             color: item.color,
//             backgroundColor: `${item.color}18`,
//           }}
//         >
//           <Icon size={18} />
//         </div>

//         {/* VALUE */}

//         <div className="min-w-0">
//           <p className="text-[10px] font-medium text-slate-400 sm:text-[11px]">
//             {item.name}
//           </p>

//           <p className="mt-0.5 whitespace-nowrap text-sm font-semibold text-white sm:text-base">
//             {item.value} {item.unit}
//           </p>
//         </div>

//         {/* CONNECTING LINE */}

//         <div
//           className={`absolute top-1/2 h-px ${
//             isLeft
//               ? "-right-10 w-10 sm:-right-16 sm:w-16"
//               : "-left-10 w-10 sm:-left-16 sm:w-16"
//           }`}
//           style={{
//             backgroundColor: item.color,
//             boxShadow: `0 0 8px ${item.color}`,
//           }}
//         />

//         {/* POINT */}

//         <div
//           className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
//             isLeft
//               ? "-right-[44px] sm:-right-[68px]"
//               : "-left-[44px] sm:-left-[68px]"
//           }`}
//           style={{
//             backgroundColor: item.color,
//             boxShadow: `0 0 14px ${item.color}`,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// const BuildingEnergyVisual = () => {
//   return (
//     <Panel className="overflow-hidden">
//       {/* HEADER */}

//       <div className="relative z-30 flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
//         <div className="flex min-w-0 items-center gap-2">
//           <MapPin size={16} className="shrink-0 text-slate-400" />
//         </div>

//         <div className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-2.5 py-1">
//           <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

//           <span className="text-[10px] text-emerald-300">Live</span>
//         </div>
//       </div>

//       {/* IMAGE AREA */}

//       <div className="relative min-h-[430px] overflow-hidden bg-[#070b0f] sm:min-h-[500px]">
//         {/* BACKGROUND IMAGE */}

//         <img
//           src={buildingImage}
//           alt={`energy overview`}
//           className="absolute inset-0 h-full w-full object-cover object-center"
//         />

//         {/* DARK OVERLAY */}

//         <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.08)_0%,rgba(5,9,13,0.08)_55%,rgba(5,9,13,0.68)_100%)]" />

//         {/* SOFT CENTER GLOW */}

//         <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.04] blur-3xl" />

//         {/* ENERGY VALUES */}

//         {buildingEnergy.map((item) => (
//           <EnergyValue key={item.id} item={item} />
//         ))}

//       </div>
//     </Panel>
//   );
// };

// export default BuildingEnergyVisual;
import {
  ArrowUpRight,
  Building2,
  ChevronRight,
  Droplets,
  Factory,
  Flame,
  Gauge,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router";
import Panel from "./Panel";
import buildingImage from "../../assets/kohinoor.jpg";

const divisions = [
  {
    name: "Dyeing",
    subtitle: "Dyeing Division",
    route: "/dyeing",
    icon: Droplets,
    position: "left-[5%] top-[23%]",
    color: "#22d3ee",
  },
  {
    name: "Weaving",
    subtitle: "Weaving Division",
    route: "/weaving",
    icon: Factory,
    position: "left-[52%] top-[17%]",
    color: "#60a5fa",
  },
  {
    name: "Apparel",
    subtitle: "Apparel Division",
    route: "/apparel",
    icon: Building2,
    position: "left-[8%] top-[66%]",
    color: "#a78bfa",
  },
  {
    name: "KGL",
    subtitle: "KGL Division",
    route: "/kgl",
    icon: Gauge,
    position: "right-[5%] top-[62%]",
    color: "#34d399",
  },
];

const BuildingEnergyVisual = () => {
  const navigate = useNavigate();

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
            <Factory size={21} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Factory Overview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Select a division to open its dashboard
            </p>
          </div>
        </div>

        <span className="glass-status text-[10px]">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Factory Map
        </span>
      </div>

      <div className="relative min-h-[390px] overflow-hidden bg-[#06111e] sm:min-h-[490px]">
        <img
          src={buildingImage}
          alt="Kohinoor Mills factory aerial view"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-[#04101d]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04101d]/20 via-transparent to-[#04101d]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04101d]/30 via-transparent to-[#04101d]/20" />

        <div className="absolute left-4 top-4 z-10 max-w-[75%] rounded-xl border border-white/15 bg-slate-950/55 px-3 py-2 backdrop-blur-xl sm:left-5 sm:top-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
            Kohinoor Mills
          </p>
          <p className="mt-1 text-xs text-white">Division navigation map</p>
        </div>

        {divisions.map((division) => {
          const Icon = division.icon;

          return (
            <button
              key={division.name}
              type="button"
              onClick={() => navigate(division.route)}
              aria-label={`Open ${division.name} division`}
              className={`absolute z-20 ${division.position} group flex max-w-[48%] items-center gap-2 rounded-xl border border-white/20 bg-slate-950/75 px-2.5 py-2 text-left shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:gap-3 sm:px-4 sm:py-3`}
              style={{
                boxShadow: `0 8px 32px ${division.color}18`,
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${division.color}20`,
                  color: division.color,
                }}
              >
                <Icon size={18} />
              </span>

              <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-white sm:text-sm">
                  {division.name}
                </span>
                <span className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                  {division.subtitle}
                </span>
              </span>

              <ChevronRight
                size={15}
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
              />
            </button>
          );
        })}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
          <div className="rounded-xl border border-white/10 bg-slate-950/65 px-3 py-2 backdrop-blur-xl">
            <p className="text-[10px] text-slate-400">Available divisions</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {divisions.length} locations
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-slate-950/65 px-3 py-2 text-xs text-cyan-200 backdrop-blur-xl">
            <ArrowUpRight size={14} />
            <span>Explore divisions</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default BuildingEnergyVisual;
