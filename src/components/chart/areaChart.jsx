// import React, { useMemo } from "react";

// import {
//   Area,
//   AreaChart as RechartsAreaChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
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
//   console.log("data in Area Chart : ", data);

//   // --------------------------------
//   // Safe values
//   // --------------------------------

//   const title =
//     typeof label === "string" && label.trim() ? label : "Consumption";

//   const unitValue = typeof unit === "string" && unit.trim() ? unit : "unit";

//   // --------------------------------
//   // Department Data
//   // --------------------------------

//   const departmentData = useMemo(() => {
//     const departments = data?.departments?.data;

//     if (
//       !departments ||
//       typeof departments !== "object" ||
//       Array.isArray(departments)
//     ) {
//       return {};
//     }

//     return departments;
//   }, [data]);

//   // --------------------------------
//   // Department Names
//   // --------------------------------

//   const departmentNames = useMemo(() => {
//     return Object.keys(departmentData);
//   }, [departmentData]);

//   // --------------------------------
//   // Colors
//   // --------------------------------

//   const colors = useMemo(
//     () => [
//       "#22d3ee",
//       "#8b5cf6",
//       "#10b981",
//       "#f59e0b",
//       "#3b82f6",
//       "#ec4899",
//       "#14b8a6",
//       "#f97316",
//       "#a855f7",
//       "#84cc16",
//     ],
//     [],
//   );

//   // --------------------------------
//   // Value Resolver
//   // --------------------------------
//   // API mein agar "value" available hai
//   // to woh use hoga.
//   //
//   // Agar API "parameter" ko actual numeric
//   // reading ke liye use kar rahi hai to
//   // parameter fallback hoga.
//   // --------------------------------

//   const getNumericValue = (item) => {
//     if (item === null || item === undefined) {
//       return null;
//     }

//     if (typeof item === "number") {
//       return Number.isFinite(item) ? item : null;
//     }

//     if (typeof item !== "object") {
//       const numeric = Number(item);
//       return Number.isFinite(numeric) ? numeric : null;
//     }

//     const possibleFields = [
//       "value",
//       "consumption",
//       "reading",
//       "current_value",
//       "meter_value",
//       "total_value",
//       "parameter",
//     ];

//     for (const field of possibleFields) {
//       const numeric = Number(item?.[field]);

//       if (
//         item?.[field] !== null &&
//         item?.[field] !== undefined &&
//         Number.isFinite(numeric)
//       ) {
//         return numeric;
//       }
//     }

//     return null;
//   };

//   // --------------------------------
//   // Prepare Multi Department Chart
//   // --------------------------------

//   const chartData = useMemo(() => {
//     if (!departmentNames.length) {
//       return [];
//     }

//     /*
//       Har department ke andar jitne meter records hain,
//       unko index-wise chart point banaya ja raha hai.

//       Example:

//       Dyeing:
//       [meter1, meter2, meter3]

//       Finishing:
//       [meter1, meter2]

//       Result:

//       Point 1 -> Dyeing + Finishing
//       Point 2 -> Dyeing + Finishing
//       Point 3 -> Dyeing
//     */

//     const maxLength = Math.max(
//       ...departmentNames.map((department) =>
//         Array.isArray(departmentData?.[department])
//           ? departmentData[department].length
//           : 0,
//       ),
//     );

//     return Array.from({ length: maxLength }, (_, index) => {
//       const point = {
//         index,
//         label: `Meter ${index + 1}`,
//       };

//       departmentNames.forEach((department) => {
//         const departmentMeters = departmentData?.[department];

//         if (!Array.isArray(departmentMeters)) {
//           return;
//         }

//         const meter = departmentMeters[index];

//         if (!meter) {
//           return;
//         }

//         const value = getNumericValue(meter);

//         if (value !== null) {
//           point[department] = value;
//         }
//       });

//       return point;
//     });
//   }, [departmentData, departmentNames]);

//   // --------------------------------
//   // Chart Config
//   // --------------------------------

//   const chartConfig = useMemo(() => {
//     const config = {};

//     departmentNames.forEach((department, index) => {
//       const chartColor =
//         index === 0 && dataStroke ? dataStroke : colors[index % colors.length];

//       config[department] = {
//         label: department,
//         color: chartColor,
//       };
//     });

//     return config;
//   }, [departmentNames, colors, dataStroke]);

//   // --------------------------------
//   // Render
//   // --------------------------------

