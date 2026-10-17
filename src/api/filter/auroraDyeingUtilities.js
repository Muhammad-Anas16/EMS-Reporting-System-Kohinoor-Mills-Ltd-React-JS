import { bacnetRead } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";

const normalizeDivision = (division = "Dyeing") =>
  String(division || "Dyeing")
    .trim()
    .toLowerCase();

const getMetersData = (division) => {
  const divisionKey = normalizeDivision(division);
  const result = getSpecificValue(null, divisionKey);
  const meters = result?.[divisionKey];

  if (!Array.isArray(meters)) return [];

  return meters.map((meter) => ({
    ...meter,
    division: meter.division || divisionKey,
    meter_key: meter.meter_key,
    meter_name: meter.meter_name || meter.meter_key,
    department: meter.department || "Unknown",
  }));
};

const getBACnetInstances = (meters = []) => [
  ...new Set(
    meters
      .map((meter) => Number(meter.power))
      .filter((instance) => Number.isSafeInteger(instance) && instance >= 0),
  ),
];

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

    const responseData = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];

    const foundData = responseData.flatMap((item) => {
      const parentInstance = getBACnetInstance(item);

      if (!Array.isArray(item?.found)) {
        const instance =
          parentInstance ??
          getBACnetInstance({
            instance: item?.requestedInstance,
          });

        if (instance === null) return [];

        return [
          {
            ...item,
            instance,
            value: getBACnetValue(item),
          },
        ];
      }

      return item.found.map((found) => ({
        ...found,
        instance: getBACnetInstance(found) ?? parentInstance,
        value: getBACnetValue(found),
      }));
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

const mergeMeterData = (meters = [], bacnetData = []) =>
  meters.map((meter) => {
    const liveValue = findBACnetValueForMeter(meter, bacnetData);

    return {
      ...meter,
      instance: meter.power,
      value: liveValue,
      liveValue,
      currentValue: liveValue,
      bacnetValue: liveValue,
      hasLiveValue: liveValue !== null,
    };
  });

const calculateTotalValue = (meters = []) =>
  meters.reduce((total, meter) => {
    if (meter?.liveValue === null || meter?.liveValue === undefined) {
      return total;
    }

    const value = Number(meter.liveValue);
    return Number.isFinite(value) ? total + value : total;
  }, 0);

const groupByDepartment = (meters = []) =>
  meters.reduce((result, meter) => {
    const department = meter?.department || "Unknown";

    if (!result[department]) {
      result[department] = [];
    }

    result[department].push(meter);
    return result;
  }, {});

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

const AuroraUtilities = async (division = "Dyeing") => {
  const divisionKey = normalizeDivision(division);

  try {
    const meters = getMetersData(divisionKey);

    if (!meters.length) {
      return createErrorResponse(
        divisionKey,
        `No meter configuration found for division: ${divisionKey}`,
      );
    }

    const instances = getBACnetInstances(meters);
    const bacNetResult = await getBACnetData(instances);

    const liveMeters = mergeMeterData(meters, bacNetResult.data);
    const totalValue = calculateTotalValue(liveMeters);
    const departmentData = groupByDepartment(liveMeters);

    return {
      division: divisionKey,

      utilities: {
        type: [],
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
