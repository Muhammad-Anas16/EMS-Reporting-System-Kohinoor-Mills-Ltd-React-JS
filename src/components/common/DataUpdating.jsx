import React from "react";

const DataUpdating = ({ message = "Updating..." }) => {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 rounded-lg border border-white/10 bg-[#090F15]/90 px-3 py-2 text-xs text-white/60 backdrop-blur-md">
      {message}
    </div>
  );
};

export default DataUpdating;
