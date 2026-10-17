import { useMemo } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Radio,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

const isValidValue = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const getReadingState = (value) => {
  if (!isValidValue(value)) return "unavailable";
  return "responding";
};

const LiveStatusIndicator = ({ data, division = "Dyeing" }) => {
  const status = useMemo(() => {
    const meters = new Map();

    const addMeter = (key, metric, value, instance) => {
      if (!key) return;

      const id = normalize(key);
      if (!id) return;

      if (!meters.has(id)) {
        meters.set(id, {
          id,
          name: String(key),
          metrics: {},
          instances: new Set(),
        });
      }

      const meter = meters.get(id);

      if (metric) {
        meter.metrics[normalize(metric)] = getReadingState(value);
      }

      if (instance !== null && instance !== undefined) {
        meter.instances.add(String(instance));
      }
    };

    // HT groups: flattened BACnet readings.
    const htReadings = Array.isArray(data?.htGroups?.data)
      ? data.htGroups.data
      : [];

    htReadings.forEach((reading) => {
      const meterName =
        reading.meter ||
        reading.path ||
        (reading.instance !== undefined
          ? `Instance ${reading.instance}`
          : null);

      if (!meterName) return;

      addMeter(
        `${reading.groupPath || "HT"} / ${meterName}`,
        reading.metric,
        reading.value,
        reading.instance,
      );
    });

    // Incoming utility meters.
    const incoming = data?.incoming;
    const incomingRows = Array.isArray(incoming?.data) ? incoming.data : [];

    incomingRows.forEach((reading) => {
      const name =
        reading.name ||
        reading.meter ||
        reading.path ||
        (reading.instance !== undefined
          ? `Instance ${reading.instance}`
          : null);

      if (!name) return;

      addMeter(
        name,
        reading.metric || "reading",
        reading.liveValue ?? reading.value,
        reading.instance,
      );
    });

    // Configured incoming meters that may not have a live response.
    const incomingConfig = incoming?.config;

    const registerConfig = (node, path = []) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) {
        return;
      }

      const isMeter = ["status", "power", "amp", "kwh"].some(
        (field) => node[field] !== undefined,
      );

      if (isMeter) {
        const name = node.name || path[path.length - 1];
        if (!name) return;

        const id = normalize(name);

        if (!meters.has(id)) {
          meters.set(id, {
            id,
            name: String(name),
            metrics: {},
            instances: new Set(),
          });
        }

        const meter = meters.get(id);

        ["status", "power", "amp", "kwh"].forEach((field) => {
          if (node[field] !== undefined) {
            if (meter.metrics[normalize(field)] === undefined) {
              meter.metrics[normalize(field)] = "unavailable";
            }

            meter.instances.add(String(node[field]));
          }
        });

        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          registerConfig(value, [...path, key]);
        }
      });
    };

    registerConfig(incomingConfig);

    // Add HT configuration entries so missing responses are counted.
    const htConfig = data?.htGroups?.config;

    if (htConfig && typeof htConfig === "object") {
      Object.entries(htConfig).forEach(([groupKey, group]) => {
        if (!group || typeof group !== "object") return;

        Object.entries(group).forEach(([meterKey, config]) => {
          if (!config || typeof config !== "object") return;

          const name = config.name || meterKey;
          const key = `${groupKey} / ${name}`;
          const id = normalize(key);

          if (!meters.has(id)) {
            meters.set(id, {
              id,
              name: key,
              metrics: {},
              instances: new Set(),
            });
          }

          const meter = meters.get(id);

          ["status", "power", "amp", "kwh"].forEach((field) => {
            if (config[field] !== undefined) {
              if (meter.metrics[normalize(field)] === undefined) {
                meter.metrics[normalize(field)] = "unavailable";
              }

              meter.instances.add(String(config[field]));
            }
          });
        });
      });
    }

    const meterList = Array.from(meters.values()).map((meter) => {
      const states = Object.values(meter.metrics);

      const responding = states.some((value) => value === "responding");

      const configuredMetricCount = states.length;

      const respondingMetricCount = states.filter(
        (value) => value === "responding",
      ).length;

      return {
        ...meter,
        instances: Array.from(meter.instances),
        responding,
        configuredMetricCount,
        respondingMetricCount,
      };
    });

    const respondingCount = meterList.filter(
      (meter) => meter.responding,
    ).length;

    const unavailableCount = meterList.filter(
      (meter) =>
        meter.configuredMetricCount > 0 && meter.respondingMetricCount === 0,
    ).length;

    const partialCount = meterList.filter(
      (meter) =>
        meter.respondingMetricCount > 0 &&
        meter.respondingMetricCount < meter.configuredMetricCount,
    ).length;

    return {
      meters: meterList,
      total: meterList.length,
      respondingCount,
      unavailableCount,
      partialCount,
    };
  }, [data]);

  const summaryCards = [
    {
      label: "Configured Meters",
      value: status.total,
      icon: Radio,
      color: "text-slate-200",
      iconStyle: "bg-white/[0.05] text-slate-300",
    },
    {
      label: "Responding",
      value: status.respondingCount,
      icon: Wifi,
      color: "text-emerald-300",
      iconStyle: "bg-emerald-400/[0.08] text-emerald-300",
    },
    {
      label: "No Readings",
      value: status.unavailableCount,
      icon: WifiOff,
      color: "text-rose-300",
      iconStyle: "bg-rose-400/[0.08] text-rose-300",
    },
    {
      label: "Partial Readings",
      value: status.partialCount,
      icon: Activity,
      color: "text-amber-300",
      iconStyle: "bg-amber-400/[0.08] text-amber-300",
    },
  ];

  return (
    <section className="mt-6 min-w-0 space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/75">
            System Monitoring
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            Live Status
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {division} · BACnet meter response and data availability.
          </p>
        </div>

        <span className="flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-300">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Response summary
        </span>
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-2xl border border-white/[0.08] bg-[#0a1118] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] leading-5 text-slate-400">
                  {card.label}
                </p>

                <span className={`rounded-lg p-2 ${card.iconStyle}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              <p
                className={`mt-3 text-2xl font-semibold tabular-nums ${card.color}`}
              >
                {card.value}
              </p>
            </article>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1118]">
        <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Meter Connectivity
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Configured meters and available readings.
            </p>
          </div>

          <span className="text-[11px] text-slate-400">
            {status.respondingCount} / {status.total} responding
          </span>
        </div>

        {status.meters.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <CircleHelp className="mx-auto h-7 w-7 text-slate-500" />

            <p className="mt-3 text-sm font-medium text-slate-300">
              No meter status data
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Meter configuration ya BACnet readings available nahi hain.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {status.meters.map((meter) => {
              const state = !meter.configuredMetricCount
                ? "unknown"
                : meter.respondingMetricCount === 0
                  ? "unavailable"
                  : meter.respondingMetricCount < meter.configuredMetricCount
                    ? "partial"
                    : "responding";

              const stateConfig = {
                responding: {
                  label: "Responding",
                  classes:
                    "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-300",
                  dot: "bg-emerald-300",
                  icon: CheckCircle2,
                },
                partial: {
                  label: "Partial data",
                  classes:
                    "border-amber-300/15 bg-amber-300/[0.06] text-amber-300",
                  dot: "bg-amber-300",
                  icon: AlertCircle,
                },
                unavailable: {
                  label: "No readings",
                  classes:
                    "border-rose-300/15 bg-rose-300/[0.06] text-rose-300",
                  dot: "bg-rose-300",
                  icon: WifiOff,
                },
                unknown: {
                  label: "Unknown",
                  classes: "border-white/[0.08] bg-white/[0.03] text-slate-400",
                  dot: "bg-slate-500",
                  icon: CircleHelp,
                },
              }[state];

              const StateIcon = stateConfig.icon;

              return (
                <div
                  key={meter.id}
                  className="flex flex-col justify-between gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                      <Zap className="h-4 w-4 text-slate-400" />
                    </span>

                    <div className="min-w-0">
                      <p className="break-words text-xs font-medium text-slate-200">
                        {meter.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {meter.instances.length > 0
                          ? `Instances: ${meter.instances.join(", ")}`
                          : "Instance IDs unavailable"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {meter.respondingMetricCount} of{" "}
                        {meter.configuredMetricCount} metrics responding
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] ${stateConfig.classes}`}
                  >
                    <StateIcon className="h-3 w-3" />
                    {stateConfig.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-[10px] leading-5 text-slate-600">
        Responding means at least one configured metric returned a valid numeric
        reading. This does not prove the meter is physically online. Freshness
        depends on your API refresh interval.
      </p>
    </section>
  );
};

export default LiveStatusIndicator;
