import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { BacNetData } from "@/data/BacNetData";
import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";
import { setDivisionData } from "@/redux/slice/dataSlice";

const DivisionDataPreloader = ({ enabled = false }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const preloadDivisions = async () => {
      const divisions = Object.keys(BacNetData);

      // Load divisions sequentially, not all at once.
      for (const division of divisions) {
        if (cancelled) break;

        const divisionKey = division.trim().toLowerCase();

        try {
          const result = await queryClient.fetchQuery({
            queryKey: ["auroraUtilities", divisionKey],

            queryFn: async () => {
              const data = await AuroraUtilities(divisionKey);

              if (!data?.success) {
                throw new Error(
                  data?.message || `Failed to load ${divisionKey}`,
                );
              }

              return data;
            },

            staleTime: Infinity,
            gcTime: Infinity,
            retry: 0,
          });

          if (!cancelled) {
            dispatch(
              setDivisionData({
                division: divisionKey,
                data: result,
              }),
            );
          }
        } catch (error) {
          console.error(`Failed to preload ${divisionKey}:`, error);

          // Continue loading the remaining divisions.
        }
      }
    };

    preloadDivisions();

    return () => {
      cancelled = true;
    };
  }, [enabled, dispatch, queryClient]);

  return null;
};

export default DivisionDataPreloader;
