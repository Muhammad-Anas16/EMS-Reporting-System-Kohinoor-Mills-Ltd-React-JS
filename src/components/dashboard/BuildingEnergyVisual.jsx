import { Droplets, Flame, MapPin, Sun, Thermometer, Zap } from "lucide-react";
import Panel from "./Panel";
import buildingImage from "../../assets/image.jpg";
import { buildingEnergy } from "../../data/dashboardData";

const iconMap = {
  sun: Sun,
  zap: Zap,
  droplet: Droplets,
  flame: Flame,
  thermometer: Thermometer,
};

const positionMap = {
  "top-left": "left-[2%] top-[12%] sm:left-[7%] sm:top-[13%]",

  "middle-left": "left-[2%] top-[41%] sm:left-[3%] sm:top-[43%]",

  "bottom-left": "left-[2%] top-[69%] sm:left-[6%] sm:top-[69%]",

  "top-right": "right-[2%] top-[16%] sm:right-[5%] sm:top-[17%]",

  "middle-right": "right-[2%] top-[42%] sm:right-[3%] sm:top-[43%]",

  "bottom-right": "right-[2%] top-[69%] sm:right-[6%] sm:top-[69%]",
};

const EnergyValue = ({ item }) => {
  const Icon = iconMap[item.icon] || Zap;

  const isLeft = item.position?.includes("left");

  return (
    <div className={`absolute z-20 ${positionMap[item.position] || ""}`}>
      <div
        className="relative flex min-w-[125px] items-center gap-2.5 rounded-2xl border bg-[#071017]/95 px-3 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:min-w-[145px]"
        style={{
          borderColor: `${item.color}66`,
        }}
      >
        {/* ICON */}

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            color: item.color,
            backgroundColor: `${item.color}18`,
          }}
        >
          <Icon size={18} />
        </div>

        {/* VALUE */}

        <div className="min-w-0">
          <p className="text-[10px] font-medium text-slate-400 sm:text-[11px]">
            {item.name}
          </p>

          <p className="mt-0.5 whitespace-nowrap text-sm font-semibold text-white sm:text-base">
            {item.value} {item.unit}
          </p>
        </div>

        {/* CONNECTING LINE */}

        <div
          className={`absolute top-1/2 h-px ${
            isLeft
              ? "-right-10 w-10 sm:-right-16 sm:w-16"
              : "-left-10 w-10 sm:-left-16 sm:w-16"
          }`}
          style={{
            backgroundColor: item.color,
            boxShadow: `0 0 8px ${item.color}`,
          }}
        />

        {/* POINT */}

        <div
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
            isLeft
              ? "-right-[44px] sm:-right-[68px]"
              : "-left-[44px] sm:-left-[68px]"
          }`}
          style={{
            backgroundColor: item.color,
            boxShadow: `0 0 14px ${item.color}`,
          }}
        />
      </div>
    </div>
  );
};

const BuildingEnergyVisual = () => {
  return (
    <Panel className="overflow-hidden">
      {/* HEADER */}

      <div className="relative z-30 flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin size={16} className="shrink-0 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[10px] text-emerald-300">Live</span>
        </div>
      </div>

      {/* IMAGE AREA */}

      <div className="relative min-h-[430px] overflow-hidden bg-[#070b0f] sm:min-h-[500px]">
        {/* BACKGROUND IMAGE */}

        <img
          src={buildingImage}
          alt={`energy overview`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,13,0.08)_0%,rgba(5,9,13,0.08)_55%,rgba(5,9,13,0.68)_100%)]" />

        {/* SOFT CENTER GLOW */}

        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.04] blur-3xl" />

        {/* ENERGY VALUES */}

        {buildingEnergy.map((item) => (
          <EnergyValue key={item.id} item={item} />
        ))}

      </div>
    </Panel>
  );
};

export default BuildingEnergyVisual;
