import {
  Activity,
  Zap,
  Gauge,
  Radio,
  TrendingUp,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

const formatValue = (value, digits = 2) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(number);
};

const getReading = (item) => {
  if (Number.isFinite(item?.liveValue)) return item.liveValue;
  if (Number.isFinite(item?.value)) return item.value;
  return null;
};

const getPowerValue = (item) => {
  const readings = item?.readings;

  if (Number.isFinite(readings?.power?.liveValue)) {
    return readings.power.liveValue;
  }

  if (Number.isFinite(readings?.power?.value)) {
    return readings.power.value;
  }

  // Legacy data format
  if (Number.isFinite(item?.liveValue)) return item.liveValue;
  if (Number.isFinite(item?.value)) return item.value;

  return null;
};

const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  description,
  status,
}) => (
  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-400">{title}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="break-words text-2xl font-semibold text-white sm:text-3xl">
            {value}
          </span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
      </div>

      <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-3">
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "online" ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      <span className="text-xs text-slate-400">{description}</span>
    </div>
  </div>
);

const CurrentLoad = ({ data, division }) => {
  const meters = Array.isArray(data?.Data) ? data.Data : [];
  const incomingItems = Array.isArray(data?.incoming?.data)
    ? data.incoming.data
    : [];
  const htGroupItems = Array.isArray(data?.htGroups?.data)
    ? data.htGroups.data
    : [];

  /*
   * Primary total:
   * Use the total already calculated by the utilities API.
   * Do not add incoming + HT groups together because these may
   * represent overlapping electrical meters.
   */
  const apiTotal = Number(data?.totalLoad?.value);
  const legacyTotal = Number(data?.totalValue?.value);

  const totalLoad = Number.isFinite(apiTotal)
    ? apiTotal
    : Number.isFinite(legacyTotal)
      ? legacyTotal
      : null;

  const meterPowerValues = meters
    .map((meter) => getPowerValue(meter))
    .filter((value) => value !== null);

  const incomingPowerItems = incomingItems.filter((item) =>
    ["lesco", "kgl", "solar"].includes(String(item?.key || "").toLowerCase()),
  );

  const incomingReadings = incomingPowerItems
    .map((item) => ({
      ...item,
      reading: getReading(item),
    }))
    .filter((item) => item.reading !== null);

  const incomingTotal = incomingReadings.reduce(
    (sum, item) => sum + item.reading,
    0,
  );

  const htPowerItems = htGroupItems.filter(
    (item) => String(item?.metric || "").toLowerCase() === "power",
  );

  const htReadings = htPowerItems
    .map((item) => ({
      ...item,
      reading: getReading(item),
    }))
    .filter((item) => item.reading !== null);

  const onlineCount = meters.filter((meter) => {
    const power = meter?.readings?.power;

    return (
      power?.hasLiveValue === true ||
      meter?.hasLiveValue === true ||
      Number.isFinite(power?.liveValue)
    );
  }).length;

  const configuredMeterCount = meters.length;
  const isOnline = onlineCount > 0 || data?.success === true;

  const unit = data?.totalLoad?.unit || data?.totalValue?.unit || "kW";

  return (
    <section className="w-full space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Current Load
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {division || "Division"} electrical load overview
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
          {isOnline ? (
            <CircleCheck className="h-4 w-4 text-emerald-400" />
          ) : (
            <CircleAlert className="h-4 w-4 text-amber-400" />
          )}

          <span className="text-xs text-slate-300">
            {isOnline ? "Data available" : "No live data detected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Current Load"
          value={totalLoad === null ? "—" : formatValue(totalLoad)}
          unit={unit}
          icon={Zap}
          description={
            totalLoad === null
              ? "Total load unavailable"
              : "API-calculated meter load"
          }
          status={totalLoad !== null ? "online" : "offline"}
        />

        <MetricCard
          title="Incoming Sources"
          value={incomingReadings.length ? formatValue(incomingTotal) : "—"}
          unit="configured units"
          icon={Activity}
          description={`${incomingReadings.length} incoming readings available`}
          status={incomingReadings.length ? "online" : "offline"}
        />

        <MetricCard
          title="HT Group Power"
          value={
            htReadings.length
              ? formatValue(
                  htReadings.reduce((sum, item) => sum + item.reading, 0),
                )
              : "—"
          }
          unit="configured units"
          icon={Gauge}
          description={`${htReadings.length} HT power readings available`}
          status={htReadings.length ? "online" : "offline"}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:px-5">
          <h3 className="font-medium text-white">Meter Load Details</h3>
          <p className="text-xs text-slate-400">
            Current readings returned by the utilities API
          </p>
        </div>

        {meters.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Radio className="mx-auto h-8 w-8 text-slate-500" />
            <p className="mt-3 text-sm text-slate-300">
              No meter details available for this division.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-5">Meter</th>
                  <th className="px-4 py-3 font-medium">Power</th>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {meters.map((meter, index) => {
                  const power = getPowerValue(meter);
                  const live =
                    meter?.readings?.power?.hasLiveValue === true ||
                    meter?.hasLiveValue === true ||
                    Number.isFinite(meter?.readings?.power?.liveValue);

                  return (
                    <tr
                      key={`${meter?.name || meter?.department || "meter"}-${meter?.instance || index}`}
                      className="text-slate-300"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        {meter?.name ||
                          meter?.department ||
                          meter?.title ||
                          `Meter ${index + 1}`}
                      </td>

                      <td className="px-4 py-3 font-medium text-white">
                        {power === null ? "—" : formatValue(power)}
                      </td>

                      <td className="px-4 py-3 text-slate-400">
                        {meter?.readings?.power?.unit || "kW*"}
                      </td>

                      <td className="px-4 py-3">
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
      </div>

      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
        *Power units depend on your BACnet configuration. Verify the meter
        scaling and unit before treating readings as kW. Incoming and HT totals
        are shown separately and are not added to the total load.
      </p>
    </section>
  );
};

export default CurrentLoad;
