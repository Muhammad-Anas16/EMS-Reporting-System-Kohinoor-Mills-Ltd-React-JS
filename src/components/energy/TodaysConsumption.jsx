import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Clock3,
  RefreshCw,
  Zap,
  Gauge,
  AlertTriangle,
  Radio,
} from "lucide-react";

import { bacnetRead } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";

const REFRESH_INTERVAL = 30_000;

const normalizeDivision = (value) => {
  try {
    return decodeURIComponent(String(value ?? "Dyeing"))
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  } catch {
    return String(value ?? "Dyeing")
      .trim()
      .toLowerCase();
  }
};

const formatNumber = (value, digits = 2) => {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("en-US", {
        maximumFractionDigits: digits,
      })
    : "—";
};

const getInstance = (item) => {
  const value = item?.instance ?? item?.objectInstance;

  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);

  return Number.isSafeInteger(number) && number >= 0 ? number : null;
};

const getValue = (item) => {
  const candidates = [
    item?.value,
    item?.presentValue,
    item?.present_value,
    item?.currentValue,
    item?.current_value,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") {
      continue;
    }

    const number = Number(candidate);

    if (Number.isFinite(number)) return number;
  }

  return null;
};

const getDivisionMeters = (division) => {
  const result = getSpecificValue(null, division);
  const meters = result?.[division];

  if (!Array.isArray(meters)) return [];

  return meters;
};

const getKwhInstance = (meter) => {
  const value = meter?.kwh;

  if (value === null || value === undefined || value === "") return null;

  const instance = Number(value);

  return Number.isSafeInteger(instance) && instance >= 0 ? instance : null;
};

const readKwhMeters = async (division) => {
  const meters = getDivisionMeters(division);

  const configuredMeters = meters
    .map((meter, index) => ({
      key: meter?.meter_key || `${meter?.department || "meter"}-${index}`,
      name:
        meter?.meter_name || meter?.name || meter?.meter_key || "Unnamed meter",
      department: meter?.department || "Unassigned",
      instance: getKwhInstance(meter),
    }))
    .filter((meter) => meter.instance !== null);

  const uniqueInstances = [
    ...new Set(configuredMeters.map((meter) => meter.instance)),
  ];

  if (!uniqueInstances.length) {
    return {
      meters: [],
      success: false,
      message: `No kWh meter instances configured for ${division}.`,
      updatedAt: new Date().toISOString(),
    };
  }

  const response = await bacnetRead(uniqueInstances);

  const responseItems = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const normalizedItems = responseItems.flatMap((item) => {
    const parentInstance = getInstance(item);

    if (Array.isArray(item?.found)) {
      return item.found.map((found) => ({
        instance: getInstance(found) ?? parentInstance,
        value: getValue(found),
      }));
    }

    const instance =
      parentInstance ??
      getInstance({
        instance: item?.requestedInstance,
      });

    return instance === null ? [] : [{ instance, value: getValue(item) }];
  });

  const valueByInstance = new Map();

  normalizedItems.forEach((item) => {
    if (item.instance !== null && item.value !== null) {
      valueByInstance.set(item.instance, item.value);
    }
  });

  const resultMeters = configuredMeters.map((meter) => ({
    ...meter,
    value: valueByInstance.get(meter.instance) ?? null,
    available: valueByInstance.has(meter.instance),
  }));

  return {
    meters: resultMeters,
    success: response?.success !== false,
    message: response?.message || "",
    updatedAt: new Date().toISOString(),
  };
};

const StatCard = ({ title, value, unit, description, icon: Icon }) => (
  <section className="rounded-2xl border border-white/[0.08] bg-[#0b131d] p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {value}
          {unit && (
            <span className="ml-2 text-sm font-medium text-slate-400">
              {unit}
            </span>
          )}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] p-3">
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
    </div>
  </section>
);

