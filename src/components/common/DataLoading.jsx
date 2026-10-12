import React from "react";

const DataLoading = ({ message = "Loading data..." }) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#070C11] font-sans text-white">
      <div className="text-sm text-white/70">{message}</div>
    </main>
  );
};

export default DataLoading;
