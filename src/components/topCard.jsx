import {
  Activity,
  Droplets,
  Flame,
  Gauge,
  PlugZap,
  Sun,
  TrendingDown,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";

const iconMap = {
  overall: Gauge,
  generation: PlugZap,
  solar: Sun,
  consumption: Activity,
  water: Droplets,
  air: Wind,
  steam: Flame,
  zap: Zap,
};

const colorMap = {
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/10",
  amber: "bg-amber-400/10 text-amber-300 ring-amber-300/10",
  blue: "bg-sky-400/10 text-sky-300 ring-sky-300/10",
  cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-300/10",
  orange: "bg-orange-400/10 text-orange-300 ring-orange-300/10",
  violet: "bg-violet-400/10 text-violet-300 ring-violet-300/10",
  red: "bg-red-400/10 text-red-300 ring-red-300/10",
};

const TopCard = ({ card }) => {
  const Icon = iconMap[card?.icon] || Zap;

  const iconColor = colorMap[card?.iconTone] || colorMap.emerald;

  const isDown = card?.trend === "down";

  const TrendIcon = isDown ? TrendingDown : TrendingUp;

  const trendColor = isDown ? "text-emerald-300" : "text-amber-300";

  return (
    <article
      className="
        rounded-2xl
        border border-white/[0.07]
        bg-[#0a0f14]
        p-4
        shadow-[0_12px_40px_rgba(0,0,0,0.16)]
        transition duration-200
        hover:-translate-y-0.5
        hover:border-white/[0.1]
        sm:p-5
      "
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            ring-1
            ${iconColor}
          `}
        >
          <Icon size={23} strokeWidth={1.8} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          {/* TITLE */}
          <p className="text-xs font-medium text-slate-400">
            {card?.title || "Energy"}
          </p>

          {/* VALUE */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="truncate text-[26px] font-semibold tracking-tight text-slate-100">
              {card?.value ?? "0"}
            </span>

            {card?.unit && (
              <span className="text-sm text-slate-300">{card.unit}</span>
            )}
          </div>

          {/* CHANGE */}
          <div className="mt-2 flex items-center gap-2">
            <div
              className={`
                flex
                items-center
                gap-1
                text-xs
                font-semibold
                ${trendColor}
              `}
            >
              <TrendIcon size={13} />
              {card?.change ?? "0%"}
            </div>

            <span className="text-[10px] text-slate-500">
              {card?.comparison || "vs. yesterday"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TopCard;
