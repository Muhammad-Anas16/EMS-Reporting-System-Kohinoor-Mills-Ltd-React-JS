import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Radio,
  Zap,
} from "lucide-react";

const METRIC_META = {
  power: {
    label: "Power",
    unit: "kW",
    icon: Zap,
  },
  amp: {
    label: "Current",
    unit: "A",
    icon: Activity,
  },
  kwh: {
    label: "Energy Register",
    unit: "kWh",
    icon: Gauge,
  },
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    : "—";
};

const isValidValue = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const formatLabel = (value) =>
  String(value ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizePath = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const HTGroupsCards = ({ data, division = "Dyeing" }) => {
  const groups = useMemo(() => {
    const config = data?.htGroups?.config;
    const readings = Array.isArray(data?.htGroups?.data)
      ? data.htGroups.data
      : [];

    if (!config || typeof config !== "object") return [];

    return Object.entries(config).map(([groupKey, groupConfig]) => {
      const meterEntries =
        groupConfig && typeof groupConfig === "object"
          ? Object.entries(groupConfig).filter(
              ([, meter]) =>
                meter &&
                typeof meter === "object" &&
                !Array.isArray(meter) &&
                ["power", "amp", "kwh", "status"].some(
                  (field) =>
                    meter[field] !== null &&
                    meter[field] !== undefined &&
                    meter[field] !== "",
                ),
            )
          : [];

      const meters = meterEntries.map(([meterKey, meterConfig]) => {
        const findReading = (metric) =>
          readings.find(
            (reading) =>
              normalizePath(reading.groupPath) === normalizePath(groupKey) &&
              normalizePath(reading.meter) === normalizePath(meterKey) &&
              normalizePath(reading.metric) === normalizePath(metric),
          );

        const power = findReading("power");
        const amp = findReading("amp");
        const kwh = findReading("kwh");
        const status = findReading("status");

        const metrics = {
          power: {
            instance: meterConfig.power,
            value: power?.value ?? null,
            available: isValidValue(power?.value),
          },
          amp: {
            instance: meterConfig.amp,
            value: amp?.value ?? null,
            available: isValidValue(amp?.value),
          },
          kwh: {
            instance: meterConfig.kwh,
            value: kwh?.value ?? null,
            available: isValidValue(kwh?.value),
          },
        };

        const statusAvailable = isValidValue(status?.value);
        const online = statusAvailable && Number(status.value) > 0;

        return {
          key: meterKey,
          name: meterConfig.name || formatLabel(meterKey),
          scale: Number.isFinite(Number(meterConfig.scale))
            ? Number(meterConfig.scale)
            : 1,
          metrics,
          status: {
            available: statusAvailable,
            value: status?.value ?? null,
            online,
          },
        };
      });

      return {
        key: groupKey,
        name: formatLabel(groupKey),
        meters,
      };
    });
  }, [data]);

  const allMeters = groups.flatMap((group) =>
    group.meters.map((meter) => ({ ...meter, groupKey: group.key })),
  );

  const totalMeters = allMeters.length;
  const respondingMeters = allMeters.filter((meter) =>
    Object.values(meter.metrics).some((metric) => metric.available),
  ).length;

  const groupCount = groups.filter((group) => group.meters.length > 0).length;

  return (
    <section className="mt-6 min-w-0 space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/75">
            Electrical Distribution
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            HT Groups
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {division} · Configured HT meters, power, current and energy
            register readings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300">
            {groupCount} groups
          </span>

          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-[11px] text-cyan-200">
            {respondingMeters}/{totalMeters} meters responding
          </span>
        </div>
      </header>

      {groups.length === 0 || totalMeters === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#0a1118] px-5 py-12 text-center">
          <Radio className="mx-auto h-8 w-8 text-slate-500" />

          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            No HT groups configured
          </h3>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            No HT group meter configuration was found for {division}.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups
            .filter((group) => group.meters.length > 0)
            .map((group) => {
              const responding = group.meters.filter((meter) =>
                Object.values(meter.metrics).some((metric) => metric.available),
              ).length;

              return (
                <section
                  key={group.key}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1118]/90"
                >
                  <header className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07] p-2.5">
                        <Zap className="h-5 w-5 text-cyan-300" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {group.name}
                        </h3>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {group.meters.length} configured meters
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-400">
                      {responding} responding
                    </span>
                  </header>

                  <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3 sm:p-4">
                    {group.meters.map((meter) => {
                      const availableCount = Object.values(
                        meter.metrics,
                      ).filter((metric) => metric.available).length;

                      const statusLabel =
                        availableCount === 0
                          ? "No readings"
                          : meter.status.available
                            ? meter.status.online
                              ? "Status ON"
                              : "Status OFF"
                            : "Status unavailable";

                      const statusColor =
                        availableCount === 0
                          ? "text-amber-300 bg-amber-300/[0.07] border-amber-300/15"
                          : meter.status.available && meter.status.online
                            ? "text-emerald-300 bg-emerald-300/[0.07] border-emerald-300/15"
                            : meter.status.available
                              ? "text-rose-300 bg-rose-300/[0.07] border-rose-300/15"
                              : "text-slate-400 bg-white/[0.03] border-white/[0.08]";

                      return (
                        <article
                          key={meter.key}
                          className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0b131d] p-4 transition-colors hover:border-white/[0.14]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300/75">
                                {group.name}
                              </p>

                              <h4 className="mt-1 break-words text-sm font-semibold leading-5 text-white">
                                {meter.name}
                              </h4>
                            </div>

                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-medium ${statusColor}`}
                            >
                              {meter.status.available && meter.status.online ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}

                              {statusLabel}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2">
                            {Object.entries(METRIC_META).map(
                              ([metricKey, meta]) => {
                                const metric = meter.metrics[metricKey];
                                const Icon = meta.icon;

                                return (
                                  <div
                                    key={metricKey}
                                    className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      <Icon className="h-4 w-4 shrink-0 text-slate-500" />

                                      <div className="min-w-0">
                                        <p className="text-[11px] text-slate-400">
                                          {meta.label}
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-slate-600">
                                          Instance {metric.instance ?? "—"}
                                        </p>
                                      </div>
                                    </div>

                                    <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-white">
                                      {metric.available
                                        ? formatNumber(
                                            metric.value * meter.scale,
                                          )
                                        : "—"}

                                      <span className="ml-1 text-[10px] font-normal text-slate-500">
                                        {meta.unit}
                                      </span>
                                    </p>
                                  </div>
                                );
                              },
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                            <span className="text-[10px] text-slate-500">
                              Available metrics
                            </span>

                            <span className="text-[10px] font-medium tabular-nums text-slate-300">
                              {availableCount}/3
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      <p className="text-[10px] leading-5 text-slate-600">
        Values come from configured BACnet instances. Energy Register is the
        meter's current cumulative kWh reading, not necessarily today's
        consumption. Confirm each meter's scale and status encoding against its
        configuration.
      </p>
    </section>
  );
};

export default HTGroupsCards;
