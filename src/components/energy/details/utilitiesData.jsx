// import React from "react";

// const UtilitiesData = ({ data }) => {
//   // console.log(data?.dataType);

//   return (
//     <div className="flex h-full flex-col gap-2">
//       {/* {data?.utilities?.type?.map((type, ind) => ( // departments */}
//       {data?.departments?.type?.map((type, ind) => (
//         <div
//           key={ind}
//           className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center transition hover:bg-white/10"
//         >
//           <h1 className="text-sm font-medium capitalize text-white">
//             {type || "Not Defined"}
//           </h1>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UtilitiesData;
import React from "react";
import {
  Factory,
  Droplets,
  Wind,
  Flame,
  Zap,
  Gauge,
  Settings,
  Waves,
  CircleDot,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const UtilitiesData = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // console.log(data);
  const getTypeConfig = (type) => {
    const key = String(type || "")
      .toLowerCase()
      .trim();

    if (key.includes("dye")) {
      return {
        icon: Factory,
        iconClass: "text-fuchsia-400",
        bgClass: "bg-fuchsia-500/10",
        borderClass: "hover:border-fuchsia-400/40",
        glowClass: "group-hover:shadow-fuchsia-500/10",
      };
    }

    if (key.includes("water")) {
      return {
        icon: Droplets,
        iconClass: "text-cyan-400",
        bgClass: "bg-cyan-500/10",
        borderClass: "hover:border-cyan-400/40",
        glowClass: "group-hover:shadow-cyan-500/10",
      };
    }

    if (key.includes("air")) {
      return {
        icon: Wind,
        iconClass: "text-violet-400",
        bgClass: "bg-violet-500/10",
        borderClass: "hover:border-violet-400/40",
        glowClass: "group-hover:shadow-violet-500/10",
      };
    }

    if (key.includes("gas")) {
      return {
        icon: Flame,
        iconClass: "text-orange-400",
        bgClass: "bg-orange-500/10",
        borderClass: "hover:border-orange-400/40",
        glowClass: "group-hover:shadow-orange-500/10",
      };
    }

    if (key.includes("power") || key.includes("electric")) {
      return {
        icon: Zap,
        iconClass: "text-yellow-400",
        bgClass: "bg-yellow-500/10",
        borderClass: "hover:border-yellow-400/40",
        glowClass: "group-hover:shadow-yellow-500/10",
      };
    }

    if (key.includes("steam")) {
      return {
        icon: Waves,
        iconClass: "text-sky-400",
        bgClass: "bg-sky-500/10",
        borderClass: "hover:border-sky-400/40",
        glowClass: "group-hover:shadow-sky-500/10",
      };
    }

    if (key.includes("meter")) {
      return {
        icon: Gauge,
        iconClass: "text-emerald-400",
        bgClass: "bg-emerald-500/10",
        borderClass: "hover:border-emerald-400/40",
        glowClass: "group-hover:shadow-emerald-500/10",
      };
    }

    if (key.includes("utility")) {
      return {
        icon: Settings,
        iconClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        borderClass: "hover:border-blue-400/40",
        glowClass: "group-hover:shadow-blue-500/10",
      };
    }

    return {
      icon: CircleDot,
      iconClass: "text-slate-400",
      bgClass: "bg-slate-500/10",
      borderClass: "hover:border-slate-400/30",
      glowClass: "group-hover:shadow-slate-500/10",
    };
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {data?.departments?.type?.map((type, ind) => {
        const config = getTypeConfig(type);
        const Icon = config.icon;

        return (
          <div
            key={ind}
            className={`
              group relative overflow-hidden
              rounded-2xl
              border border-white/[0.08]
              bg-[#0A1118]/80
              px-3 py-3
              backdrop-blur-md
              transition-all duration-300
              hover:-translate-y-[1px]
              ${config.borderClass}
              ${config.glowClass}
              hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] cursor-pointer
            `}
            onClick={() => navigate(`${location.pathname}/${type}`)}
          >
            {/* Subtle hover glow */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-r
                from-white/[0.025]
                via-transparent
                to-transparent
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
            />

            <div className="relative z-10 flex items-center gap-3">
              {/* Icon */}
              <div
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl
                  border border-white/[0.06]
                  ${config.bgClass}
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className={config.iconClass}
                />
              </div>

              {/* Type */}
              <div className="min-w-0 flex-1">
                <h1
                  className="
                    truncate
                    text-sm
                    font-medium
                    capitalize
                    tracking-[0.01em]
                    text-slate-100
                  "
                >
                  {type || "Not Defined"}
                </h1>

                {/* Small accent line */}
                <div className="mt-1 h-[2px] w-8 rounded-full bg-white/10 transition-all duration-300 group-hover:w-12" />
              </div>

              {/* Arrow indicator */}
              <div
                className="
                  flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-lg
                  border border-white/[0.06]
                  bg-white/[0.02]
                  text-xs text-slate-500
                  transition-all duration-300
                  group-hover:border-white/10
                  group-hover:bg-white/[0.05]
                  group-hover:text-slate-300
                "
              >
                <span className="transition-transform duration-300 group-hover:translate-x-[1px]">
                  →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UtilitiesData;
