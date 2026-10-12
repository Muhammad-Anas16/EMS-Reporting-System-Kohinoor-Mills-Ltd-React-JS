import React from "react";

const EnergyPill = ({ item }) => {
  const Icon = item.icon;
  const isIconRight = item.iconPosition === "right";

  return (
    <div
      className="group relative flex items-center justify-between gap-3 rounded-full border bg-[#0a121d]/90 px-4 py-4  backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-xl"
      style={{
        borderColor: `${item.color}80`,
        boxShadow: `0 0 18px ${item.color}25`,
      }}
    >
      {/* Icon Left */}
      {!isIconRight && (
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          style={{
            borderColor: item.color,
            backgroundColor: `${item.color}25`,
            boxShadow: `0 0 10px ${item.color}40`,
          }}
        >
          <Icon size={18} style={{ color: item.color }} />
        </div>
      )}

      {/* Label & Value */}
      <div className="flex flex-col min-w-[75px]">
        <span className="text-[11px] font-medium text-slate-300 tracking-wide">
          {item.name}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-white tracking-tight">
            {item.value}
          </span>
          <span className="text-[10px] font-normal text-slate-400">
            {item.unit}
          </span>
        </div>
      </div>

      {/* Icon Right */}
      {isIconRight && (
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          style={{
            borderColor: item.color,
            backgroundColor: `${item.color}25`,
            boxShadow: `0 0 10px ${item.color}40`,
          }}
        >
          <Icon size={18} style={{ color: item.color }} />
        </div>
      )}
    </div>
  );
};

export default EnergyPill;
