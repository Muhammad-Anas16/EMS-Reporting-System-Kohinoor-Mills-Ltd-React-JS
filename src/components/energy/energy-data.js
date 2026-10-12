// import { Droplet, Wind, Flame, Zap, Waves } from "lucide-react";

// export const energyData = [
//   {
//     id: "air",
//     name: "Air",
//     label: "Air Consumption",
//     value: "12,450",
//     unit: "m³",
//     percentage: 25,
//     color: "#FFC000", // Gold / Yellow
//     sliceColor: "#FFC000",
//     icon: Wind,
//     iconPosition: "left",
//     positionClass: "top-[10%] right-[-2%] sm:right-[-6%] lg:right-[-8%]",
//     change: "4%",
//     isIncrease: false,
//   },
//   {
//     id: "gas",
//     name: "Gas",
//     label: "Gas Consumption",
//     value: "4,680",
//     unit: "tons",
//     percentage: 20,
//     color: "#FF4D00", // Orange-Red
//     sliceColor: "#FF4D00",
//     icon: Flame,
//     iconPosition: "left",
//     positionClass: "bottom-[22%] right-[-2%] sm:right-[-6%] lg:right-[-8%]",
//     change: "5%",
//     isIncrease: false,
//   },
//   {
//     id: "electrical",
//     name: "Electrical",
//     label: "Electrical Consumption",
//     value: "362",
//     unit: "kW",
//     percentage: 15,
//     color: "#3B82F6", // Blue / Slate
//     sliceColor: "#2A3B50",
//     icon: Zap,
//     iconPosition: "left",
//     positionClass: "bottom-[-4%] left-1/2 -translate-x-1/2",
//     change: "9%",
//     isIncrease: true,
//   },
//   {
//     id: "steam",
//     name: "Steam",
//     label: "Steam Consumption",
//     value: "6,720",
//     unit: "ton",
//     percentage: 20,
//     color: "#00C853", // Emerald Green
//     sliceColor: "#00C853",
//     icon: Waves,
//     iconPosition: "right",
//     positionClass: "bottom-[22%] left-[-2%] sm:left-[-6%] lg:left-[-8%]",
//     change: "6%",
//     isIncrease: true,
//   },
//   {
//     id: "water",
//     name: "Water",
//     label: "Water Consumption",
//     value: "2,845",
//     unit: "m³",
//     percentage: 20,
//     color: "#0075FF", // Neon Blue
//     sliceColor: "#0075FF",
//     icon: Droplet,
//     iconPosition: "right",
//     positionClass: "top-[10%] left-[-2%] sm:left-[-6%] lg:left-[-8%]",
//     change: "4%",
//     isIncrease: false,
//   },
// ];

// export const consumptionData = [
//   { type: "Gas" },
//   { type: "water" },
//   { type: "Electricity" },
//   { type: "Steam" },
//   { type: "Air" },
// ];

import { Droplet, Wind, Flame, Zap, Waves } from "lucide-react";

export const energyData = [
  {
    id: "air",
    name: "Air",
    label: "Air Consumption",
    value: "12,450",
    unit: "m³",
    percentage: 25,
    color: "#FFC000",
    sliceColor: "#FFC000",
    icon: Wind,
    iconPosition: "left",
    positionClass: "top-[10%] right-[-2%] sm:right-[-6%] lg:right-[-8%]",
    change: "4%",
    isIncrease: false,
  },

  {
    id: "gas",
    name: "Gas",
    label: "Gas Consumption",
    value: "4,680",
    unit: "tons",
    percentage: 20,
    color: "#FF4D00",
    sliceColor: "#FF4D00",
    icon: Flame,
    iconPosition: "left",
    positionClass: "bottom-[22%] right-[-2%] sm:right-[-6%] lg:right-[-8%]",
    change: "5%",
    isIncrease: false,
  },

  {
    id: "electrical",
    name: "Electrical",
    label: "Electrical Consumption",
    value: "362",
    unit: "kW",
    percentage: 15,
    color: "#3B82F6",
    sliceColor: "#2A3B50",
    icon: Zap,
    iconPosition: "left",
    positionClass: "bottom-[-4%] left-1/2 -translate-x-1/2",
    change: "9%",
    isIncrease: true,
  },

  {
    id: "steam",
    name: "Steam",
    label: "Steam Consumption",
    value: "6,720",
    unit: "ton",
    percentage: 20,
    color: "#00C853",
    sliceColor: "#00C853",
    icon: Waves,
    iconPosition: "right",
    positionClass: "bottom-[22%] left-[-2%] sm:left-[-6%] lg:left-[-8%]",
    change: "6%",
    isIncrease: true,
  },

  {
    id: "water",
    name: "Water",
    label: "Water Consumption",
    value: "2,845",
    unit: "m³",
    percentage: 20,
    color: "#0075FF",
    sliceColor: "#0075FF",
    icon: Droplet,
    iconPosition: "right",
    positionClass: "top-[10%] left-[-2%] sm:left-[-6%] lg:left-[-8%]",
    change: "4%",
    isIncrease: false,
  },
];

export const consumptionData = [
  {
    type: "Gas",
  },
  {
    type: "Water",
  },
  {
    type: "Electricity",
  },
  {
    type: "Steam",
  },
  {
    type: "Air",
  },
];
