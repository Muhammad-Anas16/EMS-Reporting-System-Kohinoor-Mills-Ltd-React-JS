// import React, { useMemo } from "react";

// import {
//   Area,
//   AreaChart as RechartsAreaChart,
//   CartesianGrid,
//   XAxis,
// } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// const AreaChartCard = ({ data, dataColor, dataStroke, label, unit }) => {
//   console.log("data in Area Chart : ", data?.departments?.data);
//   // --------------------------------
//   // Safe / fallback values
//   // --------------------------------

//   const color =
//     dataColor && typeof dataColor === "string"
//       ? dataColor
//       : "rgba(59, 130, 246, 0.25)";

//   const stroke =
//     dataStroke && typeof dataStroke === "string"
//       ? dataStroke
//       : "rgba(59, 130, 246, 0.9)";

//   const title = label && typeof label === "string" ? label : "Consumption";

//   const unitValue = unit && typeof unit === "string" ? unit : "unit";

//   // --------------------------------
//   // Prepare Chart Data
//   // --------------------------------

//   const chartData = useMemo(() => {
//     /*
//       Agar valid data available nahi hai
//       to fallback values use hongi.
//     */

//     const safeData =
//       Array.isArray(data) && data.length > 0 ? data : Array(12).fill(0);

//     const now = new Date();

//     // 2 hours interval
//     const intervalMinutes = 120;

//     return safeData.map((item, index) => {
//       // Agar item object hai to value lo
//       // warna direct number use karo
//       const rawValue =
//         typeof item === "object" && item !== null ? item.value : item;

//       const value =
//         rawValue !== null && rawValue !== undefined && !isNaN(Number(rawValue))
//           ? Number(rawValue)
//           : 0;

//       /*
//         Agar API se timestamp available hai
//         to usko use karenge.
//         Warna current time se backwards calculate hoga.
//       */

//       const itemTime =
//         typeof item === "object" && item !== null && item.timestamp
//           ? new Date(item.timestamp)
//           : new Date(
//               now.getTime() -
//                 (safeData.length - 1 - index) * intervalMinutes * 60 * 1000,
//             );

//       return {
//         time: itemTime.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }),

//         consumption: value,
//       };
//     });
//   }, [data]);

//   // --------------------------------
//   // Chart Config
//   // --------------------------------

//   const chartConfig = useMemo(
//     () => ({
//       consumption: {
//         label: title,
//         color,
//       },
//     }),
//     [title, color],
//   );

//   return (
//     <Card className="w-full border border-slate-800 bg-[#0a0f14] text-white shadow-md">
//       {/* Header */}
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm font-semibold text-white">
//           {title}
//         </CardTitle>

//         <CardDescription className="text-xs text-slate-500">
//           {title} consumption trend
//         </CardDescription>
//       </CardHeader>

//       {/* Chart */}
//       <CardContent className="pt-2">
//         <ChartContainer config={chartConfig} className="h-[230px] w-full">
//           <RechartsAreaChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               left: 2,
//               right: 2,
//               top: 10,
//               bottom: 0,
//             }}
//           >
//             <CartesianGrid vertical={false} className="stroke-slate-800" />

//             <XAxis
//               dataKey="time"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tick={{
//                 fontSize: 10,
//                 fill: "#64748b",
//               }}
//             />

//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   indicator="line"
//                   formatter={(value) =>
//                     `${Number(value || 0).toLocaleString()} ${unitValue}`
//                   }
//                 />
//               }
//             />

//             <Area
//               dataKey="consumption"
//               type="monotone"
//               fill={color}
//               fillOpacity={0.25}
//               stroke={stroke}
//               strokeWidth={2}
//               dot={false}
//             />
//           </RechartsAreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default AreaChartCard;

