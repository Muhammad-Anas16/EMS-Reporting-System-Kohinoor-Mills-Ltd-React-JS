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
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";
import { setDivisionData } from "@/redux/slice/dataSlice";

export const useAuroraDyeingUtilities = () => {
  const { divisionName } = useParams();
  const dispatch = useDispatch();

  const division = decodeURIComponent(divisionName || "Dyeing").trim();

  const query = useQuery({
    queryKey: ["auroraUtilities", division],
    queryFn: () => AuroraUtilities(division),
    refetchInterval: 30 * 1000,
    enabled: Boolean(division),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (
      query.isSuccess &&
      !query.isPlaceholderData &&
      query.data !== undefined
    ) {
      dispatch(
        setDivisionData({
          division,
          data: query.data,
        }),
      );
    }
  }, [
    query.data,
    query.isSuccess,
    query.isPlaceholderData,
    division,
    dispatch,
  ]);

  return query;
};
