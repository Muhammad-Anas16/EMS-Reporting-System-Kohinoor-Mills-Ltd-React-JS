import { useMemo } from "react";
import { useParams } from "react-router";
import {
  Activity,
  Zap,
  Gauge,
  Radio,
  RefreshCw,
  CircleCheck,
  CircleAlert,
  ArrowLeft,
} from "lucide-react";

import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";
import DataLoading from "@/components/common/DataLoading";
import DataError from "@/components/common/DataError";

const formatNumber = (value, digits = 2) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(number);
};

const getPower = (meter) => {
  const power = meter?.readings?.power;

  if (Number.isFinite(power?.liveValue)) return power.liveValue;
  if (Number.isFinite(power?.value)) return power.value;

  // Support legacy API response formats.
  if (Number.isFinite(meter?.power?.liveValue)) {
    return meter.power.liveValue;
  }

  if (Number.isFinite(meter?.power?.value)) {
    return meter.power.value;
  }

  if (Number.isFinite(meter?.liveValue)) return meter.liveValue;
  if (Number.isFinite(meter?.value)) return meter.value;

  return null;
};

const getMeterStatus = (meter) => {
  const power = meter?.readings?.power;

  return (
    power?.hasLiveValue === true ||
    meter?.hasLiveValue === true ||
    Number.isFinite(power?.liveValue)
  );
};

