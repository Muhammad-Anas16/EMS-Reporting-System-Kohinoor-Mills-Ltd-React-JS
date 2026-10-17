import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

const DataError = ({
  error,
  onRetry,
  message = "Something went wrong",
  buttonText = "Try Again",
}) => {
  const errorMessage =
    typeof error === "string" ? error : error?.message || message;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#070C11] px-4 font-sans text-white">
      <section
        role="alert"
        className="w-full max-w-md rounded-2xl border border-red-400/15 bg-[#0B121A] p-6 text-center shadow-xl shadow-black/20 sm:p-8"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
          <AlertCircle size={27} className="text-red-400" aria-hidden="true" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-white">
          Unable to Load Data
        </h2>

        <p className="mx-auto mt-2 max-w-sm break-words text-sm leading-6 text-white/60">
          {errorMessage}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            <RefreshCw size={15} aria-hidden="true" />
            {buttonText}
          </button>
        )}
      </section>
    </main>
  );
};

export default DataError;
