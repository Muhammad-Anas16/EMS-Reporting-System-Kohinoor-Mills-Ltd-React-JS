import React from "react";
import { useAuroraDyeingUtilities } from "@/hooks/useAuroraDyeingUtilities";

const TestDashboard = () => {
  const { data, isPending, isError, error, isFetching, refetch } =
    useAuroraDyeingUtilities("Dyeing");

  console.log("Check Data => ", data);

  if (isPending) {
    return <div>Loading Dyeing data...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Something went wrong"}</div>;
  }

  return (
    <div>
      <h2>{data.division}</h2>

      <p>Success: {String(data.success)}</p>

      <p>Total Meters: {data.dataCount}</p>

      <p>Total Value: {data.totalValue?.value}</p>

      <p>BACnet Objects: {data.bacnetData?.length}</p>

      <p>Departments: {data.departments?.type?.length}</p>

      <p>Utilities: {data.utilities?.type?.join(", ")}</p>

      {isFetching && <p>Updating...</p>}

      <button onClick={() => refetch()}>Refresh</button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestDashboard;