const MetricCard = ({
  title,
  value,
  unit,
  description,
  icon: Icon,
  accent = "cyan",
}) => {
  const accents = {
    cyan: "text-cyan-400 bg-cyan-400/10",
    blue: "text-blue-400 bg-blue-400/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    violet: "text-violet-400 bg-violet-400/10",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="break-words text-3xl font-semibold tracking-tight text-white">
              {value}
            </span>

            <span className="text-sm text-slate-400">{unit}</span>
          </div>
        </div>

        <div className={`rounded-xl p-3 ${accents[accent] || accents.cyan}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
};

const CurrentLoadPage = () => {
  const { divisionName } = useParams();

  const division = useMemo(() => {
    const rawDivision = decodeURIComponent(divisionName || "Dyeing").trim();

    return rawDivision || "Dyeing";
  }, [divisionName]);

  const {
    data: utilities,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useAuroraDyeingUtilities(division);

  const meters = useMemo(
    () => (Array.isArray(utilities?.Data) ? utilities.Data : []),
    [utilities],
  );

  const incomingItems = useMemo(
    () =>
      Array.isArray(utilities?.incoming?.data) ? utilities.incoming.data : [],
    [utilities],
  );

  const htGroupItems = useMemo(
    () =>
      Array.isArray(utilities?.htGroups?.data) ? utilities.htGroups.data : [],
    [utilities],
  );

  const totalLoad = useMemo(() => {
    const apiTotal = Number(utilities?.totalLoad?.value);

    if (
      utilities?.totalLoad?.value !== null &&
      utilities?.totalLoad?.value !== undefined &&
      utilities?.totalLoad?.value !== "" &&
      Number.isFinite(apiTotal)
    ) {
      return apiTotal;
    }

    const legacyTotal = Number(utilities?.totalValue?.value);

    if (
      utilities?.totalValue?.value !== null &&
      utilities?.totalValue?.value !== undefined &&
      utilities?.totalValue?.value !== "" &&
      Number.isFinite(legacyTotal)
    ) {
      return legacyTotal;
    }

    return null;
  }, [utilities]);

  const incomingLoad = useMemo(() => {
    const allowedSources = ["lesco", "kgl", "solar"];

    const readings = incomingItems.filter((item) =>
      allowedSources.includes(String(item?.key || "").toLowerCase()),
    );

    const values = readings
      .map((item) => {
        if (Number.isFinite(item?.liveValue)) return item.liveValue;
        if (Number.isFinite(item?.value)) return item.value;
        return null;
      })
      .filter((value) => value !== null);

    return {
      value: values.length
        ? values.reduce((sum, value) => sum + value, 0)
        : null,
      count: values.length,
    };
  }, [incomingItems]);

  const htGroupLoad = useMemo(() => {
    const readings = htGroupItems.filter(
      (item) => String(item?.metric || "").toLowerCase() === "power",
    );

    const values = readings
      .map((item) => {
        if (Number.isFinite(item?.liveValue)) return item.liveValue;
        if (Number.isFinite(item?.value)) return item.value;
        return null;
      })
      .filter((value) => value !== null);

    return {
      value: values.length
        ? values.reduce((sum, value) => sum + value, 0)
        : null,
      count: values.length,
    };
  }, [htGroupItems]);

  const liveMeters = meters.filter(getMeterStatus).length;
  const hasLiveData =
    liveMeters > 0 ||
    incomingItems.some((item) => item?.hasLiveValue === true) ||
    htGroupItems.some((item) => item?.hasLiveValue === true);

  if (isPending) {
    return <DataLoading />;
  }

  if (isError) {
    return <DataError error={error} onRetry={refetch} />;
  }

  if (!utilities || typeof utilities !== "object") {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <h1 className="text-2xl font-semibold">Current Load</h1>
        <p className="mt-3 text-slate-400">
          Utilities data is not available for {division}.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-400"
        >
          Try Again
        </button>
      </main>
    );
  }

  const unit =
    utilities?.totalLoad?.unit || utilities?.totalValue?.unit || "kW*";

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Zap className="h-4 w-4 text-cyan-400" />
              Energy Management System
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Current Load
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {division} division electrical load monitoring
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Updating..." : "Refresh Data"}
          </button>
        </header>

        {/* Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2">
            {hasLiveData ? (
              <CircleCheck className="h-5 w-5 text-emerald-400" />
            ) : (
              <CircleAlert className="h-5 w-5 text-amber-400" />
            )}

            <span className="text-sm text-slate-300">
              {hasLiveData
                ? "Live readings available"
                : "No confirmed live readings"}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {dataUpdatedAt
              ? `Last query update: ${new Date(dataUpdatedAt).toLocaleTimeString()}`
              : "Waiting for first update"}
          </div>
        </div>

        {/* Summary Cards */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Load Overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              Summary of available electrical readings
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              title="Total Current Load"
              value={totalLoad === null ? "—" : formatNumber(totalLoad)}
              unit={unit}
              description="Total calculated by the utilities API"
              icon={Zap}
              accent="cyan"
            />

            <MetricCard
              title="Incoming Sources"
              value={
                incomingLoad.value === null
                  ? "—"
                  : formatNumber(incomingLoad.value)
              }
              unit="configured units"
              description={`${incomingLoad.count} incoming source readings available`}
              icon={Activity}
              accent="blue"
            />

            <MetricCard
              title="HT Groups Power"
              value={
                htGroupLoad.value === null
                  ? "—"
                  : formatNumber(htGroupLoad.value)
              }
              unit="configured units"
              description={`${htGroupLoad.count} HT power readings available`}
              icon={Gauge}
              accent="violet"
            />
          </div>
        </section>

        {/* Meter Table */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-semibold">Meter Details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Configured meters and their reported power readings
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Radio className="h-4 w-4" />
              {liveMeters} / {meters.length} live meters
            </div>
          </div>

          {meters.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Gauge className="mx-auto h-9 w-9 text-slate-600" />
              <h3 className="mt-3 font-medium text-slate-300">No meter data</h3>
              <p className="mt-1 text-sm text-slate-500">
                No configured meter readings were returned for {division}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Meter</th>
                    <th className="px-5 py-4 font-medium">Instance</th>
                    <th className="px-5 py-4 font-medium">Power</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {meters.map((meter, index) => {
                    const power = getPower(meter);
                    const live = getMeterStatus(meter);

                    return (
                      <tr
                        key={`${meter?.instance ?? meter?.name ?? "meter"}-${index}`}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4 font-medium text-slate-200">
                          {meter?.name ||
                            meter?.department ||
                            meter?.title ||
                            `Meter ${index + 1}`}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {meter?.instance ?? "—"}
                        </td>

                        <td className="px-5 py-4 font-semibold text-white">
                          {power === null ? "—" : formatNumber(power)}
                          <span className="ml-2 text-xs font-normal text-slate-500">
                            {meter?.readings?.power?.unit || unit}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 ${
                              live ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                live ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            {live ? "Live" : "Unavailable"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Incoming Sources */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="border-b border-white/10 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">Incoming Source Readings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Incoming values are shown separately from total load
            </p>
          </div>

          {incomingItems.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">
              No incoming sources are configured for {division}.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {incomingItems.map((item, index) => {
                const value = Number.isFinite(item?.liveValue)
                  ? item.liveValue
                  : Number.isFinite(item?.value)
                    ? item.value
                    : null;

                return (
                  <div
                    key={`${item?.key || "incoming"}-${item?.instance ?? index}`}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm capitalize text-slate-400">
                        {(item?.key || "Incoming source").replaceAll("_", " ")}
                      </p>
                      <Activity className="h-4 w-4 text-cyan-400" />
                    </div>

                    <p className="mt-3 break-words text-xl font-semibold text-white">
                      {value === null ? "—" : formatNumber(value)}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Instance: {item?.instance ?? "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* HT Groups */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="border-b border-white/10 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">HT Group Readings</h2>
            <p className="mt-1 text-sm text-slate-400">
              Power readings from configured HT group meters
            </p>
          </div>

          {htGroupItems.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">
              No HT Group readings are configured for {division}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Group / Meter</th>
                    <th className="px-5 py-4 font-medium">Metric</th>
                    <th className="px-5 py-4 font-medium">Instance</th>
                    <th className="px-5 py-4 font-medium">Value</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {htGroupItems.map((item, index) => {
                    const value = Number.isFinite(item?.liveValue)
                      ? item.liveValue
                      : Number.isFinite(item?.value)
                        ? item.value
                        : null;

                    return (
                      <tr
                        key={`${item?.path || "ht"}-${item?.metric || ""}-${index}`}
                        className="hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4 text-slate-200">
                          {item?.path ||
                            item?.groupPath ||
                            item?.meter ||
                            "HT Group"}
                        </td>

                        <td className="px-5 py-4 capitalize text-slate-400">
                          {item?.metric || "—"}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {item?.instance ?? "—"}
                        </td>

                        <td className="px-5 py-4 font-medium text-white">
                          {value === null ? "—" : formatNumber(value)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="rounded-xl border border-amber-400/10 bg-amber-400/[0.03] p-4 text-xs leading-5 text-slate-400">
          Power units and meter scaling must match your BACnet configuration.
          Incoming sources and HT group values are displayed separately to avoid
          double-counting. This page does not add them to the API total.
        </footer>
      </div>
    </main>
  );
};

export default CurrentLoadPage;
