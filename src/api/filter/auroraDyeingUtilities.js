// import { bacnetRead, getEnergyLog } from "@/api/api";
// import { getSpecificValue } from "@/data/BacNetData";
// import EmsDataFile from "@/data/ems_config_40";

// /* =========================================================
//    1. Get meters from EMS configuration
//    Case-insensitive division matching
// ========================================================= */

// const getMetersData = (division) => {
//   const requestedDivision = String(division || "")
//     .trim()
//     .toLowerCase();

//   return (EmsDataFile?.meters || []).filter((item) => {
//     const meterDivision = String(item?.division || "")
//       .trim()
//       .toLowerCase();

//     return meterDivision === requestedDivision;
//   });
// };

// /* =========================================================
//    2. Get BACnet instances
// ========================================================= */

// const getBACnetInstances = (meters = []) => {
//   return [
//     ...new Set(
//       meters
//         .map((item) => Number(item?.instance))
//         .filter((instance) => Number.isFinite(instance)),
//     ),
//   ];
// };

// /* =========================================================
//    3. Normalize BACnet instance
// ========================================================= */

// const getBACnetInstance = (item) => {
//   const possibleInstances = [
//     item?.instance,
//     item?.instanceNumber,
//     item?.objectInstance,
//     item?.object_instance,
//     item?.requestedInstance,
//     item?.requested_instance,
//     item?.object?.instance,
//     item?.object?.objectInstance,
//   ];

//   for (const value of possibleInstances) {
//     const number = Number(value);

//     if (Number.isFinite(number)) {
//       return number;
//     }
//   }

//   return null;
// };

// /* =========================================================
//    4. Normalize BACnet value
// ========================================================= */

// const getBACnetValue = (item) => {
//   const possibleValues = [
//     item?.value,
//     item?.presentValue,
//     item?.present_value,
//     item?.currentValue,
//     item?.current_value,
//   ];

//   for (const value of possibleValues) {
//     if (
//       value !== null &&
//       value !== undefined &&
//       value !== "" &&
//       Number.isFinite(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return null;
// };

// /* =========================================================
//    5. Read BACnet data
// ========================================================= */

// const getBACnetData = async (instances = []) => {
//   try {
//     const response = await bacnetRead(instances);

//     const foundData = (response?.data || []).flatMap((item) => {
//       const parentInstance = getBACnetInstance(item);

//       return (item?.found || []).map((found) => {
//         const foundInstance = getBACnetInstance(found);

//         return {
//           ...found,

//           instance: foundInstance !== null ? foundInstance : parentInstance,

//           value: getBACnetValue(found),
//         };
//       });
//     });

//     return {
//       success: true,
//       data: foundData,
//       matchedObjects: response?.matchedObjects || 0,
//       requestedInstances: response?.requestedInstances || instances || [],
//     };
//   } catch (error) {
//     return {
//       success: false,
//       data: [],
//       matchedObjects: 0,
//       requestedInstances: instances || [],
//       message:
//         error?.response?.data?.message ||
//         error?.message ||
//         "BACnet data read failed",
//     };
//   }
// };

// /* =========================================================
//    6. Find BACnet live value for meter
// ========================================================= */

// const findBACnetValueForMeter = (meter, bacnetData = []) => {
//   const meterInstance = Number(meter?.instance);

//   if (!Number.isFinite(meterInstance)) {
//     return null;
//   }

//   const matches = bacnetData.filter((item) => {
//     const bacnetInstance = Number(getBACnetInstance(item));

//     return Number.isFinite(bacnetInstance) && bacnetInstance === meterInstance;
//   });

//   if (matches.length === 0) {
//     return null;
//   }

//   /* ---------------------------------------------
//      Parameter match
//   --------------------------------------------- */

//   const meterParameter = meter?.parameter;

