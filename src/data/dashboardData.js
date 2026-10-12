export const regions = [
  "All Regions",
  "North Region",
  "South Region",
  "East Region",
  "West Region",
];

export const buildings = [
  "Main Hospital",
  "Building A",
  "Building B",
  "Research Center",
];

export const floors = [
  "All Floors",
  "Floor 1",
  "Floor 2",
  "Floor 3",
  "Floor 4",
  "Floor 5",
  "Floor 6",
];

export const timeRanges = ["Last 24 Hours", "Last 7 Days", "Last 30 Days"];

// --------------------------------------------------
// TOP STAT CARDS
// --------------------------------------------------

export const statCards1 = [
  {
    id: 1,
    title: "Total KGL Generation",
    value: "3,240",
    unit: "kWh",
    change: "12%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "generation",
    iconTone: "emerald",
  },
  {
    id: 2,
    title: "Total Solar",
    value: "1,850",
    unit: "kWh",
    change: "9%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "solar",
    iconTone: "amber",
  },
  {
    id: 3,
    title: "Total Consumption",
    value: "2,845",
    unit: "kWh",
    change: "8%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "consumption",
    iconTone: "blue",
  },
];

export const statCards2 = [
  {
    id: 4,
    title: "Total Water",
    value: "12,450",
    unit: "m³",
    change: "4%",
    trend: "down",
    comparison: "vs. yesterday",
    icon: "water",
    iconTone: "cyan",
  },
  {
    id: 5,
    title: "Total Air",
    value: "8,720",
    unit: "m³",
    change: "6%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "air",
    iconTone: "violet",
  },
    {
    id: 6,
    title: "Total Gas",
    value: "8,720",
    unit: "m³",
    change: "6%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "air",
    iconTone: "violet",
  },
  {
    id: 7,
    title: "Total Steam",
    value: "4,680",
    unit: "tons",
    change: "5%",
    trend: "up",
    comparison: "vs. yesterday",
    icon: "steam",
    iconTone: "orange",
  },
];

// --------------------------------------------------
// ALERTS
// --------------------------------------------------

export const alerts = [
  {
    id: 1,
    type: "High Load Detected",
    location: "Building A - Floor 6",
    description: "Current load 698 kW (threshold 650 kW)",
    time: "Today, 13:42",
    severity: "high",
    icon: "zap",
  },

  {
    id: 2,
    type: "Abnormal Consumption",
    location: "Building B - Floor 3",
    description: "+35% vs. expected",
    time: "Today, 11:20",
    severity: "medium",
    icon: "chart",
  },

  {
    id: 3,
    type: "Meter Offline",
    location: "Solar Inverter 2",
    description: "No data for 2 hours",
    time: "Today, 09:15",
    severity: "offline",
    icon: "wifi-off",
  },

  {
    id: 4,
    type: "Gas Usage High",
    location: "Building A - Boiler Room",
    description: "+28% vs. average",
    time: "Today, 08:27",
    severity: "warning",
    icon: "flame",
  },
];

// --------------------------------------------------
// BUILDING / ENERGY SOURCE DATA
// Used around the center building image
// --------------------------------------------------

export const buildingEnergy = [
  {
    id: 1,
    name: "Solar",
    value: 186,
    unit: "kW",
    percentage: 12,
    change: "12%",
    trend: "up",
    color: "#FACC15",
    icon: "sun",
    position: "top-left",
  },

  {
    id: 2,
    name: "Electricity",
    value: 362,
    unit: "kW",
    percentage: 23,
    change: "10%",
    trend: "up",
    color: "#22D3EE",
    icon: "zap",
    position: "middle-left",
  },

  {
    id: 3,
    name: "Water",
    value: 66,
    unit: "kW",
    percentage: 4,
    change: "6%",
    trend: "up",
    color: "#38BDF8",
    icon: "droplet",
    position: "bottom-left",
  },

  {
    id: 4,
    name: "Grid",
    value: 248,
    unit: "kW",
    percentage: 15,
    change: "8%",
    trend: "down",
    color: "#3B82F6",
    icon: "network",
    position: "top-right",
  },

  {
    id: 5,
    name: "Gas",
    value: 124,
    unit: "kW",
    percentage: 8,
    change: "14%",
    trend: "down",
    color: "#FF8A1F",
    icon: "flame",
    position: "middle-right",
  },

  {
    id: 6,
    name: "Thermal",
    value: 54,
    unit: "kW",
    percentage: 3,
    change: "9%",
    trend: "down",
    color: "#A855F7",
    icon: "thermometer",
    position: "bottom-right",
  },
];

// --------------------------------------------------
// ENERGY CONSUMPTION CHART
// Chart.js ke liye
// --------------------------------------------------

