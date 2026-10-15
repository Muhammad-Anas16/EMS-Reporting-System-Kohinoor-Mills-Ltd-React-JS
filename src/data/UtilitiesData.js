import { BacNetData } from "@/data/BacNetData";

// Get utility data for a specific division
export const getUtilitiesData = (division) => {
  const normalizedDivision = division?.trim()?.toLowerCase();

  if (!normalizedDivision) return null;

  const divisionData = BacNetData[normalizedDivision];

  if (!divisionData) return null;

  return {
    incoming: divisionData.incoming ?? {},
    departmentTotals: divisionData.departmentTotals ?? {},
    departments: divisionData.departments ?? {},
    htGroups: divisionData.htGroups ?? {},
  };
};

// Get incoming BACnet instances for a specific division
export const getIncomingInstances = (division) => {
  const incoming = getUtilitiesData(division)?.incoming;

  if (!incoming) return [];

  return ["lesco", "kgl", "solar", "boiler_out"]
    .map((key) => incoming[key])
    .filter(Number.isFinite);
};

export const getHTGroupInstances = (division) => {
  const htGroups = getUtilitiesData(division)?.htGroups;

  if (!htGroups) return [];

  const instances = [];

  const traverse = (node) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return;
    }

    const isMeter = ["status", "power", "amp", "kwh"].some((key) =>
      Number.isFinite(node[key]),
    );

    if (isMeter) {
      ["status", "power", "amp", "kwh"].forEach((key) => {
        if (Number.isFinite(node[key])) {
          instances.push(node[key]);
        }
      });

      return;
    }

    Object.values(node).forEach(traverse);
  };

  traverse(htGroups);

  return [...new Set(instances)];
};

// const weavingHTInstances = getHTGroupInstances("weaving");
// const apparelHTInstances = getHTGroupInstances("apparel");
// const dyeingHTInstances = getHTGroupInstances("dyeing");

// console.log("Weaving HT:", weavingHTInstances);
// console.log("Apparel HT:", apparelHTInstances);
// console.log("Dyeing HT:", dyeingHTInstances);