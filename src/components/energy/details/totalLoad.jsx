import React from "react";

const formatValue = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (Math.abs(number) >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1)}B`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(number) >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }

  return number.toFixed(1);
};

const TotalLoad = ({ data }) => {
  const value = data?.totalValue?.value;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-sm font-medium capitalize text-slate-300">
        Total Load
      </h2>

      <div className="mt-4 flex min-w-0 items-end gap-2">
        <span className="truncate text-3xl font-semibold text-white sm:text-4xl">
          {formatValue(value)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400" />

        <span className="text-xs text-slate-400">Current load</span>
      </div>
    </div>
  );
};

export default TotalLoad;
