import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { BacNetData } from "@/data/BacNetData";
import AuroraUtilities from "@/api/filter/auroraDyeingUtilities";
import { setDivisionData } from "@/redux/slice/dataSlice";

const normalizeDivision = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const DivisionDataPreloader = ({ enabled = false }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const cachedDivisions = useSelector((state) => state.data?.byDivision ?? {});

  const cachedDivisionsRef = useRef(cachedDivisions);

  useEffect(() => {
    cachedDivisionsRef.current = cachedDivisions;
  }, [cachedDivisions]);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;

    const preloadDivisions = async () => {
      const divisions = [
        ...new Set(
          Object.keys(BacNetData ?? {})
            .map(normalizeDivision)
            .filter(Boolean),
        ),
      ];

      for (const division of divisions) {
        if (cancelled) break;

        const queryKey = ["auroraUtilities", division];
        const reduxData = cachedDivisionsRef.current[division];

        if (reduxData !== undefined) {
          if (queryClient.getQueryData(queryKey) === undefined) {
            queryClient.setQueryData(queryKey, reduxData);
          }

          continue;
        }

        const queryData = queryClient.getQueryData(queryKey);

        if (queryData !== undefined) {
          dispatch(setDivisionData({ division, data: queryData }));
          continue;
        }

        try {
          const result = await queryClient.fetchQuery({
            queryKey,
            queryFn: async () => {
              const data = await AuroraUtilities(division);

              if (!data?.success) {
                throw new Error(data?.message || `Failed to load ${division}`);
              }

              return data;
            },
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 0,
          });

          if (!cancelled) {
            dispatch(setDivisionData({ division, data: result }));
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              `Failed to preload "${division}":`,
              error?.message || error,
            );
          }
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
