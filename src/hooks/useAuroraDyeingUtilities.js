import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";

export const useAuroraDyeingUtilities = () => {
  const { divisionName } = useParams();

  const division = decodeURIComponent(divisionName || "Dyeing").trim();

  return useQuery({
    queryKey: ["auroraUtilities", division],

    queryFn: () => AuroraUtilities(division),

    // BACnet live data
    refetchInterval: 30 * 1000,

    // Query tabhi chale jab division available ho
    enabled: Boolean(division),

    // Previous data ko screen par rakho jab background refetch ho
    placeholderData: (previousData) => previousData,
  });
};
