import { bacnetRead } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";
import { getUtilitiesData } from "@/data/UtilitiesData";

const normalizeDivision = (division = "Dyeing") =>
  String(division || "Dyeing")
    .trim()
    .toLowerCase();

const METER_FIELDS = ["status", "power", "amp", "kwh"];

const toInstance = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isSafeInteger(number) && number >= 0 ? number : null;
};

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
    const instance = toInstance(value);

    if (instance !== null) return instance;
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

    if (Number.isFinite(number)) return number;
  }

  return null;
};

const getBACnetData = async (instances = []) => {
  const requestedInstances = [
    ...new Set(
      instances.map(toInstance).filter((instance) => instance !== null),
    ),
  ];

  if (!requestedInstances.length) {
    return {
      success: true,
      data: [],
      matchedObjects: 0,
      requestedInstances: [],
      message: "No BACnet instances configured",
    };
  }

  try {
    const response = await bacnetRead(requestedInstances);

    // Support the common API response shapes.
    const responseData = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

    const foundData = responseData.flatMap((item) => {
      const parentInstance = getBACnetInstance(item);

      if (Array.isArray(item?.found)) {
        return item.found
          .map((found) => ({
            ...found,
            instance: getBACnetInstance(found) ?? parentInstance,
            value: getBACnetValue(found),
          }))
          .filter((found) => found.instance !== null);
      }

      const instance =
        parentInstance ??
        toInstance(item?.requestedInstance) ??
        toInstance(item?.requested_instance);

      if (instance === null) return [];

      return [
        {
          ...item,
          instance,
          value: getBACnetValue(item),
        },
      ];
    });

    const uniqueData = new Map();

    foundData.forEach((item) => {
      // Keep the first valid reading for each instance.
      if (item.instance !== null && !uniqueData.has(item.instance)) {
        uniqueData.set(item.instance, item);
      }
    });

    const data = [...uniqueData.values()];

    return {
      success: response?.success !== false,
      data,
      matchedObjects: response?.matchedObjects ?? data.length,
      requestedInstances: response?.requestedInstances ?? requestedInstances,
      ...(response?.message && {
        message: response.message,
      }),
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

const createValueMap = (bacnetData = []) =>
  new Map(bacnetData.map((item) => [item.instance, getBACnetValue(item)]));

const getLiveValue = (instance, valueMap) => {
  const normalizedInstance = toInstance(instance);

  if (normalizedInstance === null) return null;

  return valueMap.has(normalizedInstance)
    ? valueMap.get(normalizedInstance)
    : null;
};

const getMeterInstances = (meters = []) =>
  meters.flatMap((meter) =>
    METER_FIELDS.map((field) => toInstance(meter?.[field])).filter(
      (instance) => instance !== null,
    ),
  );

const mergeMeterData = (meters = [], valueMap = new Map()) =>
  meters.map((meter) => {
    const instance = toInstance(meter.power);
    const liveValue = getLiveValue(instance, valueMap);

    const readings = Object.fromEntries(
      METER_FIELDS.map((field) => {
        const fieldInstance = toInstance(meter[field]);
        const value = getLiveValue(fieldInstance, valueMap);

        return [
          field,
          {
            instance: fieldInstance,
            value,
            liveValue: value,
            hasLiveValue: value !== null,
          },
        ];
      }),
    );

    return {
      ...meter,
      instance,
      value: liveValue,
      liveValue,
      currentValue: liveValue,
      bacnetValue: liveValue,
      hasLiveValue: liveValue !== null,
      readings,
    };
  });

const collectIncoming = (incoming = {}, valueMap = new Map()) =>
  Object.entries(incoming)
    .map(([key, rawInstance]) => {
      const instance = toInstance(rawInstance);

      if (instance === null) return null;

      const value = getLiveValue(instance, valueMap);

      return {
        key,
        instance,
        value,
        liveValue: value,
        hasLiveValue: value !== null,
      };
    })
    .filter(Boolean);

const collectHTGroups = (htGroups = {}, valueMap = new Map()) => {
  const readings = [];

  const traverse = (node, path = []) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return;
    }

    const isMeter = METER_FIELDS.some(
      (field) => toInstance(node[field]) !== null,
    );

    if (isMeter) {
      METER_FIELDS.forEach((field) => {
        const instance = toInstance(node[field]);

        if (instance === null) return;

        const value = getLiveValue(instance, valueMap);

        readings.push({
          path: [...path, field].join("."),
          groupPath: path.join("."),
          meter: path[path.length - 1] ?? "Unknown",
          metric: field,
          instance,
          value,
          liveValue: value,
          hasLiveValue: value !== null,
        });
      });

      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      traverse(value, [...path, key]);
    });
  };

  traverse(htGroups);

  return readings;
};

