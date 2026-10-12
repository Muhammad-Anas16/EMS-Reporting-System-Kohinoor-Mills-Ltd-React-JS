import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Activity,
  Gauge,
  Radio,
  TrendingUp,
  TriangleAlert,
  Zap,
  Database,
} from "lucide-react";

const CardsComponent = ({ data }) => {
  // console.log("Cards data =>", data);

  // --------------------------------
  // Department Data
  // --------------------------------

  const departmentData = useMemo(() => {
    const departments = data?.departments?.data;

    if (
      !departments ||
      typeof departments !== "object" ||
      Array.isArray(departments)
    ) {
      return {};
    }

    return departments;
  }, [data]);

  // --------------------------------
  // Flatten All Meters
  // --------------------------------

  const allMeters = useMemo(() => {
    return Object.entries(departmentData).flatMap(([department, meters]) => {
      if (!Array.isArray(meters)) {
        return [];
      }

      return meters.map((meter) => ({
        ...meter,
        _department: department,
      }));
    });
  }, [departmentData]);

  // --------------------------------
  // Basic Totals
  // --------------------------------

  const totalMeters = useMemo(() => {
    return data?.dataCount ?? allMeters.length;
  }, [data, allMeters]);

  const totalDepartments = useMemo(() => {
    return (
      data?.departments?.type?.length ?? Object.keys(departmentData).length
    );
  }, [data, departmentData]);

  // --------------------------------
  // Active Meters
  // --------------------------------
  // Prefer actual live BACnet value.
  // Fallback to status/state/mode.

  const activeMeters = useMemo(() => {
    return allMeters.filter((meter) => {
      // Primary check: live BACnet value exists
      const liveValue = Number(
        meter?.value ??
          meter?.liveValue ??
          meter?.currentValue ??
          meter?.bacnetValue,
      );

      if (Number.isFinite(liveValue)) {
        return true;
      }

      // Fallback status check
      const status = String(meter?.status || meter?.state || meter?.mode || "")
        .trim()
        .toLowerCase();

      return status === "running" || status === "on" || status === "active";
    }).length;
  }, [allMeters]);

  // --------------------------------
  // Configured Meters
  // --------------------------------

  const configuredMeters = useMemo(() => {
    return allMeters.filter((meter) => {
      return (
        String(meter?.mode || "")
          .trim()
          .toLowerCase() === "configured"
      );
    }).length;
  }, [allMeters]);

  // --------------------------------
  // Total Live Value
  // --------------------------------

  const calculatedMeterValue = useMemo(() => {
    return allMeters.reduce((sum, meter) => {
      const value = Number(
        meter?.value ??
          meter?.liveValue ??
          meter?.currentValue ??
          meter?.bacnetValue,
      );

      return Number.isFinite(value) ? sum + value : sum;
    }, 0);
  }, [allMeters]);

  // --------------------------------
  // Total Load
  // --------------------------------
  // Prefer API total first.
  // Fallback to meter values.

  const totalPower = useMemo(() => {
    const apiValue = Number(data?.totalLoad ?? data?.totalValue?.value);

    if (Number.isFinite(apiValue)) {
      return apiValue;
    }

    return calculatedMeterValue;
  }, [data, calculatedMeterValue]);

  // --------------------------------
  // Total Consumption
  // --------------------------------
  // Current API returns same totalValue as consumption
  // until a separate consumption parameter is available.

  const totalConsumption = useMemo(() => {
    const apiValue = Number(
      data?.totalConsumption ?? data?.consumption ?? data?.totalValue?.value,
    );

    if (Number.isFinite(apiValue)) {
      return apiValue;
    }

    return calculatedMeterValue;
  }, [data, calculatedMeterValue]);

  // --------------------------------
  // Total Current
  // --------------------------------

  const totalCurrent = useMemo(() => {
    const fields = ["current", "ampere", "amps", "a"];

    let found = false;

    const total = allMeters.reduce((sum, meter) => {
      for (const field of fields) {
        const value = Number(meter?.[field]);

        if (
          meter?.[field] !== null &&
          meter?.[field] !== undefined &&
          meter?.[field] !== "" &&
          Number.isFinite(value)
        ) {
          found = true;
          return sum + value;
        }
      }

      return sum;
    }, 0);

    return found ? total : null;
  }, [allMeters]);

  // --------------------------------
  // Meter Live Availability
  // --------------------------------

  const liveMeterCount = useMemo(() => {
    return allMeters.filter((meter) => {
      const value = Number(
        meter?.value ??
          meter?.liveValue ??
          meter?.currentValue ??
          meter?.bacnetValue,
      );

      return Number.isFinite(value);
    }).length;
  }, [allMeters]);

  // --------------------------------
  // Formatter
  // --------------------------------

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      return "—";
    }

    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  };

  // --------------------------------
  // Active Percentage
  // --------------------------------

  const activePercentage =
    totalMeters > 0 ? Math.round((activeMeters / totalMeters) * 100) : 0;

  // --------------------------------
  // Card Configuration
  // --------------------------------

  const cards = [
    {
      title: "Total Meters",
      value: formatValue(totalMeters),
      unit: "Meters",
      icon: Gauge,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      iconBorder: "border-cyan-500/20",
      glow: "bg-cyan-500/[0.05]",
      badge: "System",
      badgeColor: "text-cyan-300",
      description: "Total meters registered in EMS",
      footer: `${totalDepartments} Departments`,
    },

    {
      title: "Total Load",
      value: formatValue(totalPower),
      unit: "kW",
      icon: Zap,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
      iconBorder: "border-yellow-500/20",
      glow: "bg-yellow-500/[0.05]",
      badge: data?.success && totalPower !== null ? "Live" : "N/A",
      badgeColor:
        data?.success && totalPower !== null
          ? "text-emerald-400"
          : "text-slate-500",
      description: "Current combined electrical load",
      footer:
        totalCurrent !== null
          ? `${formatValue(totalCurrent)} A`
          : `${liveMeterCount} live meters`,
    },

    {
      title: "Total Consumption",
      value: formatValue(totalConsumption),
      unit: "kWh",
      icon: Activity,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      glow: "bg-blue-500/[0.05]",
      badge: data?.success && totalConsumption !== null ? "Available" : "N/A",
      badgeColor:
        data?.success && totalConsumption !== null
          ? "text-blue-400"
          : "text-slate-500",
      description: "Combined energy consumption",
      footer: data?.success ? "Live meter data" : "Consumption unavailable",
    },

    {
      title: "Meter Status",
      value: formatValue(activeMeters),
      unit: `/ ${formatValue(totalMeters)}`,
      icon: Radio,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/20",
      glow: "bg-emerald-500/[0.05]",
      badge: `${activePercentage}%`,
      badgeColor: activePercentage > 0 ? "text-emerald-400" : "text-slate-500",
      description: "Meters currently active",
      footer:
        configuredMeters > 0
          ? `${configuredMeters} configured`
          : `${liveMeterCount} responding`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="
              group
              relative
              min-w-0
              overflow-hidden
              rounded-2xl
              border-white/[0.07]
              bg-[#090F15]/80
              text-white
              shadow-none
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:border-white/[0.12]
              hover:bg-[#0A1118]
              hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]
            "
          >
            {/* Background Glow */}
            <div
              className={`
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                ${card.glow}
                blur-3xl
                transition-all
                duration-500
                group-hover:opacity-90
              `}
            />

            <CardContent className="relative z-10 p-4 sm:p-5">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                {/* Icon + Title + Value */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      ${card.iconBorder}
                      ${card.iconBg}
                      ${card.iconColor}
                    `}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                      {card.title}
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {card.value}
                      </span>

                      {card.unit && (
                        <span className="shrink-0 text-[11px] text-slate-500">
                          {card.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-2
                    py-1.5
                    text-[9px]
                    font-medium
                    ${card.badgeColor}
                  `}
                >
                  {card.badge === "Live" && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                  )}

                  {card.badge === "Available" && (
                    <TrendingUp className="h-3 w-3" strokeWidth={1.8} />
                  )}

                  {card.badge === "N/A" && (
                    <TriangleAlert className="h-3 w-3" strokeWidth={1.8} />
                  )}

                  {card.badge !== "Live" &&
                    card.badge !== "Available" &&
                    card.badge !== "N/A" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}

                  <span>{card.badge}</span>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5 flex min-w-0 items-center justify-between gap-3 border-t border-white/[0.05] pt-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Database
                    size={12}
                    strokeWidth={1.7}
                    className="shrink-0 text-slate-600"
                  />

                  <span
                    className="truncate text-[10px] text-slate-600"
                    title={card.description}
                  >
                    {card.description}
                  </span>
                </div>

                <span
                  className={`shrink-0 text-[10px] font-medium ${card.badgeColor}`}
                >
                  {card.footer}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CardsComponent;