const TodaysConsumption = () => {
  const { divisionName } = useParams();
  const navigate = useNavigate();

  const division = useMemo(
    () => normalizeDivision(divisionName || "Dyeing"),
    [divisionName],
  );

  const divisionLabel = division.replace(/\b\w/g, (char) => char.toUpperCase());

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ["todaysConsumption", division],
    queryFn: () => readKwhMeters(division),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 10_000,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const meters = data?.meters ?? [];
  const availableMeters = meters.filter(
    (meter) => meter.available && Number.isFinite(meter.value),
  );

  // These are meter register readings, NOT today's energy consumption.
  const totalRegisterReading = availableMeters.reduce(
    (total, meter) => total + meter.value,
    0,
  );

  const lastUpdated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString()
    : dataUpdatedAt
      ? new Date(dataUpdatedAt).toLocaleString()
      : "Not updated yet";

  return (
    <main className="min-h-screen bg-[#070c11] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Energy Management System
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Today's Consumption
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {divisionLabel} · Daily energy monitoring
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.06] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <span className="inline-flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-4 w-4 text-cyan-300" />
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>

          <span className="hidden h-4 w-px bg-white/10 sm:block" />

          <span className="inline-flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-4 w-4 text-cyan-300" />
            Last refreshed: {lastUpdated}
          </span>

          <span className="ml-auto inline-flex items-center gap-2 text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Auto-refresh: 30 seconds
          </span>
        </div>

        {isPending ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0b131d]">
            <div className="text-center">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-cyan-300" />
              <p className="mt-3 text-sm text-slate-400">
                Loading configured kWh meters...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-6">
            <AlertTriangle className="h-6 w-6 text-rose-300" />
            <h2 className="mt-3 font-semibold text-white">
              Unable to load meter readings
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {error?.message || "BACnet request failed."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-rose-400/10 px-4 py-2 text-sm text-rose-200 hover:bg-rose-400/20"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Today's Consumption"
                value="Unavailable"
                description="Requires today's historical kWh data or a valid start-of-day meter reading."
                icon={Zap}
              />

              <StatCard
                title="Configured kWh Meters"
                value={meters.length}
                description="Meters found in the division configuration."
                icon={Gauge}
              />

              <StatCard
                title="Readings Available"
                value={availableMeters.length}
                description="Meters returning a valid numeric BACnet reading."
                icon={Activity}
              />

              <StatCard
                title="Meters Unavailable"
                value={meters.length - availableMeters.length}
                description="Configured meters with no valid response."
                icon={Radio}
              />
            </section>

            <section className="mb-6 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <h2 className="text-sm font-semibold text-amber-100">
                    Daily consumption needs historical data
                  </h2>
                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    The readings below are current kWh meter-register values.
                    They must not be added together and labelled as today's
                    consumption. To calculate daily usage accurately, the
                    backend must provide historical energy-log readings or
                    today's start-of-day register values.
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b131d]">
              <div className="flex flex-col gap-2 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    kWh Meter Readings
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Current register values returned by BACnet
                  </p>
                </div>

                <span className="text-xs text-slate-400">
                  {availableMeters.length} of {meters.length} responding
                </span>
              </div>

              {meters.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Gauge className="mx-auto h-8 w-8 text-slate-500" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No kWh meters configured
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    No kWh instances were found for {divisionLabel}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-white/[0.025] text-xs text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-medium">Meter</th>
                        <th className="px-5 py-4 font-medium">Department</th>
                        <th className="px-5 py-4 font-medium">
                          BACnet Instance
                        </th>
                        <th className="px-5 py-4 font-medium">
                          Register Reading
                        </th>
                        <th className="px-5 py-4 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.06]">
                      {meters.map((meter) => (
                        <tr
                          key={`${meter.key}-${meter.instance}`}
                          className="transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4 font-medium text-slate-200">
                            {meter.name}
                          </td>
                          <td className="px-5 py-4 text-slate-400">
                            {meter.department}
                          </td>
                          <td className="px-5 py-4 tabular-nums text-slate-400">
                            {meter.instance}
                          </td>
                          <td className="px-5 py-4 font-semibold tabular-nums text-white">
                            {meter.available
                              ? `${formatNumber(meter.value)} kWh`
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ${
                                meter.available
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-amber-400/10 text-amber-300"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  meter.available
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                                }`}
                              />
                              {meter.available ? "Connected" : "No reading"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Values refresh automatically every 30 seconds. The register total
              ({formatNumber(totalRegisterReading)} kWh) is provided only as a
              diagnostic figure and is not daily consumption.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default TodaysConsumption;
