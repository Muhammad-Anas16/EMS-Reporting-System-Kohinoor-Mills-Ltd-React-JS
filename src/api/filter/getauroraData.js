import { getSpecificValue } from "@/data/BacNetData";
import { bacnetRead } from "@/api/api";

const normalizeBACnetResponse = (response) => {
  let payload = response;

  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(payload)) break;

    if (payload?.success === false || payload?.ok === false) {
      break;
    }

    if (Array.isArray(payload?.data)) {
      break;
    }

    if (payload?.data && typeof payload.data === "object") {
      payload = payload.data;
      continue;
    }

    break;
  }

  const groups = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const data = groups.flatMap((item) => {
    const parentInstance = [
      item?.instance,
      item?.instanceNumber,
      item?.objectInstance,
      item?.requestedInstance,
    ]
      .map(Number)
      .find((value) => Number.isSafeInteger(value) && value >= 0);

    const found = Array.isArray(item?.found) ? item.found : [item];

    return found
      .map((entry) => {
        const candidateInstances = [
          entry?.instance,
          entry?.instanceNumber,
          entry?.objectInstance,
          entry?.requestedInstance,
          parentInstance,
        ];

        const instance = candidateInstances
          .map(Number)
          .find((value) => Number.isSafeInteger(value) && value >= 0);

        const candidates = [
          entry?.value,
          entry?.presentValue,
          entry?.present_value,
          entry?.currentValue,
          entry?.current_value,
        ];

        let value = null;

        for (const candidate of candidates) {
          if (
            candidate === null ||
            candidate === undefined ||
            candidate === ""
          ) {
            continue;
          }

          const number = Number(candidate);

          if (Number.isFinite(number)) {
            value = number;
            break;
          }
        }

        return {
          ...entry,
          ...(instance !== undefined && { instance }),
          value,
        };
      })
      .filter((entry) => entry.instance !== undefined);
  });

  return {
    success: payload?.success !== false && payload?.ok !== false,
    data,
    matchedObjects: payload?.matchedObjects ?? data.length,
    requestedInstances: payload?.requestedInstances ?? [],
    message: payload?.message,
  };
};

const getBACnetData = async (instances = []) => {
  if (!Array.isArray(instances) || instances.length === 0) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: [],
      message: "No valid BACnet instances found.",
    };
  }

  const normalizedInstances = [
    ...new Set(
      instances
        .map(Number)
        .filter((instance) => Number.isSafeInteger(instance) && instance >= 0),
    ),
  ];

  if (normalizedInstances.length === 0) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: [],
      message: "No valid BACnet instances found.",
    };
  }

  try {
    const response = await bacnetRead(normalizedInstances);

    if (response?.success === false || response?.ok === false) {
      return {
        success: false,
        data: [],
        matchedObjects: 0,
        requestedInstances: normalizedInstances,
        message: response?.message || "BACnet data read failed.",
      };
    }

    const result = normalizeBACnetResponse(response);

    return {
      ...result,
      requestedInstances:
        result.requestedInstances.length > 0
          ? result.requestedInstances
          : normalizedInstances,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: normalizedInstances,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "BACnet data read failed.",
    };
  }
};

const AuroraData = async (division = "Dyeing") => {
  try {
    const instances = getSpecificValue(division, "instance");

    if (!Array.isArray(instances)) {
      return {
        division,
        success: false,
        data: [],
        matchedObjects: 0,
        requestedInstances: [],
        message: `No BACnet instances found for division: ${division}`,
      };
    }

    const result = await getBACnetData(instances);

    return {
      division,
      ...result,
    };
  } catch (error) {
    console.error("AuroraData Error:", error);

    return {
      division,
      success: false,
      data: [],
      matchedObjects: 0,
      requestedInstances: [],
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Aurora BACnet data failed.",
    };
  }
};

export default AuroraData;