const calculateTotalValue = (meters = []) =>
  meters.reduce((total, meter) => {
    // Only electrical power readings belong in this total.
    const value = meter.readings?.power?.liveValue;

    return Number.isFinite(value) ? total + value : total;
  }, 0);

const groupByDepartment = (meters = []) =>
  meters.reduce((result, meter) => {
    const department = meter.department || "Unknown";

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
    totalObject: 0,
    totaObject: 0,
  },
  totalLoad: 0,
  totalConsumption: 0,
  incoming: {
    config: {},
    instances: [],
    data: [],
  },
  htGroups: {
    config: {},
    instances: [],
    data: [],
  },
  bacnetData: [],
  matchedObjects: 0,
  requestedInstances: [],
  success: false,
  message,
});

const AuroraUtilities = async (division = "Dyeing") => {
  const divisionKey = normalizeDivision(division);

  try {
    const utilityConfig = getUtilitiesData(divisionKey);

    if (!utilityConfig) {
      return createErrorResponse(
        divisionKey,
        `No utility configuration found for division: ${divisionKey}`,
      );
    }

    const meters = getMetersData(divisionKey);

    const incomingConfig = utilityConfig.incoming ?? {};
    const htGroupsConfig = utilityConfig.htGroups ?? {};

    const incomingInstances = Object.values(incomingConfig)
      .map(toInstance)
      .filter((instance) => instance !== null);

    const htGroupInstances = [];

    const collectConfiguredHTInstances = (node) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) {
        return;
      }

      const isMeter = METER_FIELDS.some(
        (field) => toInstance(node[field]) !== null,
      );

      if (isMeter) {
        METER_FIELDS.forEach((field) => {
          const instance = toInstance(node[field]);

          if (instance !== null) {
            htGroupInstances.push(instance);
          }
        });

        return;
      }

      Object.values(node).forEach(collectConfiguredHTInstances);
    };

    collectConfiguredHTInstances(htGroupsConfig);

    const meterInstances = getMeterInstances(meters);

    const instances = [
      ...new Set([
        ...meterInstances,
        ...incomingInstances,
        ...htGroupInstances,
      ]),
    ];

    const bacNetResult = await getBACnetData(instances);
    const valueMap = createValueMap(bacNetResult.data);

    const liveMeters = mergeMeterData(meters, valueMap);
    const totalValue = calculateTotalValue(liveMeters);
    const departmentData = groupByDepartment(liveMeters);

    const incomingData = collectIncoming(incomingConfig, valueMap);

    const htGroupData = collectHTGroups(htGroupsConfig, valueMap);

    const allConfiguredCount = instances.length;
    const liveValueCount = instances.filter(
      (instance) => valueMap.get(instance) !== null && valueMap.has(instance),
    ).length;

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

      // Existing meter response is preserved.
      Data: liveMeters,
      dataCount: liveMeters.length,

      totalValue: {
        value: totalValue,
        totalObject: liveMeters.length,
        totaObject: liveMeters.length,
      },

      // Electrical power only; not water, gas or kWh.
      totalLoad: totalValue,

      // Keep the legacy field for compatibility.
      // This is not a verified cumulative energy total.
      totalConsumption: totalValue,

      incoming: {
        config: incomingConfig,
        instances: incomingInstances,
        data: incomingData,
        values: Object.fromEntries(
          incomingData.map((item) => [item.key, item.value]),
        ),
      },

      htGroups: {
        config: htGroupsConfig,
        instances: [...new Set(htGroupInstances)],
        data: htGroupData,
        dataCount: htGroupData.length,
        values: htGroupData.reduce((result, item) => {
          result[item.path] = item.value;
          return result;
        }, {}),
      },

      bacnetData: bacNetResult.data,
      success: bacNetResult.success,
      matchedObjects: bacNetResult.matchedObjects,
      requestedInstances: bacNetResult.requestedInstances,

      diagnostics: {
        configuredInstances: allConfiguredCount,
        liveValueCount,
        missingValueCount: allConfiguredCount - liveValueCount,
        meterCount: liveMeters.length,
        incomingCount: incomingData.length,
        htGroupReadingCount: htGroupData.length,
      },

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
