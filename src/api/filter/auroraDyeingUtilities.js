import { bacnetRead, getEnergyLog } from "@/api/api";
import { getSpecificValue } from "@/data/BacNetData";

// get BACnet Instance
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
    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
};

//  4. Normalize BACnet value
const getBACnetValue = (item) => {
  const possibleValues = [
    item?.value,
    item?.presentValue,
    item?.present_value,
    item?.currentValue,
    item?.current_value,
  ];

  for (const value of possibleValues) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return null;
};

//  5. Read BACnet data
const getBACnetData = async (instances = []) => {
  try {
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
      requestedInstances: response?.requestedInstances || instances || [],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: instances || [],
      message:
        error?.response?.data?.message ||
        error?.message ||
        "BACnet data read failed",
    };
  }
};

//  6. Find BACnet live value for meter
const findBACnetValueForMeter = (meter, bacnetData = []) => {
  const meterInstance = Number(meter?.instance);

  if (!Number.isFinite(meterInstance)) {
    return null;
  }

  console.log("findBACnetValueForMeter : ", bacnetData);

  const matches = bacnetData.filter((item) => {
    const bacnetInstance = Number(getBACnetInstance(item));

    return Number.isFinite(bacnetInstance) && bacnetInstance === meterInstance;
  });

  if (matches.length === 0) {
    return null;
  }

  /* ---------------------------------------------
     Parameter match
  --------------------------------------------- */

  const meterParameter = meter?.parameter;

  if (
    meterParameter !== undefined &&
    meterParameter !== null &&
    meterParameter !== ""
  ) {
    const parameterMatch = matches.find((item) => {
      return (
        item?.parameter === meterParameter ||
        item?.parameterId === meterParameter ||
        item?.property === meterParameter ||
        item?.propertyId === meterParameter
      );
    });

    if (parameterMatch) {
      return getBACnetValue(parameterMatch);
    }
  }

  /* ---------------------------------------------
     Fallback to first instance match
  --------------------------------------------- */

  return getBACnetValue(matches[0]);
};

/* =========================================================
   8. Calculate total live value
========================================================= */

const calculateTotalValue = (meters = []) => {
  return meters.reduce((total, meter) => {
    const value = Number(meter?.value);

    if (!Number.isFinite(value)) {
      return total;
    }

    return total + value;
  }, 0);
};

/* =========================================================
   9. Group meters by utilities
========================================================= */

const groupByUtilities = async () => {
  try {
    const result = await getEnergyLog();

    if (!Array.isArray(result?.energylog)) {
      return [];
    }

    const utilities = result.energylog
      .map((item) => item?.utilityType)
      .filter(Boolean);

    return [...new Set(utilities)];
  } catch (error) {
    console.error("Utilities Group Error:", error);

    return [];
  }
};

/* =========================================================
   10. Group meters by department
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

const AuroraUtilities = async (division = "Dyeing") => {
  try {
    //  BACnet instances
    const instances = getSpecificValue("power");
    //  Live BACnet data
    const bacNetResult = await getBACnetData(instances.dyeing);

    const data = {};

    for (const [division, divisionInstances] of Object.entries(instances)) {
      const response = await getBACnetData(divisionInstances);
      data[division] = response.data;
    }

    console.log("GET ALL BACNET DATA",data);
    //  Total live value
    const totalValue = calculateTotalValue(liveMeters);

    //  Departments
    const departmentData = groupByDepartment(liveMeters);

    /* ---------------------------------------------
       Utilities
    --------------------------------------------- */

    return {
      departments: {
        type: Object.keys(departmentData),
        data: departmentData,
      },
      totalValue: {
        value: totalValue,
        totaObject: liveMeters.length,
      },
      bacnetData: bacNetResult.data,
      success: bacNetResult.success,

      ...(bacNetResult.message && {
        message: bacNetResult.message,
      }),
    };
  } catch (error) {
    return {
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

      message:
        error?.response?.data?.message ||
        error?.message ||
        "Aurora utilities data failed",
    };
  }
};

export default AuroraUtilities;
