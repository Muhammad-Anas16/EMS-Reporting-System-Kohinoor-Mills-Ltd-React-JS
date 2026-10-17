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
