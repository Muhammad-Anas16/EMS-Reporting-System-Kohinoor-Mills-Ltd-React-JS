// import React from "react";

// import {
//   CartesianGrid,
//   Line,
//   LineChart as RechartsLineChart,
//   XAxis,
// } from "recharts";

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// const chartData = [
//   {
//     time: "06 AM",
//     mainIncomer: 920,
//     dyeing: 0,
//   },
//   {
//     time: "08 AM",
//     mainIncomer: 1180,
//     dyeing: 210,
//   },
//   {
//     time: "10 AM",
//     mainIncomer: 1325,
//     dyeing: 560,
//   },
//   {
//     time: "12 PM",
//     mainIncomer: 1450,
//     dyeing: 740,
//   },
//   {
//     time: "02 PM",
//     mainIncomer: 1380,
//     dyeing: 810,
//   },
//   {
//     time: "04 PM",
//     mainIncomer: 1510,
//     dyeing: 920,
//   },
//   {
//     time: "06 PM",
//     mainIncomer: 1290,
//     dyeing: 760,
//   },
//   {
//     time: "08 PM",
//     mainIncomer: 1160,
//     dyeing: 610,
//   },
//   {
//     time: "10 PM",
//     mainIncomer: 1010,
//     dyeing: 480,
//   },
// ];

// const chartConfig = {
//   mainIncomer: {
//     label: "Main Incomer",
//     color: "var(--chart-1)",
//   },

//   dyeing: {
//     label: "Dyeing Unit",
//     color: "var(--chart-2)",
//   },
// };

// const LineChart = () => {
//   const [activeChart, setActiveChart] = React.useState("mainIncomer");

//   const currentValue = chartData[chartData.length - 1]?.[activeChart] ?? 0;

//   return (
//     <div className="h-full w-full bg-slate-900 p-5">
//       {/* Compact Header */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-semibold text-white">Power Load Trend</p>

//             <p className="mt-1 text-xs text-slate-400">Hourly power demand</p>
//           </div>

//           <div className="text-right">
//             <p className="text-lg font-bold text-white">
//               {currentValue.toLocaleString()}
//             </p>

//             <p className="text-[11px] text-slate-500">kW</p>
//           </div>
//         </div>
//       </div>

//       {/* Chart Selector */}
//       <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-800">
//         {Object.keys(chartConfig).map((key) => {
//           const isActive = activeChart === key;
//           const chart = chartConfig[key];

//           return (
//             <button
//               key={key}
//               type="button"
//               onClick={() => setActiveChart(key)}
//               className={`
//                 px-4
//                 py-3
//                 text-left
//                 transition-colors
//                 ${
//                   isActive
//                     ? "bg-slate-800"
//                     : "bg-slate-950/40 hover:bg-slate-800/50"
//                 }
//                 ${key === "dyeing" ? "border-l border-slate-800" : ""}
//               `}
//             >
//               <span className="block text-xs text-slate-400">
//                 {chart.label}
//               </span>

//               <span className="mt-1 block text-base font-bold text-white">
//                 {chartData[chartData.length - 1][key].toLocaleString()}{" "}
//                 <span className="text-xs font-normal text-slate-400">kW</span>
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Chart */}
//       <ChartContainer config={chartConfig} className="h-[330px] w-full">
//         <RechartsLineChart
//           accessibilityLayer
//           data={chartData}
//           margin={{
//             left: 5,
//             right: 5,
//             top: 10,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid vertical={false} />

//           <XAxis
//             dataKey="time"
//             tickLine={false}
//             axisLine={false}
//             tickMargin={8}
//             tick={{ fontSize: 10 }}
//           />

//           <ChartTooltip
//             cursor={false}
//             content={
//               <ChartTooltipContent
//                 indicator="line"
//                 formatter={(value) => `${value} kW`}
//               />
//             }
//           />

//           <Line
//             dataKey={activeChart}
//             type="monotone"
//             stroke={`var(--color-${activeChart})`}
//             strokeWidth={3}
//             dot={false}
//             activeDot={{
//               r: 5,
//             }}
//           />
//         </RechartsLineChart>
//       </ChartContainer>

//       {/* Current Value */}
//       <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
//         <span className="text-xs text-slate-400">
//           Current {chartConfig[activeChart].label} load
//         </span>

//         <span className="text-base font-semibold text-white">
//           {currentValue.toLocaleString()} kW
//         </span>
//       </div>
//     </div>
//   );
// };

// export default LineChart;

import React from "react";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    time: "06 AM",
    mainIncomer: 920,
    dyeing: 0,
  },
  {
    time: "08 AM",
    mainIncomer: 1180,
    dyeing: 210,
  },
  {
    time: "10 AM",
    mainIncomer: 1325,
    dyeing: 560,
  },
  {
    time: "12 PM",
    mainIncomer: 1450,
    dyeing: 740,
  },
  {
    time: "02 PM",
    mainIncomer: 1380,
    dyeing: 810,
  },
  {
    time: "04 PM",
    mainIncomer: 1510,
    dyeing: 920,
  },
  {
    time: "06 PM",
    mainIncomer: 1290,
    dyeing: 760,
  },
  {
    time: "08 PM",
    mainIncomer: 1160,
    dyeing: 610,
  },
  {
    time: "10 PM",
    mainIncomer: 1010,
    dyeing: 480,
  },
];

const chartConfig = {
  mainIncomer: {
    label: "Main Incomer",
    color: "var(--chart-1)",
  },

  dyeing: {
    label: "Dyeing Unit",
    color: "var(--chart-2)",
  },
};

const LineChart = () => {
  const [activeChart, setActiveChart] = React.useState("mainIncomer");

  const currentValue = chartData[chartData.length - 1]?.[activeChart] ?? 0;

  return (
    <div className="h-full w-full bg-[#0a0f14] p-5 text-white">
      {/* Compact Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Power Load Trend</p>

            <p className="mt-1 text-xs text-slate-400">Hourly power demand</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {currentValue.toLocaleString()}
            </p>

            <p className="text-[11px] text-slate-500">kW</p>
          </div>
        </div>
      </div>

      {/* Chart Selector */}
      <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-800">
        {Object.keys(chartConfig).map((key) => {
          const isActive = activeChart === key;
          const chart = chartConfig[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveChart(key)}
              className={`
                px-4
                py-3
                text-left
                transition-colors
                ${
                  isActive
                    ? "bg-[#111820]"
                    : "bg-transparent hover:bg-slate-800/50"
                }
                ${key === "dyeing" ? "border-l border-slate-800" : ""}
              `}
            >
              <span className="block text-xs text-slate-400">
                {chart.label}
              </span>

              <span className="mt-1 block text-base font-bold text-white">
                {chartData[chartData.length - 1][key].toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-400">kW</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[330px] w-full">
        <RechartsLineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 5,
            right: 5,
            top: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} className="stroke-slate-800" />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fontSize: 10,
              fill: "#64748b",
            }}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value) => `${value} kW`}
              />
            }
          />

          <Line
            dataKey={activeChart}
            type="monotone"
            stroke={`var(--color-${activeChart})`}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />
        </RechartsLineChart>
      </ChartContainer>

      {/* Current Value */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-xs text-slate-400">
          Current {chartConfig[activeChart].label} load
        </span>

        <span className="text-base font-semibold text-white">
          {currentValue.toLocaleString()} kW
        </span>
      </div>
    </div>
  );
};

export default LineChart;