//   if (
//     meterParameter !== undefined &&
//     meterParameter !== null &&
//     meterParameter !== ""
//   ) {
//     const parameterMatch = matches.find((item) => {
//       return (
//         item?.parameter === meterParameter ||
//         item?.parameterId === meterParameter ||
//         item?.property === meterParameter ||
//         item?.propertyId === meterParameter
//       );
//     });

//     if (parameterMatch) {
//       return getBACnetValue(parameterMatch);
//     }
//   }

//   /* ---------------------------------------------
//      Fallback to first instance match
//   --------------------------------------------- */

//   return getBACnetValue(matches[0]);
// };

// /* =========================================================
//    7. Merge config + live BACnet data
// ========================================================= */

// const mergeMeterData = (meters = [], bacnetData = []) => {
//   return meters.map((meter) => {
//     const liveValue = findBACnetValueForMeter(meter, bacnetData);

//     return {
//       ...meter,

//       value: liveValue,
//       liveValue,
//       currentValue: liveValue,
//       bacnetValue: liveValue,

//       hasLiveValue: liveValue !== null,
//     };
//   });
// };

// /* =========================================================
//    8. Calculate total live value
// ========================================================= */

// const calculateTotalValue = (meters = []) => {
//   return meters.reduce((total, meter) => {
//     const value = Number(meter?.value);

//     if (!Number.isFinite(value)) {
//       return total;
//     }

//     return total + value;
//   }, 0);
// };

// /* =========================================================
//    9. Group meters by utilities
// ========================================================= */

// const groupByUtilities = async () => {
//   try {
//     const result = await getEnergyLog();

//     if (!Array.isArray(result?.energylog)) {
//       return [];
//     }

//     const utilities = result.energylog
//       .map((item) => item?.utilityType)
//       .filter(Boolean);

//     return [...new Set(utilities)];
//   } catch (error) {
//     console.error("Utilities Group Error:", error);

//     return [];
//   }
// };

// /* =========================================================
//    10. Group meters by department
// ========================================================= */

// const groupByDepartment = (meters = []) => {
//   return meters.reduce((result, meter) => {
//     const department = meter?.department || "Unknown";

//     if (!result[department]) {
//       result[department] = [];
//     }

//     result[department].push(meter);

//     return result;
//   }, {});
// };

// /* =========================================================
//    11. Main function
// ========================================================= */

// const AuroraUtilities = async (division = "Dyeing") => {
//   try {
//       //  Config meters
//     const meters = getMetersData(division);

//     const actualDivision = meters?.[0]?.division || division;

//     /* ---------------------------------------------
//        BACnet instances
//     --------------------------------------------- */

//     // const instances = getBACnetInstances(meters);
//     const instances = getSpecificValue("power");
//     console.log("check instances", instances.dyeing);

//     //  Live BACnet data
//     const bacNetResult = await getBACnetData(instances.dyeing);
//     console.log("bacNetResult : ", bacNetResult.data);

//     /* ---------------------------------------------
//        Merge live values
//     --------------------------------------------- */

//     const liveMeters = mergeMeterData(meters, bacNetResult.data);

//     /* ---------------------------------------------
//        Total live value
//     --------------------------------------------- */

//     const totalValue = calculateTotalValue(liveMeters);

//     /* ---------------------------------------------
//        Departments
//     --------------------------------------------- */

//     const departmentData = groupByDepartment(liveMeters);

//     /* ---------------------------------------------
//        Utilities
//     --------------------------------------------- */

//     const utilities = await groupByUtilities();

//     /* ---------------------------------------------
//        Final response
//     --------------------------------------------- */

//     return {
//       division: actualDivision,

//       utilities: {
//         type: utilities,
//         data: null,
//       },

//       departments: {
//         type: Object.keys(departmentData),
//         data: departmentData,
//       },

//       Data: liveMeters,

//       dataCount: liveMeters.length,

//       totalValue: {
//         value: totalValue,
//         totaObject: liveMeters.length,
//       },

//       totalLoad: totalValue,

//       totalConsumption: totalValue,

