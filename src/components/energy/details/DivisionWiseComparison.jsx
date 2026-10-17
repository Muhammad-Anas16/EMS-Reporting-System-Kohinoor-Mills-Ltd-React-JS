import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Gauge,
  Radio,
  Zap,
} from "lucide-react";

const DIVISIONS = ["Dyeing", "Weaving", "Appearel", "KGL"];

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

const formatNumber = (value, digits = 2) => {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("en-US", {
        maximumFractionDigits: digits,
      })
    : "—";
};

const getFiniteValue = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;

    const number = Number(value);

    if (Number.isFinite(number)) return number;
  }

  return null;
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
    cyan: "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300",
    violet: "border-violet-400/15 bg-violet-400/[0.07] text-violet-300",
    emerald: "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
  };

  return (
    <article className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0b131d] p-4 transition-colors hover:border-white/[0.13]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-400">{title}</p>

          <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
            <span className="break-words text-2xl font-semibold tracking-tight text-white">
              {value}
            </span>

            {unit && <span className="text-xs text-slate-500">{unit}</span>}
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl border p-2.5 ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
};

const DivisionWiseComparison = ({
  data,
  division = "Dyeing",
  divisions = DIVISIONS,
}) => {
  console.log(data);
  console.log(division);
  console.log(divisions);
  const currentDivision = String(division || "Dyeing").trim();
  const incomingItems = Array.isArray(data?.incoming?.data)
    ? data.incoming.data
    : [];

  const departmentData = data?.departments?.data;
  const departmentCount =
    departmentData && typeof departmentData === "object"
      ? Object.keys(departmentData).length
      : 0;

  const liveMeters = incomingItems.filter(
    (item) =>
      item?.hasLiveValue === true &&
      item?.liveValue !== null &&
      item?.liveValue !== undefined &&
      Number.isFinite(Number(item.liveValue)),
  ).length;

  // Use only explicitly named aggregate fields.
  // Do not treat a cumulative kWh register as today's consumption.
  const totalPower = getFiniteValue(
    data?.summary?.totalPower,
    data?.summary?.total_power,
    data?.totalPower,
    data?.total_power,
    data?.totalLoad?.power,
  );

  const todayConsumption = getFiniteValue(
    data?.summary?.todayConsumptionKwh,
    data?.summary?.today_consumption_kwh,
    data?.todayConsumptionKwh,
    data?.today_consumption_kwh,
  );

  const configuredDivisions = [
    ...new Map(
      [currentDivision, ...divisions]
        .filter(Boolean)
        .map((name) => [normalize(name), String(name).trim()]),
    ).values(),
  ];

  const currentNormalized = normalize(currentDivision);

  return (
    <section className="mt-6 min-w-0 space-y-5">
      {/* Heading */}
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/75">
            Cross-Division Analytics
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
            Division-wise Comparison
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
            Compare power demand, daily energy consumption and meter
            availability across factory divisions.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] text-slate-300">
          <Building2 className="h-4 w-4 text-cyan-300" />
          {configuredDivisions.length} divisions
        </span>
      </header>

      {/* Current division overview */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Selected Division"
          value={currentDivision}
          description="Division selected on the Consumption page"
          icon={Building2}
          accent="cyan"
        />

        <MetricCard
          title="Total Power"
          value={formatNumber(totalPower)}
          unit={totalPower !== null ? "kW" : ""}
          description={
            totalPower !== null
              ? "Configured aggregate power reading"
              : "Aggregate power field not available"
          }
          icon={Zap}
          accent="violet"
        />

        <MetricCard
          title="Today's Consumption"
          value={formatNumber(todayConsumption)}
          unit={todayConsumption !== null ? "kWh" : ""}
          description={
            todayConsumption !== null
              ? "Explicit daily consumption value"
              : "Historical daily consumption not connected"
          }
          icon={Activity}
          accent="emerald"
        />

        <MetricCard
          title="Incoming Live Meters"
          value={liveMeters}
          unit={`/ ${incomingItems.length}`}
          description="Incoming sources reporting a valid live value"
          icon={Radio}
          accent="cyan"
        />
      </div>

      {/* Division comparison cards */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1118]/90">
        <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Division Performance
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Actual comparison values will appear when each division's data is
              connected.
            </p>
          </div>

          <span className="w-fit rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2.5 py-1 text-[10px] font-medium text-amber-200">
            Data connection pending
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-4 sm:p-4">
          {configuredDivisions.map((name) => {
            const isCurrent = normalize(name) === currentNormalized;

            return (
              <article
                key={normalize(name)}
                className={`min-w-0 rounded-xl border p-4 transition-colors ${
                  isCurrent
                    ? "border-cyan-400/25 bg-cyan-400/[0.045]"
                    : "border-white/[0.07] bg-[#0b131d]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`rounded-lg border p-2 ${
                        isCurrent
                          ? "border-cyan-300/15 bg-cyan-300/10 text-cyan-300"
                          : "border-white/[0.07] bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-white">
                        {name}
                      </h4>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {isCurrent ? "Selected division" : "Other division"}
                      </p>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="shrink-0 rounded-full bg-cyan-300/10 px-2 py-1 text-[9px] font-medium text-cyan-200">
                      Current
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-white/[0.04] px-2 py-1 text-[9px] text-slate-500">
                      Pending
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Power</span>
                    <span className="text-sm font-medium tabular-nums text-white">
                      {isCurrent ? formatNumber(totalPower) : "—"}
                      {isCurrent && totalPower !== null ? " kW" : ""}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Daily Energy</span>
                    <span className="text-sm font-medium tabular-nums text-white">
                      {isCurrent ? formatNumber(todayConsumption) : "—"}
                      {isCurrent && todayConsumption !== null ? " kWh" : ""}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Departments</span>
                    <span className="text-sm font-medium tabular-nums text-white">
                      {isCurrent ? departmentCount : "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCurrent ? "bg-cyan-300" : "bg-slate-600"
                    }`}
                  />

                  <span className="text-[10px] text-slate-500">
                    {isCurrent
                      ? `${liveMeters} incoming sources reporting live values`
                      : "Data not connected"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Comparison chart UI */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#0a1118]/90 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-violet-300/10 bg-violet-300/[0.07] p-2.5">
            <Activity className="h-5 w-5 text-violet-300" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Energy Comparison Chart
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Power and energy bars will be plotted after actual values for each
              division are supplied.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-white/[0.1] px-4 py-10 text-center">
          <Gauge className="mx-auto h-8 w-8 text-slate-600" />

          <p className="mt-3 text-sm font-medium text-slate-300">
            Comparison chart awaiting division data
          </p>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            This component currently receives data for {currentDivision} only.
            Once readings from the other divisions are provided, the chart can
            compare them on the same scale.
          </p>
        </div>
      </section>

      {/* Data notes */}
      <div className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

        <p className="text-[11px] leading-5 text-slate-500">
          Comparison values are intentionally not estimated. Total Power
          requires an explicit aggregate power field, and Today's Consumption
          requires a daily kWh value from historical data or a validated
          start-of-day register baseline.
        </p>
      </div>
    </section>
  );
};

export default DivisionWiseComparison;