export const energyConsumption = {
  labels: [
    "12 AM",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ],

  datasets: [
    {
      label: "Electricity",
      data: [
        220, 190, 180, 175, 190, 210, 250, 290, 340, 410, 480, 520, 500, 470,
        450, 440, 460, 500, 610, 720, 650, 520, 420, 340,
      ],
      backgroundColor: "#3B82F6",
      borderColor: "#3B82F6",
      stack: "energy",
    },

    {
      label: "Gas",
      data: [
        40, 35, 32, 30, 35, 40, 45, 55, 70, 85, 95, 100, 90, 80, 75, 70, 65, 70,
        85, 110, 95, 80, 60, 50,
      ],
      backgroundColor: "#F97316",
      borderColor: "#F97316",
      stack: "energy",
    },

    {
      label: "Water",
      data: [
        20, 18, 17, 16, 18, 20, 25, 30, 35, 40, 45, 50, 48, 45, 42, 40, 38, 40,
        45, 55, 50, 42, 35, 28,
      ],
      backgroundColor: "#38BDF8",
      borderColor: "#38BDF8",
      stack: "energy",
    },

    {
      label: "Thermal",
      data: [
        15, 14, 13, 12, 13, 15, 18, 22, 26, 30, 35, 38, 36, 34, 32, 30, 28, 30,
        35, 42, 38, 32, 27, 22,
      ],
      backgroundColor: "#A855F7",
      borderColor: "#A855F7",
      stack: "energy",
    },

    {
      label: "Solar",
      data: [
        0, 0, 0, 0, 0, 0, 5, 15, 35, 60, 90, 120, 145, 160, 170, 165, 150, 130,
        100, 65, 30, 10, 0, 0,
      ],
      backgroundColor: "#4ADE80",
      borderColor: "#4ADE80",
      stack: "energy",
    },
  ],
};

// --------------------------------------------------
// RESOURCE MIX / DOUGHNUT CHART
// --------------------------------------------------

export const resourceMix = {
  total: 2845,
  unit: "kWh",

  labels: ["Electricity", "Gas", "Water", "Thermal", "Solar"],

  values: [58, 16, 9, 7, 10],

  consumption: [1648, 455, 256, 199, 287],

  colors: ["#3B82F6", "#F97316", "#38BDF8", "#A855F7", "#4ADE80"],
};

// --------------------------------------------------
// TOP CONSUMERS
// --------------------------------------------------

export const topConsumers = [
  {
    id: 1,
    rank: 1,
    name: "HVAC System",
    icon: "snowflake",
    consumption: 682,
    unit: "kWh",
    percentage: 24,
    color: "#3B82F6",
  },

  {
    id: 2,
    rank: 2,
    name: "Lighting",
    icon: "lightbulb",
    consumption: 421,
    unit: "kWh",
    percentage: 15,
    color: "#38BDF8",
  },

  {
    id: 3,
    rank: 3,
    name: "Medical Equipment",
    icon: "monitor",
    consumption: 358,
    unit: "kWh",
    percentage: 13,
    color: "#38BDF8",
  },

  {
    id: 4,
    rank: 4,
    name: "Server Room",
    icon: "server",
    consumption: 312,
    unit: "kWh",
    percentage: 11,
    color: "#38BDF8",
  },

  {
    id: 5,
    rank: 5,
    name: "Kitchen (Gas)",
    icon: "flame",
    consumption: 224,
    unit: "kWh",
    percentage: 8,
    color: "#F97316",
  },
];

// --------------------------------------------------
// BOTTOM SUMMARY CARDS
// --------------------------------------------------

export const summaryCards = [
  {
    id: 1,
    title: "Total Load",
    value: "1,236",
    unit: "kW",
    change: "6%",
    trend: "up",
    icon: "zap",
  },

  {
    id: 2,
    title: "Peak Load",
    value: "1,482",
    unit: "kW",
    change: "4%",
    trend: "up",
    icon: "gauge",
  },

  {
    id: 3,
    title: "Total Cost",
    value: "$12,480",
    unit: "",
    change: "7%",
    trend: "up",
    icon: "coins",
  },

  {
    id: 4,
    title: "CO₂ Saved",
    value: "8.6",
    unit: "tons",
    change: "12%",
    trend: "up",
    icon: "leaf",
  },
];

// --------------------------------------------------
// HEADER DATA
// --------------------------------------------------

export const headerData = {
  title: "Energy Management",
  date: "Apr 24, 2025",
  time: "14:32",
  status: "System Online",
  isOnline: true,
};

// --------------------------------------------------
// DEFAULT DASHBOARD OBJECT
// Agar ek hi import se sab data chahiye ho
// --------------------------------------------------

export const dashboardData = {
  regions,
  buildings,
  floors,
  timeRanges,
  statCards1,
  statCards2,
  alerts,
  buildingEnergy,
  energyConsumption,
  resourceMix,
  topConsumers,
  summaryCards,
  headerData,
};

export default dashboardData;
