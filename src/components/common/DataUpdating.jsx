import React from "react";
import { RefreshCw } from "lucide-react";

const DataUpdating = ({ message = "Updating..." }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-[#090F15]/95 px-3.5 py-2.5 text-xs font-medium text-white/75 shadow-lg shadow-black/20 backdrop-blur-md"
    >
      <RefreshCw
        size={14}
        className="animate-spin text-cyan-400"
        aria-hidden="true"
      />

      <span>{message}</span>
    </div>
  );
};

export default DataUpdating;
