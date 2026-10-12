import "./App.css";

import Navbar from "./components/Navbar";
import DashboardPage from "./page/dashboard";
import { Route, Routes } from "react-router";
import ConsumptionData from "./page/consuptionData";
import ReportPage from "./page/reportPage";
import PerDepartmentPage from "./page/perDepartmentPage";
import IsAuthenticate from "./components/auth/isAuthenticate";

function App() {

  return (
    <main className="min-h-screen bg-[#070a0e] text-white">
      <Navbar />
      <IsAuthenticate />

      <Routes>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/:divisionName">
          {/* /dyeing */}
          <Route index element={<ConsumptionData />} />

          {/* /dyeing/list */}
          <Route path="list" element={<ReportPage />} />

          {/* /dyeing/Finishing */}
          <Route path=":department" element={<PerDepartmentPage />} />

          {/* /dyeing/Finishing/list */}
          <Route path=":department/list" element={<PerDepartmentPage />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
