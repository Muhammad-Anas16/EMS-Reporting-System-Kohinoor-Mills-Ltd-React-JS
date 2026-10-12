// import React, { useMemo } from "react";
// import { Label, Pie, PieChart } from "recharts";

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

// const PieChartCard = ({ data, dataColor, dataStroke, label, unit }) => {
//   // --------------------------------
//   // Safe / fallback values
//   // --------------------------------

//   const value =
//     data !== null && data !== undefined && !isNaN(Number(data))
//       ? Number(data)
//       : 0;

//   const color =
//     dataColor && typeof dataColor === "string"
//       ? dataColor
//       : "rgba(59, 130, 246, 0.45)";

//   const stroke =
//     dataStroke && typeof dataStroke === "string"
//       ? dataStroke
//       : "rgba(59, 130, 246, 0.9)";

//   const title = label && typeof label === "string" ? label : "Not Defined";

//   const unitValue = unit && typeof unit === "string" ? unit : "unit";

//   // --------------------------------
//   // Chart Data
//   // --------------------------------

//   const chartData = useMemo(
//     () => [
//       {
//         name: title,
//         value,
//         fill: color,
//       },
//     ],
//     [title, value, color],
//   );

//   // --------------------------------
//   // Chart Config
//   // --------------------------------

//   const chartConfig = useMemo(
//     () => ({
//       value: {
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
//           Total {title.toLowerCase()} consumption
//         </CardDescription>
//       </CardHeader>

//       {/* Chart */}
//       <CardContent className="flex flex-col items-center justify-center pt-2">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square h-[220px] w-[220px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   hideLabel
//                   formatter={(tooltipValue) =>
//                     `${Number(tooltipValue || 0).toLocaleString()} ${unitValue}`
//                   }
//                 />
//               }
//             />

//             <Pie
//               data={chartData}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={68}
//               outerRadius={88}
//               startAngle={90}
//               endAngle={-270}
//               stroke={stroke}
//               strokeWidth={2}
//               fill={color}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         {/* Value */}
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) - 6}
//                           className="fill-white text-2xl font-bold"
//                         >
//                           {value.toLocaleString()}
//                         </tspan>

//                         {/* Unit */}
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 18}
//                           className="fill-slate-500 text-[11px]"
//                         >
//                           {unitValue}
//                         </tspan>
//                       </text>
//                     );
//                   }

//                   return null;
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default PieChartCard;

import React, { useMemo } from "react";
import { Label, Pie, PieChart, Cell } from "recharts";

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

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

const PieChartCard = ({ data = {}, label = "Dyeing", unit = "Meters" }) => {
  const chartData = useMemo(() => {
    if (!data || typeof data !== "object") {
      return [];
    }

    return Object.entries(data).map(([name, meters]) => ({
      name,
      value: Array.isArray(meters) ? meters.length : 0,
    }));
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((config, item, index) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      };

      return config;
    }, {});
  }, [chartData]);

  return (
    <Card className="w-full border border-slate-800 bg-[#0a0f14] text-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-white">
          {label}
        </CardTitle>

        <CardDescription className="text-xs text-slate-500">
          Total {unit.toLowerCase()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[220px] w-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) =>
                    `${Number(value || 0).toLocaleString()} ${unit}`
                  }
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={88}
              startAngle={90}
              endAngle={-270}
              stroke="#0a0f14"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 6}
                          className="fill-white text-2xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="fill-slate-500 text-[11px]"
                        >
                          {unit}
                        </tspan>
                      </text>
                    );
                  }

                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-slate-300">{item.name}</span>
              </div>

              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
