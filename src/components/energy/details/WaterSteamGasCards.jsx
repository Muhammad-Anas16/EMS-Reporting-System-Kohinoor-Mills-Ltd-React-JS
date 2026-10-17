import { useMemo } from "react";
import { Droplets, Flame, Gauge, Radio, Waves } from "lucide-react";

const UTILITY_CONFIG = [
  {
    key: "water",
    title: "Water",
    subtitle: "Water Consumption",
    unit: "m³",
    icon: Droplets,
    accent: "cyan",
    candidates: ["water", "water_meter", "water_flow", "water_kwh"],
  },
  {
    key: "steam",
    title: "Steam",
    subtitle: "Steam Consumption",
    unit: "kg/h",
    icon: Flame,
    accent: "violet",
    candidates: ["steam", "steam_meter", "steam_flow", "boiler_steam"],
  },
  {
    key: "gas",
    title: "Gas",
    subtitle: "Gas Consumption",
    unit: "m³/h",
    icon: Waves,
    accent: "amber",
    candidates: ["gas", "gas_meter", "gas_flow", "natural_gas"],
  },
];

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isValidNumber = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const formatNumber = (value) => {
  if (!isValidNumber(value)) return "—";

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const getReading = (source, candidates) => {
  if (!isObject(source)) return null;

  // Direct keys, e.g. incoming.water
  for (const key of candidates) {
    const value = source[key];

    if (isValidNumber(value)) {
      return { value: Number(value), source: key };
    }

    if (isObject(value)) {
      for (const field of [
        "liveValue",
        "value",
        "reading",
        "flow",
        "consumption",
      ]) {
        if (isValidNumber(value[field])) {
          return {
            value: Number(value[field]),
            source: key,
            unit: value.unit,
          };
        }
      }
    }
  }

  // Configured readings, e.g. incoming.data
  const rows = Array.isArray(source.data) ? source.data : [];

  for (const row of rows) {
    if (!isObject(row)) continue;

    const rowName = normalize(
      row.name ?? row.key ?? row.meter ?? row.path ?? row.label,
    );

    const matches = candidates.some(
      (candidate) => rowName === candidate || rowName.includes(candidate),
    );

    if (!matches) continue;

    for (const field of [
      "liveValue",
      "value",
      "reading",
      "flow",
      "consumption",
    ]) {
      if (isValidNumber(row[field])) {
        return {
          value: Number(row[field]),
          source: rowName,
          unit: row.unit,
        };
      }
    }
  }

  // Nested values, e.g. values.water
  if (isObject(source.values)) {
    const nested = getReading(source.values, candidates);
    if (nested) return nested;
  }

  return null;
};

const getUtilitySource = (data) => ({
  incoming: data?.incoming,
  utilities: data?.utilities,
  waterSteamGas: data?.waterSteamGas,
  meters: data?.meters,
});

const WaterSteamGasCards = ({ data, division = "Dyeing" }) => {
  const cards = useMemo(() => {
    const source = getUtilitySource(data);

    return UTILITY_CONFIG.map((utility) => {
      let reading = null;

      for (const section of Object.values(source)) {
        reading = getReading(section, utility.candidates);
        if (reading) break;
      }

      return {
        ...utility,
        reading,
      };
    });
  }, [data]);

  const availableCount = cards.filter((card) => card.reading !== null).length;

  return (
    <section className="mt-6 min-w-0 space-y-4">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/75">
            Resource Monitoring
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
            Water, Steam &amp; Gas
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {division} · Utility consumption and live meter readings.
          </p>
        </div>

        <span className="w-fit rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300">
          {availableCount}/3 utilities available
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const available = card.reading !== null;

          const colors = {
            cyan: {
              icon: "border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-300",
              glow: "from-cyan-400/[0.08]",
              value: "text-cyan-200",
              dot: "bg-cyan-300",
            },
            violet: {
              icon: "border-violet-300/15 bg-violet-300/[0.08] text-violet-300",
              glow: "from-violet-400/[0.08]",
              value: "text-violet-200",
              dot: "bg-violet-300",
            },
            amber: {
              icon: "border-amber-300/15 bg-amber-300/[0.08] text-amber-300",
              glow: "from-amber-400/[0.08]",
              value: "text-amber-200",
              dot: "bg-amber-300",
            },
          };

          const color = colors[card.accent];

          return (
            <article
              key={card.key}
              className={`relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${color.glow} to-[#0a1118] p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`rounded-xl border p-3 ${color.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] ${
                    available ? "text-emerald-300" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      available ? "bg-emerald-300" : "bg-slate-500"
                    }`}
                  />
                  {available ? "Data available" : "Not configured"}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-300">
                  {card.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>

                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span
                    className={`break-all text-3xl font-semibold tracking-tight tabular-nums ${
                      available ? color.value : "text-slate-500"
                    }`}
                  >
                    {available ? formatNumber(card.reading.value) : "—"}
                  </span>

                  <span className="text-xs text-slate-500">
                    {card.reading?.unit || card.unit}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  {available ? (
                    <Gauge className="h-3.5 w-3.5" />
                  ) : (
                    <Radio className="h-3.5 w-3.5" />
                  )}
                  {available ? "Meter reading" : "Awaiting meter data"}
                </span>

                <span className="text-[10px] text-slate-500">
                  {available ? "Live value" : "Unavailable"}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {availableCount === 0 && (
        <div className="rounded-xl border border-dashed border-white/[0.10] bg-white/[0.02] px-4 py-3">
          <p className="text-xs leading-5 text-slate-400">
            Water, Steam aur Gas ki readings abhi API/configuration mein
            identify nahi ho sakin. Actual BACnet instance IDs aur meter units
            connect karne ke baad yahan readings show hongi.
          </p>
        </div>
      )}
    </section>
  );
};

export default WaterSteamGasCards;