//   return (
//     <Card
//       className="
//         h-full
//         overflow-hidden
//         border-white/[0.07]
//         bg-[#090F15]/80
//         text-white
//         shadow-none
//         backdrop-blur-xl
//       "
//     >
//       {/* Header */}
//       <CardHeader className="pb-2">
//         <div className="flex items-start justify-between gap-3">
//           <div className="min-w-0">
//             <CardTitle className="truncate text-sm font-semibold text-white">
//               {title} Consumption
//             </CardTitle>

//             <CardDescription className="mt-1 text-[11px] text-slate-500">
//               Department-wise energy consumption trend
//             </CardDescription>
//           </div>

//           {/* Department Count */}
//           <div
//             className="
//               shrink-0
//               rounded-lg
//               border border-cyan-400/10
//               bg-cyan-400/[0.05]
//               px-2.5 py-1.5
//             "
//           >
//             <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-cyan-300">
//               {departmentNames.length} Departments
//             </span>
//           </div>
//         </div>

//         {/* Dynamic Legend */}
//         {departmentNames.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
//             {departmentNames.map((department, index) => {
//               const chartColor =
//                 index === 0 && dataStroke
//                   ? dataStroke
//                   : colors[index % colors.length];

//               return (
//                 <div key={department} className="flex items-center gap-1.5">
//                   <span
//                     className="h-1.5 w-5 rounded-full"
//                     style={{
//                       backgroundColor: chartColor,
//                     }}
//                   />

//                   <span className="max-w-[100px] truncate text-[9px] text-slate-500">
//                     {department}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </CardHeader>

//       {/* Chart */}
//       <CardContent className="px-3 pb-3 pt-1 sm:px-4">
//         {chartData.length > 0 ? (
//           <ChartContainer config={chartConfig} className="h-[260px] w-full">
//             <RechartsAreaChart
//               accessibilityLayer
//               data={chartData}
//               margin={{
//                 left: 0,
//                 right: 8,
//                 top: 12,
//                 bottom: 0,
//               }}
//             >
//               {/* Grid */}
//               <CartesianGrid vertical={false} className="stroke-white/[0.05]" />

//               {/* X Axis */}
//               <XAxis
//                 dataKey="label"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 tick={{
//                   fontSize: 9,
//                   fill: "#64748b",
//                 }}
//               />

//               {/* Y Axis */}
//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 width={38}
//                 tick={{
//                   fontSize: 9,
//                   fill: "#64748b",
//                 }}
//                 tickFormatter={(value) => Number(value || 0).toLocaleString()}
//               />

//               {/* Tooltip */}
//               <ChartTooltip
//                 cursor={{
//                   stroke: "rgba(255,255,255,0.08)",
//                   strokeWidth: 1,
//                 }}
//                 content={
//                   <ChartTooltipContent
//                     indicator="line"
//                     labelFormatter={(value) => value}
//                     formatter={(value, name) => {
//                       const numericValue = Number(value || 0);

//                       return [
//                         `${numericValue.toLocaleString()} ${unitValue}`,
//                         name,
//                       ];
//                     }}
//                   />
//                 }
//               />

//               {/* Dynamic Area Lines */}
//               {departmentNames.map((department, index) => {
//                 const chartColor =
//                   index === 0 && dataStroke
//                     ? dataStroke
//                     : colors[index % colors.length];

//                 return (
//                   <Area
//                     key={department}
//                     dataKey={department}
//                     type="monotone"
//                     stroke={chartColor}
//                     fill={chartColor}
//                     fillOpacity={0.04}
//                     strokeWidth={2}
//                     dot={false}
//                     connectNulls
//                     activeDot={{
//                       r: 4,
//                       strokeWidth: 0,
//                       fill: chartColor,
//                     }}
//                   />
//                 );
//               })}
//             </RechartsAreaChart>
//           </ChartContainer>
//         ) : (
//           /* Empty State — no dummy chart data */
//           <div
//             className="
//               flex h-[260px]
//               items-center
//               justify-center
//               rounded-xl
//               border border-dashed
//               border-white/[0.06]
//               bg-white/[0.015]
//             "
//           >
//             <div className="text-center">
//               <p className="text-xs font-medium text-slate-500">
//                 No department data available
//               </p>

//               <p className="mt-1 text-[10px] text-slate-700">
//                 Chart will appear when data is available
//               </p>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AreaChartCard;

import { useMemo } from "react";

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

const DEFAULT_COLORS = [
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
];

