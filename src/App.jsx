import "./App.css";

import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";

import Navbar from "./components/Navbar";
import DashboardPage from "./page/dashboard";
import ConsumptionData from "./page/consuptionData";
import ReportPage from "./page/reportPage";
import PerDepartmentPage from "./page/perDepartmentPage";
import CurrentLoadPage from "./page/energy/CurrentLoadPage";

import IsAuthenticate from "./components/auth/isAuthenticate";
import AdminPanel from "./page/AdminPanel";
import { checkUserIsLogin } from "./api/api";
import TodaysConsumption from "./components/energy/TodaysConsumption";

const PageNotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <h1 className="text-4xl font-bold text-white">404</h1>
    <p className="mt-3 text-slate-400">Page not found.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const isAdmin = [
    user?.role?.name,
    typeof user?.role === "string" ? user.role : "",
    user?.type,
  ].some(
    (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase() === "admin",
  );

  const userType = String(user?.type ?? "")
    .trim()
    .toLowerCase();

  const userPath = userType ? `/${encodeURIComponent(userType)}` : null;

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await checkUserIsLogin();

        if (!isMounted) return;

        setUser(
          response?.isLoggedIn === true && response?.user
            ? response.user
            : null,
        );
      } catch (error) {
        if (isMounted) {
          console.error("Unable to check authentication:", error);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthChange = useCallback((authenticatedUser) => {
    setUser(authenticatedUser || null);
  }, []);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070a0e] text-sm text-slate-400">
        Checking login status...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a0e] text-white">
      {user && <Navbar userData={user} />}

      <IsAuthenticate
        isAuthenticated={Boolean(user)}
        onAuthChange={handleAuthChange}
      />

      {user && (
        <Routes>
          {/* Root route */}
          <Route
            path="/"
            element={
              isAdmin ? (
                <DashboardPage />
              ) : userPath ? (
                <Navigate to={userPath} replace />
              ) : (
                <PageNotFound />
              )
            }
          />

          {/* Admin panel */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminPanel /> : <PageNotFound />}
          />

          {/* Regular user routes */}
          {!isAdmin && userType && (
            <>
              <Route path={userPath} element={<ConsumptionData />} />

              <Route
                path={`${userPath}/current-load`}
                element={<CurrentLoadPage />}
              />

              <Route path={`${userPath}/list`} element={<ReportPage />} />

              <Route
                path={`${userPath}/:department/list`}
                element={<PerDepartmentPage />}
              />

              <Route
                path={`${userPath}/todays-consumption`}
                element={<TodaysConsumption />}
              />

              <Route
                path={`${userPath}/:department`}
                element={<PerDepartmentPage />}
              />
            </>
          )}

          {/* Admin division routes */}
          {isAdmin && (
            <Route path="/:divisionName">
              <Route index element={<ConsumptionData />} />

              <Route path="current-load" element={<CurrentLoadPage />} />

              <Route path="list" element={<ReportPage />} />

              <Route path=":department/list" element={<PerDepartmentPage />} />

              <Route path=":department" element={<PerDepartmentPage />} />

              <Route
                path="todays-consumption"
                element={<TodaysConsumption />}
              />
            </Route>
          )}

          {/* Unknown routes */}
          <Route
            path="*"
            element={
              isAdmin ? (
                <PageNotFound />
              ) : userPath ? (
                <Navigate to={userPath} replace />
              ) : (
                <PageNotFound />
              )
            }
          />
        </Routes>
      )}
    </main>
  );
}

export default App;