import React, { useMemo } from "react";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const AreaChartCard = ({ data, dataColor, dataStroke, label, unit }) => {
  // --------------------------------
  // Safe values
  // --------------------------------

  const title =
    typeof label === "string" && label.trim() ? label : "Consumption";

  const unitValue = typeof unit === "string" && unit.trim() ? unit : "unit";

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
  // Department Names
  // --------------------------------

  const departmentNames = useMemo(() => {
    return Object.keys(departmentData);
  }, [departmentData]);

  // --------------------------------
  // Colors
  // --------------------------------

  const colors = useMemo(
    () => [
      "#22d3ee",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#3b82f6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#a855f7",
      "#84cc16",
    ],
    [],
  );

  // --------------------------------
  // Value Resolver
  // --------------------------------
  // API mein agar "value" available hai
  // to woh use hoga.
  //
  // Agar API "parameter" ko actual numeric
  // reading ke liye use kar rahi hai to
  // parameter fallback hoga.
  // --------------------------------

  const getNumericValue = (item) => {
    if (item === null || item === undefined) {
      return null;
    }

    if (typeof item === "number") {
      return Number.isFinite(item) ? item : null;
    }

    if (typeof item !== "object") {
      const numeric = Number(item);
      return Number.isFinite(numeric) ? numeric : null;
    }

    const possibleFields = [
      "value",
      "consumption",
      "reading",
      "current_value",
      "meter_value",
      "total_value",
      "parameter",
    ];

    for (const field of possibleFields) {
      const numeric = Number(item?.[field]);

      if (
        item?.[field] !== null &&
        item?.[field] !== undefined &&
        Number.isFinite(numeric)
      ) {
        return numeric;
      }
    }

    return null;
  };

  // --------------------------------
  // Prepare Multi Department Chart
  // --------------------------------

  const chartData = useMemo(() => {
    if (!departmentNames.length) {
      return [];
    }

    /*
      Har department ke andar jitne meter records hain,
      unko index-wise chart point banaya ja raha hai.

      Example:

      Dyeing:
      [meter1, meter2, meter3]

      Finishing:
      [meter1, meter2]

      Result:

      Point 1 -> Dyeing + Finishing
      Point 2 -> Dyeing + Finishing
      Point 3 -> Dyeing
    */

    const maxLength = Math.max(
      ...departmentNames.map((department) =>
        Array.isArray(departmentData?.[department])
          ? departmentData[department].length
          : 0,
      ),
    );

    return Array.from({ length: maxLength }, (_, index) => {
      const point = {
        index,
        label: `Meter ${index + 1}`,
      };

      departmentNames.forEach((department) => {
        const departmentMeters = departmentData?.[department];

        if (!Array.isArray(departmentMeters)) {
          return;
        }

        const meter = departmentMeters[index];

        if (!meter) {
          return;
        }

        const value = getNumericValue(meter);

        if (value !== null) {
          point[department] = value;
        }
      });

      return point;
    });
  }, [departmentData, departmentNames]);

  // --------------------------------
  // Chart Config
  // --------------------------------

  const chartConfig = useMemo(() => {
    const config = {};

    departmentNames.forEach((department, index) => {
      const chartColor =
        index === 0 && dataStroke ? dataStroke : colors[index % colors.length];

      config[department] = {
        label: department,
        color: chartColor,
      };
    });

    return config;
  }, [departmentNames, colors, dataStroke]);

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <Card
      className="
        h-full
        overflow-hidden
        border-white/[0.07]
        bg-[#090F15]/80
        text-white
        shadow-none
        backdrop-blur-xl
      "
    >
      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-semibold text-white">
              {title} Consumption
            </CardTitle>

            <CardDescription className="mt-1 text-[11px] text-slate-500">
              Department-wise energy consumption trend
            </CardDescription>
          </div>

          {/* Department Count */}
          <div
            className="
              shrink-0
              rounded-lg
              border border-cyan-400/10
              bg-cyan-400/[0.05]
              px-2.5 py-1.5
            "
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-cyan-300">
              {departmentNames.length} Departments
            </span>
          </div>
        </div>

        {/* Dynamic Legend */}
        {departmentNames.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {departmentNames.map((department, index) => {
              const chartColor =
                index === 0 && dataStroke
                  ? dataStroke
                  : colors[index % colors.length];

              return (
                <div key={department} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-5 rounded-full"
                    style={{
                      backgroundColor: chartColor,
                    }}
                  />

                  <span className="max-w-[100px] truncate text-[9px] text-slate-500">
                    {department}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-3 pb-3 pt-1 sm:px-4">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <RechartsAreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 8,
                top: 12,
                bottom: 0,
              }}
            >
              {/* Grid */}
              <CartesianGrid vertical={false} className="stroke-white/[0.05]" />

              {/* X Axis */}
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                  fontSize: 9,
                  fill: "#64748b",
                }}
              />

              {/* Y Axis */}
              <YAxis
                tickLine={false}
                axisLine={false}
                width={38}
                tick={{
                  fontSize: 9,
                  fill: "#64748b",
                }}
                tickFormatter={(value) => Number(value || 0).toLocaleString()}
              />

              {/* Tooltip */}
              <ChartTooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.08)",
                  strokeWidth: 1,
                }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => value}
                    formatter={(value, name) => {
                      const numericValue = Number(value || 0);

                      return [
                        `${numericValue.toLocaleString()} ${unitValue}`,
                        name,
                      ];
                    }}
                  />
                }
              />

              {/* Dynamic Area Lines */}
              {departmentNames.map((department, index) => {
                const chartColor =
                  index === 0 && dataStroke
                    ? dataStroke
                    : colors[index % colors.length];

                return (
                  <Area
                    key={department}
                    dataKey={department}
                    type="monotone"
                    stroke={chartColor}
                    fill={chartColor}
                    fillOpacity={0.04}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    activeDot={{
                      r: 4,
                      strokeWidth: 0,
                      fill: chartColor,
                    }}
                  />
                );
              })}
            </RechartsAreaChart>
          </ChartContainer>
        ) : (
          /* Empty State — no dummy chart data */
          <div
            className="
              flex h-[260px]
              items-center
              justify-center
              rounded-xl
              border border-dashed
              border-white/[0.06]
              bg-white/[0.015]
            "
          >
            <div className="text-center">
              <p className="text-xs font-medium text-slate-500">
                No department data available
              </p>

              <p className="mt-1 text-[10px] text-slate-700">
                Chart will appear when data is available
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
