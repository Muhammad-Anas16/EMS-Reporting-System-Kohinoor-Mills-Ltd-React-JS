import React from "react";
import { Activity } from "lucide-react";

const DataLoading = ({ message = "Loading data..." }) => {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-[#070C11] px-4 font-sans text-white"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5">
          <Activity size={27} className="text-cyan-400" aria-hidden="true" />

          <span className="absolute inset-0 animate-spin rounded-2xl border-2 border-transparent border-t-cyan-400/70" />
        </div>

        <p className="text-sm font-medium text-white/85">{message}</p>

        <p className="mt-2 text-xs text-white/40">
          Please wait while we prepare your data.
        </p>

        <div className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400/70" />
        </div>
      </div>
    </main>
  );
};

export default DataLoading;
