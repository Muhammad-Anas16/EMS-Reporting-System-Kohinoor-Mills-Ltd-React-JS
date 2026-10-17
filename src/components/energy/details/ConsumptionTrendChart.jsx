import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  Clock3,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = [
  { label: "24 Hours", value: "24h", hours: 24 },
  { label: "7 Days", value: "7d", hours: 168 },
  { label: "30 Days", value: "30d", hours: 720 },
];

const isValidNumber = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const getTimestamp = (point) => {
  const raw = point?.timestamp ?? point?.datetime ?? point?.date ?? point?.time;

  if (raw === null || raw === undefined || raw === "") {
    return NaN;
  }

  const numeric = Number(raw);

  // Supports Unix timestamps in seconds or milliseconds.
  if (Number.isFinite(numeric)) {
    return numeric < 1e12 ? numeric * 1000 : numeric;
  }

  return new Date(raw).getTime();
};

const getValue = (point) => {
  const candidates = [
    point?.consumptionKwh,
    point?.consumption_kwh,
    point?.energyKwh,
    point?.kwh,
    point?.consumption,
    point?.value,
  ];

  const value = candidates.find(isValidNumber);

  return value === undefined ? null : Number(value);
};

const formatNumber = (value) =>
  Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

const formatTime = (timestamp, range) => {
  const date = new Date(timestamp);

  if (range === "24h") {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const formatTooltipDate = (timestamp) =>
  new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ConsumptionTrendChart = ({
  data,
  division = "Dyeing",
  title = "Consumption Trend",
  unit = "kWh",
}) => {
  const [range, setRange] = useState("24h");

  const trendData = useMemo(() => {
    // Accept a direct history array or common history properties.
    const source = Array.isArray(data)
      ? data
      : Array.isArray(data?.history)
        ? data.history
        : Array.isArray(data?.trend)
          ? data.trend
          : Array.isArray(data?.energyLog)
            ? data.energyLog
            : Array.isArray(data?.data)
              ? data.data
              : [];

    const normalized = source
      .map((point) => ({
        timestamp: getTimestamp(point),
        value: getValue(point),
        label: point?.label,
      }))
      .filter(
        (point) => Number.isFinite(point.timestamp) && point.value !== null,
      )
      .sort((a, b) => a.timestamp - b.timestamp);

    if (normalized.length === 0) return [];

    const selectedRange = RANGES.find((item) => item.value === range);

    const latestTimestamp = normalized[normalized.length - 1].timestamp;

    const cutoff = latestTimestamp - selectedRange.hours * 60 * 60 * 1000;

    return normalized
      .filter((point) => point.timestamp >= cutoff)
      .map((point) => ({
        ...point,
        timeLabel: point.label || formatTime(point.timestamp, range),
      }));
  }, [data, range]);

  const stats = useMemo(() => {
    if (trendData.length === 0) {
      return {
        latest: null,
        minimum: null,
        maximum: null,
        average: null,
      };
    }

    const values = trendData.map((point) => point.value);

    return {
      latest: values[values.length - 1],
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      average: values.reduce((sum, value) => sum + value, 0) / values.length,
    };
  }, [trendData]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload;

    return (
      <div className="rounded-xl border border-white/10 bg-[#111c29] px-3 py-2.5 shadow-xl">
        <p className="text-[10px] text-slate-400">
          {formatTooltipDate(point.timestamp)}
        </p>

        <p className="mt-1 text-sm font-semibold text-cyan-200">
          {formatNumber(point.value)} {unit}
        </p>
      </div>
    );
  };

  return (
    <section className="mt-6 min-w-0 space-y-4">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/75">
            Historical Analytics
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {division} · Consumption readings over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors ${
                range === item.value
                  ? "border-cyan-300/30 bg-cyan-300/[0.10] text-cyan-200"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Latest Reading",
            value: stats.latest,
            icon: Activity,
          },
          {
            label: "Average",
            value: stats.average,
            icon: ChartNoAxesCombined,
          },
          {
            label: "Peak",
            value: stats.maximum,
            icon: TrendingUp,
          },
          {
            label: "Lowest",
            value: stats.minimum,
            icon: Clock3,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="min-w-0 rounded-xl border border-white/[0.08] bg-[#0a1118] p-3.5 sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] leading-4 text-slate-400 sm:text-[11px]">
                  {item.label}
                </p>

                <Icon className="h-4 w-4 shrink-0 text-cyan-300/70" />
              </div>

              <p className="mt-3 break-words text-xl font-semibold tabular-nums text-white sm:text-2xl">
                {item.value === null ? "—" : formatNumber(item.value)}
                {item.value !== null && (
                  <span className="ml-1 text-[10px] font-normal text-slate-500">
                    {unit}
                  </span>
                )}
              </p>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0a1118] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">Energy Usage</h3>

            <p className="mt-1 text-[10px] text-slate-500">
              {trendData.length} historical data points · {unit}
            </p>
          </div>

          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            {RANGES.find((item) => item.value === range)?.label}
          </span>
        </div>

        {trendData.length < 2 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] px-5 text-center">
            <ChartNoAxesCombined className="h-8 w-8 text-slate-600" />

            <h3 className="mt-3 text-sm font-medium text-slate-300">
              Historical data required
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              {trendData.length === 1
                ? "Sirf ek historical reading mili hai. Trend dikhane ke liye kam az kam do timestamped readings chahiye."
                : "Is time range ke liye timestamped consumption readings nahi milin. Energy logs ya historical API connect karo."}
            </p>
          </div>
        ) : (
          <div className="h-[260px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{
                  top: 8,
                  right: 8,
                  left: -18,
                  bottom: 4,
                }}
              >
                <defs>
                  <linearGradient
                    id="consumptionTrendFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(148,163,184,0.10)"
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => formatTime(value, range)}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />

                <YAxis
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNumber}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#consumptionTrendFill)"
                  activeDot={{
                    r: 5,
                    fill: "#22d3ee",
                    stroke: "#0a1118",
                    strokeWidth: 2,
                  }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <p className="text-[10px] leading-5 text-slate-600">
        Statistics are calculated from the displayed readings. Make sure all
        readings use the same unit and represent comparable consumption values.
        Cumulative meter registers should be converted into interval consumption
        before interpreting this as usage over time.
      </p>
    </section>
  );
};

export default ConsumptionTrendChart;
