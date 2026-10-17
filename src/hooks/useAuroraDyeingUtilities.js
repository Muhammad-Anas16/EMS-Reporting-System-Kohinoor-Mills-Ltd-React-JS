import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";
import { setDivisionData } from "@/redux/slice/dataSlice";

const normalizeDivision = (value) => {
  try {
    return decodeURIComponent(String(value ?? ""))
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  } catch {
    return String(value ?? "")
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }
};

export const useAuroraDyeingUtilities = (fallbackDivision = "Dyeing") => {
  const { divisionName } = useParams();
  const dispatch = useDispatch();

  const division = normalizeDivision(
    divisionName || fallbackDivision || "Dyeing",
  );

  const cachedData = useSelector((state) => state.data?.byDivision?.[division]);

  const query = useQuery({
    queryKey: ["auroraUtilities", division],

    queryFn: async () => {
      const result = await AuroraUtilities(division);

      if (!result || result.success !== true) {
        throw new Error(result?.message || `Failed to load ${division} data`);
      }

      return result;
    },

    enabled: Boolean(division) && cachedData === undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data !== undefined) {
      dispatch(
        setDivisionData({
          division,
          data: query.data,
        }),
      );
    }
  }, [query.isSuccess, query.data, division, dispatch]);

  const data = cachedData ?? query.data;
  const hasCachedData = data !== undefined && data !== null;

  return {
    ...query,
    data,
    isPending: !hasCachedData && query.isPending,
    isLoading: !hasCachedData && query.isLoading,
    isError: !hasCachedData && query.isError,
    error: hasCachedData ? null : query.error,
    isFetching: query.isFetching,
  };
};