const getNumericValue = (item) => {
  if (item === null || item === undefined || item === "") {
    return null;
  }

  if (typeof item === "number") {
    return Number.isFinite(item) ? item : null;
  }

  if (typeof item !== "object") {
    const value = Number(item);
    return Number.isFinite(value) ? value : null;
  }

  const fields = [
    "value",
    "consumption",
    "reading",
    "current_value",
    "meter_value",
    "total_value",
    "parameter",
  ];

  for (const field of fields) {
    const raw = item[field];

    if (raw === null || raw === undefined || raw === "") {
      continue;
    }

    const value = Number(raw);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  return null;
};

const formatNumber = (value) =>
  Number(value).toLocaleString("en", {
    maximumFractionDigits: 2,
  });

const AreaChartCard = ({
  data,
  dataColor,
  dataStroke,
  label = "Consumption",
  unit = "Reading",
}) => {
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

  const departmentNames = useMemo(
    () =>
      Object.keys(departmentData).filter((name) =>
        Array.isArray(departmentData[name]),
      ),
    [departmentData],
  );

  const chartConfig = useMemo(() => {
    return departmentNames.reduce((config, department, index) => {
      const color =
        index === 0
          ? dataStroke || dataColor || DEFAULT_COLORS[0]
          : DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      config[department] = {
        label: department.replace(/[_-]+/g, " "),
        color,
      };

      return config;
    }, {});
  }, [departmentNames, dataColor, dataStroke]);

  const chartData = useMemo(() => {
    if (!departmentNames.length) {
      return [];
    }

    const maxLength = Math.max(
      0,
      ...departmentNames.map((department) => departmentData[department].length),
    );

    return Array.from({ length: maxLength }, (_, index) => {
      const point = {
        label: `Meter ${index + 1}`,
      };

      departmentNames.forEach((department) => {
        const meter = departmentData[department][index];
        const value = getNumericValue(meter);

        if (value !== null) {
          point[department] = value;
        }
      });

      return point;
    }).filter((point) =>
      departmentNames.some((department) => point[department] !== undefined),
    );
  }, [departmentData, departmentNames]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-white/[0.07] bg-[#090f15]/80 text-white shadow-none backdrop-blur-xl">
      <CardHeader className="shrink-0 space-y-0 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-semibold text-white">
              {label}
            </CardTitle>

            <CardDescription className="mt-1 text-[11px] leading-4 text-slate-500">
              Meter readings grouped by department
            </CardDescription>
          </div>

          <span className="shrink-0 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] px-2 py-1.5 text-[10px] font-medium text-cyan-300">
            {departmentNames.length} departments
          </span>
        </div>

        {departmentNames.length > 0 && (
          <div className="mt-3 flex max-h-16 flex-wrap gap-x-3 gap-y-2 overflow-y-auto">
            {departmentNames.map((department) => (
              <div
                key={department}
                className="flex min-w-0 items-center gap-1.5"
                title={department}
              >
                <span
                  className="h-1.5 w-4 shrink-0 rounded-full"
                  style={{
                    backgroundColor: chartConfig[department].color,
                  }}
                />

                <span className="max-w-[130px] truncate text-[10px] text-slate-500">
                  {chartConfig[department].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-1 sm:px-4">
        {hasData ? (
          <ChartContainer config={chartConfig} className="min-h-[240px] flex-1">
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
              <CartesianGrid vertical={false} className="stroke-white/[0.05]" />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
                tickFormatter={formatNumber}
              />

              <ChartTooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.12)",
                  strokeWidth: 1,
                }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => value}
                    formatter={(value, name) => {
                      if (value === null || value === undefined) {
                        return null;
                      }

                      return [
                        `${formatNumber(value)} ${unit}`,
                        chartConfig[name]?.label ?? name,
                      ];
                    }}
                  />
                }
              />

              {departmentNames.map((department) => (
                <Area
                  key={department}
                  dataKey={department}
                  type="monotone"
                  stroke={chartConfig[department].color}
                  fill={chartConfig[department].color}
                  fillOpacity={0.07}
                  strokeWidth={2}
                  connectNulls={false}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: chartConfig[department].color,
                  }}
                  isAnimationActive={false}
                />
              ))}
            </RechartsAreaChart>
          </ChartContainer>
        ) : (
          <div className="flex min-h-[240px] flex-1 items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015]">
            <div className="px-4 text-center">
              <p className="text-xs font-medium text-slate-400">
                No meter readings available
              </p>
              <p className="mt-1 text-[10px] text-slate-600">
                The chart will appear when numeric readings are returned.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