//       bacnetData: bacNetResult.data,

//       success: bacNetResult.success,

//       matchedObjects: bacNetResult.matchedObjects,

//       requestedInstances: bacNetResult.requestedInstances,

//       ...(bacNetResult.message && {
//         message: bacNetResult.message,
//       }),
//     };
//   } catch (error) {
//     return {
//       division,

//       utilities: {
//         type: [],
//         data: null,
//       },

//       departments: {
//         type: [],
//         data: {},
//       },

//       Data: [],

//       dataCount: 0,

//       totalValue: {
//         value: 0,
//         totaObject: 0,
//       },

//       totalLoad: 0,

//       totalConsumption: 0,

//       bacnetData: [],

//       matchedObjects: 0,

//       requestedInstances: [],

//       success: false,

//       message:
//         error?.response?.data?.message ||
//         error?.message ||
//         "Aurora utilities data failed",
//     };
//   }
// };

// export default AuroraUtilities;

import { bacnetRead, getEnergyLog } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";
import EmsDataFile from "@/data/ems_config_40";

/* =========================================================
   1. Get meters for requested division
========================================================= */

const getMetersData = (division) => {
  const requestedDivision = String(division || "")
    .trim()
    .toLowerCase();

  return (EmsDataFile?.meters || []).filter(
    (item) =>
      String(item?.division || "")
        .trim()
        .toLowerCase() === requestedDivision,
  );
};

/* =========================================================
   2. Normalize BACnet instance
========================================================= */

const getBACnetInstance = (item) => {
  const possibleInstances = [
    item?.instance,
    item?.instanceNumber,
    item?.objectInstance,
    item?.object_instance,
    item?.requestedInstance,
    item?.requested_instance,
    item?.object?.instance,
    item?.object?.objectInstance,
  ];

  for (const value of possibleInstances) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
};

/* =========================================================
   3. Normalize BACnet value
========================================================= */

const getBACnetValue = (item) => {
  const possibleValues = [
    item?.value,
    item?.presentValue,
    item?.present_value,
    item?.currentValue,
    item?.current_value,
  ];

  for (const value of possibleValues) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
};

/* =========================================================
   4. Read BACnet data
========================================================= */

const getBACnetData = async (instances = []) => {
  try {
    if (!instances.length) {
      return {
        success: false,
        data: [],
        matchedObjects: 0,
        requestedInstances: [],
        message: "No BACnet instances found for this division",
      };
    }

    const response = await bacnetRead(instances);

    const foundData = (response?.data || []).flatMap((item) => {
      const parentInstance = getBACnetInstance(item);

      return (item?.found || []).map((found) => {
        const foundInstance = getBACnetInstance(found);

        return {
          ...found,
          instance: foundInstance !== null ? foundInstance : parentInstance,
          value: getBACnetValue(found),
        };
      });
    });

    return {
      success: true,
      data: foundData,
      matchedObjects: response?.matchedObjects || 0,
      requestedInstances: response?.requestedInstances || instances,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: instances,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "BACnet data read failed",
    };
  }
};

/* =========================================================
   5. Find live value for a meter
========================================================= */

const findBACnetValueForMeter = (meter, bacnetData = []) => {
  const meterInstance = getBACnetInstance(meter);

  if (meterInstance === null) {
    return null;
  }

  const matches = bacnetData.filter(
    (item) => getBACnetInstance(item) === meterInstance,
  );

  if (!matches.length) {
    return null;
  }

  const meterParameter = meter?.parameter;

  if (
    meterParameter !== undefined &&
    meterParameter !== null &&
    meterParameter !== ""
  ) {
    const parameterMatch = matches.find(
      (item) =>
        item?.parameter === meterParameter ||
        item?.parameterId === meterParameter ||
        item?.property === meterParameter ||
        item?.propertyId === meterParameter,
    );

    if (parameterMatch) {
      return getBACnetValue(parameterMatch);
    }
  }

  return getBACnetValue(matches[0]);
};

