// import React from "react";
// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// import EnergyPill from "./EnergyPill";
// import { energyData } from "./energy-data";

// const EnergyDonut = (data) => {
//   console.log(data.data);
//   return (
//     <div className="relative mx-auto my-4 flex aspect-square w-full max-w-[500px] items-center justify-center bg-[#070a0e]">
//       {/* Donut Chart */}
//       <div className="relative h-full w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={energyData}
//               dataKey="percentage"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius="64%"
//               outerRadius="88%"
//               paddingAngle={4}
//               stroke="none"
//               startAngle={90}
//               endAngle={-270}
//               animationDuration={1000}
//             >
//               {energyData.map((entry) => (
//                 <Cell
//                   key={entry.id}
//                   fill={entry.sliceColor}
//                   style={{
//                     filter: `drop-shadow(0 0 10px ${entry.color}66)`,
//                   }}
//                 />
//               ))}
//             </Pie>

//             <Tooltip
//               cursor={false}
//               contentStyle={{
//                 background: "#0a0f14",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 borderRadius: "10px",
//                 color: "#ffffff",
//               }}
//               itemStyle={{
//                 color: "#ffffff",
//               }}
//               labelStyle={{
//                 color: "#ffffff",
//               }}
//               formatter={(value, name) => [`${value}%`, name]}
//             />
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Center Area */}
//         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//           <div className="flex items-center justify-center rounded-full border border-white/5 bg-transparent p-4 shadow-2xl backdrop-blur-sm">
//             {/* Center content can be added here later */}
//           </div>
//         </div>
//       </div>

//       {/* Floating Energy Pills */}
//       {energyData.map((item) => (
//         <div key={item.id} className={`absolute z-10 ${item.positionClass}`}>
//           <EnergyPill item={item} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EnergyDonut;

import React from "react";
import PieChartCard from "../chart/pieChartText";

const EnergyDonut = ({ data }) => {
  // console.log("EnergyDonut Data:", data);

  return (
    <div className="w-full">
      <PieChartCard data={data} label="Dyeing" unit="Meters" />
    </div>
  );
};

export default EnergyDonut;
