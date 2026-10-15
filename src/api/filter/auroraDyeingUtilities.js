import { bacnetRead, getEnergyLog } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";

//  1. Normalize division name
const normalizeDivision = (division = "Dyeing") => {
  return String(division || "Dyeing")
    .trim()
    .toLowerCase();
};

//  2. Get meter records directly from BacNetData
const getMetersData = (division) => {
  const divisionKey = normalizeDivision(division);

  const result = getSpecificValue(null, divisionKey);

  const meters = result?.[divisionKey];

  if (!Array.isArray(meters)) {
    return [];
  }

  return meters.map((meter) => ({
    ...meter,
    division: meter.division || divisionKey,
    meter_key: meter.meter_key,
    meter_name: meter.meter_name || meter.meter_key,
    department: meter.department || "Unknown",
  }));
};

//  3. Get unique power instances for requested division
const getBACnetInstances = (meters = []) => {
  return [
    ...new Set(
      meters
        .map((meter) => Number(meter.power))
        .filter((instance) => Number.isSafeInteger(instance) && instance >= 0),
    ),
  ];
};

//  4. Normalize BACnet instance
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

    if (Number.isSafeInteger(number) && number >= 0) {
      return number;
    }
  }

  return null;
};

//  5. Normalize BACnet value
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

//  6. Read live BACnet data
const getBACnetData = async (instances = []) => {
  const requestedInstances = [...new Set(instances)];

  if (!requestedInstances.length) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: [],
      message: "No BACnet power instances found for this division",
    };
  }

  try {
    const response = await bacnetRead(requestedInstances);

    // Support either an array or an API response object.
    const responseData = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];

    const foundData = responseData.flatMap((item) => {
      const parentInstance = getBACnetInstance(item);

      // Some API responses return found objects; others return
      // the actual value directly on the parent object.
      if (!Array.isArray(item?.found)) {
        const instance =
          parentInstance ??
          getBACnetInstance({
            instance: item?.requestedInstance,
          });

        if (instance === null) {
          return [];
        }

        return [
          {
            ...item,
            instance,
            value: getBACnetValue(item),
          },
        ];
      }

      return item.found.map((found) => {
        const foundInstance = getBACnetInstance(found);

        return {
          ...found,
          instance: foundInstance !== null ? foundInstance : parentInstance,
          value: getBACnetValue(found),
        };
      });
    });

    return {
      success: response?.success !== false,
      data: foundData,
      matchedObjects: response?.matchedObjects ?? foundData.length,
      requestedInstances: response?.requestedInstances ?? requestedInstances,
      ...(response?.message && { message: response.message }),
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "BACnet data read failed",
    };
  }
};

//  7. Find live value by power instance
const findBACnetValueForMeter = (meter, bacnetData = []) => {
  const meterInstance = Number(meter?.power);

  if (!Number.isSafeInteger(meterInstance) || meterInstance < 0) {
    return null;
  }

  const match = bacnetData.find(
    (item) => getBACnetInstance(item) === meterInstance,
  );

  return match ? getBACnetValue(match) : null;
};

//  8. Merge meter records with live power readings
const mergeMeterData = (meters = [], bacnetData = []) => {
  return meters.map((meter) => {
    const liveValue = findBACnetValueForMeter(meter, bacnetData);

    return {
      ...meter,

      // Keep the configured BACnet instance separate from
      // the actual live reading.
      instance: meter.power,

      value: liveValue,
      liveValue,
      currentValue: liveValue,
      bacnetValue: liveValue,

      hasLiveValue: liveValue !== null,
    };
  });
};

//  9. Calculate total live power
const calculateTotalValue = (meters = []) => {
  return meters.reduce((total, meter) => {
    if (meter?.liveValue === null || meter?.liveValue === undefined) {
      return total;
    }

    const value = Number(meter.liveValue);

    return Number.isFinite(value) ? total + value : total;
  }, 0);
};

//  10. Get utility types
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

//  11. Group meters by department
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

//  12. Standard error response
const createErrorResponse = (division, message) => ({
  division,
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
  message,
});

//  13. Main function
const AuroraUtilities = async (division = "Dyeing") => {
  const divisionKey = normalizeDivision(division);

  try {
    // Read all meter details from BacNetData via getSpecificValue.
    const meters = getMetersData(divisionKey);

    if (!meters.length) {
      return createErrorResponse(
        divisionKey,
        `No meter configuration found for division: ${divisionKey}`,
      );
    }

    // Only request this division's power instances.
    const instances = getBACnetInstances(meters);

    // Read live values.
    const bacNetResult = await getBACnetData(instances);

    // Merge readings into the matching meter records.
    const liveMeters = mergeMeterData(meters, bacNetResult.data);

    const totalValue = calculateTotalValue(liveMeters);
    const departmentData = groupByDepartment(liveMeters);
    const utilities = await groupByUtilities();

    return {
      division: divisionKey,

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
    console.error("AuroraUtilities Error:", error);

    return createErrorResponse(
      divisionKey,
      error?.response?.data?.message ||
        error?.message ||
        "Aurora utilities data failed",
    );
  }
};

export default AuroraUtilities;