/* =========================================================
   6. Merge meter configuration with live data
========================================================= */

const mergeMeterData = (meters = [], bacnetData = []) => {
  return meters.map((meter) => {
    const liveValue = findBACnetValueForMeter(meter, bacnetData);

    return {
      ...meter,
      value: liveValue,
      liveValue,
      currentValue: liveValue,
      bacnetValue: liveValue,
      hasLiveValue: liveValue !== null,
    };
  });
};

/* =========================================================
   7. Calculate total live value
========================================================= */

const calculateTotalValue = (meters = []) => {
  return meters.reduce((total, meter) => {
    const value = Number(meter?.value);

    return Number.isFinite(value) ? total + value : total;
  }, 0);
};

/* =========================================================
   8. Get utility types
========================================================= */

const groupByUtilities = async () => {
  try {
    const result = await getEnergyLog();

    if (!Array.isArray(result?.energylog)) {
      return [];
    }

    return [
      ...new Set(
        result.energylog.map((item) => item?.utilityType).filter(Boolean),
      ),
    ];
  } catch (error) {
    console.error("Utilities Group Error:", error);
    return [];
  }
};

/* =========================================================
   9. Group meters by department
========================================================= */

const groupByDepartment = (meters = []) => {
  return meters.reduce((result, meter) => {
    const department = meter?.department || "Unknown";

    if (!result[department]) {
      result[department] = [];
    }

    result[department].push(meter);

    return result;
  }, {});
};

/* =========================================================
   10. Main function
========================================================= */

const AuroraUtilities = async (division = "Dyeing") => {
  const requestedDivision = String(division || "Dyeing").trim();
  const divisionKey = requestedDivision.toLowerCase();

  try {
    // Config meters for requested division
    const meters = getMetersData(requestedDivision);

    const actualDivision = meters?.[0]?.division || requestedDivision;

    // Get power instances for ALL divisions
    const instancesByDivision = getSpecificValue("power");

    // Automatically select requested division
    const divisionInstances = [
      ...new Set(
        (instancesByDivision?.[divisionKey] || [])
          .map(Number)
          .filter(Number.isFinite),
      ),
    ];

    // Read live BACnet data for this division only
    const bacNetResult = await getBACnetData(divisionInstances);

    // Merge live values with configuration
    const liveMeters = mergeMeterData(meters, bacNetResult.data);

    // Calculate totals
    const totalValue = calculateTotalValue(liveMeters);

    // Group by department
    const departmentData = groupByDepartment(liveMeters);

    // Get utility types
    const utilities = await groupByUtilities();

    // Final response
    return {
      division: actualDivision,

      utilities: {
        type: utilities,
        data: null,
      },

      departments: {
        type: Object.keys(departmentData),
        data: departmentData,
      },

      Data: liveMeters,
      dataCount: liveMeters.length,

      totalValue: {
        value: totalValue,
        totaObject: liveMeters.length,
      },

      totalLoad: totalValue,
      totalConsumption: totalValue,

      bacnetData: bacNetResult.data,
      success: bacNetResult.success,
      matchedObjects: bacNetResult.matchedObjects,
      requestedInstances: bacNetResult.requestedInstances,

      ...(bacNetResult.message && {
        message: bacNetResult.message,
      }),
    };
  } catch (error) {
    return {
      division: requestedDivision,

      utilities: {
        type: [],
        data: null,
      },

      departments: {
        type: [],
        data: {},
      },

      Data: [],
      dataCount: 0,

      totalValue: {
        value: 0,
        totaObject: 0,
      },

      totalLoad: 0,
      totalConsumption: 0,

      bacnetData: [],
      matchedObjects: 0,
      requestedInstances: [],
      success: false,

      message:
        error?.response?.data?.message ||
        error?.message ||
        "Aurora utilities data failed",
    };
  }
};

export default AuroraUtilities;
