import React from "react";

const DataError = ({
  error,
  onRetry,
  message = "Something went wrong",
  buttonText = "Try Again",
}) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#070C11] font-sans text-white">
      <div className="text-center">
        <p className="text-sm text-red-400">{error?.message || message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            {buttonText}
          </button>
        )}
      </div>
    </main>
  );
};

export default DataError;
