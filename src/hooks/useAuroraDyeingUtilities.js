// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router";
// import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";

// export const useAuroraDyeingUtilities = () => {
//   const { divisionName } = useParams();
//   console.log("divisionName => ", divisionName);

//   const division = decodeURIComponent(divisionName || "Dyeing").trim();

//   return useQuery({
//     queryKey: ["auroraUtilities", division],

//     queryFn: () => AuroraUtilities(division),

//     // BACnet live data
//     refetchInterval: 30 * 1000,

//     // Query tabhi chale jab division available ho
//     enabled: Boolean(division),

//     // Previous data ko screen par rakho jab background refetch ho
//     placeholderData: (previousData) => previousData,
//   });
// };

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";
import { setDivisionData } from "@/redux/slice/dataSlice";

export const useAuroraDyeingUtilities = (fallbackDivision = "Dyeing") => {
  const { divisionName } = useParams();
  const dispatch = useDispatch();

  // URL division takes priority over the fallback argument.
  const division = decodeURIComponent(
    divisionName || fallbackDivision || "Dyeing",
  )
    .trim()
    .toLowerCase();

  // Read previously loaded data from Redux.
  const cachedData = useSelector((state) => state.data.byDivision[division]);

  const query = useQuery({
    queryKey: ["auroraUtilities", division],

    queryFn: async () => {
      const result = await AuroraUtilities(division);

      // Do not cache unsuccessful API responses as valid data.
      if (!result?.success) {
        throw new Error(result?.message || `Failed to load ${division} data`);
      }

      return result;
    },

    // Request data only when this division is not cached.
    enabled: Boolean(division) && cachedData === undefined,

    // Keep fetched data in React Query's cache indefinitely.
    staleTime: Infinity,
    gcTime: Infinity,

    // Avoid automatic repeat requests.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    retry: 1,
  });

  // Save successfully fetched data in Redux.
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

  // Prefer Redux data when available.
  const data = cachedData ?? query.data;

  return {
    ...query,
    data,

    // Cached data should not show the initial loading screen.
    isPending: cachedData === undefined && query.isPending,

    // An API error matters only if no cached data is available.
    isError: cachedData === undefined && query.isError,
    error: cachedData === undefined ? query.error : null,

    // Cached-only reads do not represent a network request.
    isFetching: cachedData === undefined && query.isFetching,
  };
};
