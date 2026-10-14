import { getSpecificValue } from "@/data/BacNetData";
import { bacnetRead } from "../api";

const getBACnetData = async (instances = []) => {
  try {
    const response = await bacnetRead(instances);

    if (response?.success === false) {
      return {
        success: false,
        data: [],
        message: response.message || "BACnet data read failed",
      };
    }

    const foundData = (response?.data || []).flatMap((item) =>
      (item?.found || []).map((found) => ({
        ...found,
      })),
    );

    return {
      success: true,
      data: foundData,
      message: "Get BacNet Data Successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error?.response?.data?.message ||
        error?.message ||
        "BACnet data read failed",
    };
  }
};

//    7. Merge config + live BACnet data
// const mergeMeterData = (meters = [], bacnetData = []) => {
//   // Active
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

//    8. Calculate total live value
// const calculateTotalValue = (meters = []) => {
//   // Active
//   return meters.reduce((total, meter) => {
//     const value = Number(meter?.value);

//     if (!Number.isFinite(value)) {
//       return total;
//     }

//     return total + value;
//   }, 0);
// };

//    10. Group meters by department
// const groupByDepartment = (meters = []) => {
//   // Active
//   return meters.reduce((result, meter) => {
//     const department = meter?.department || "Unknown";

//     if (!result[department]) {
//       result[department] = [];
//     }

//     result[department].push(meter);

//     return result;
//   }, {});
// };

//    11. Main function
const AuroraData = async (division = "dyeing") => {
  try {
    const instances = getSpecificValue(division, "instance");
    // console.log("My => ", instances);

    const bacNetResult = await getBACnetData(instances);

    //    Merge live values
    // const liveMeters = mergeMeterData(meters, bacNetResult.data);

    //    Total live value
    // const totalValue = calculateTotalValue(liveMeters);

    //    Departments
    // const departmentData = groupByDepartment(liveMeters);

    // return {
    //   division: actualDivision,

    //   departments: {
    //     type: Object.keys(departmentData),
    //     data: departmentData,
    //   },

    //   Data: liveMeters,

    //   dataCount: liveMeters.length,

    //   totalValue: {
    //     value: totalValue,
    //     totaObject: liveMeters.length,
    //   },

    //   totalLoad: totalValue,

    //   totalConsumption: totalValue,

    //   bacnetData: bacNetResult.data,

    //   success: bacNetResult.success,

    //   matchedObjects: bacNetResult.matchedObjects,

    //   requestedInstances: bacNetResult.requestedInstances,

    //   ...(bacNetResult.message && {
    //     message: bacNetResult.message,
    //   }),
    // };

    return bacNetResult;
  } catch (error) {
    console.error("AuroraUtilities Error:", error);

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

export default AuroraData;
