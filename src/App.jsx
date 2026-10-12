// import "./App.css";

// import Navbar from "./components/Navbar";
// import DashboardPage from "./page/dashboard";
// import { Route, Routes } from "react-router";
// import ConsumptionData from "./page/consuptionData";
// import ReportPage from "./page/reportPage";
// import PerDepartmentPage from "./page/perDepartmentPage";
// import IsAuthenticate from "./components/auth/isAuthenticate";
// import AdminPanel from "./page/AdminPanel";
// import { useEffect, useState } from "react";
// import { checkUserIsLogin } from "./api/api";

// function App() {
//   const [role, setRole] = useState("user");
//   useEffect(() => {
//     const userdata = async () => {
//       try {
//         const data = await checkUserIsLogin();
//         setRole(data?.user);
//       } catch (error) {
//         console.log(error.message || "Interval Server Error");
//       }
//     };

//     userdata();
//   }, []);
//   if (role?.role === "admin") {
//     console.log("Data on App.jsx : ", role?.username);
//   }

//   return (
//     <main className="min-h-screen bg-[#070a0e] text-white">
//       <Navbar userData={role} />
//       <IsAuthenticate />

//       <Routes>
//         <Route path="/" element={<DashboardPage />} />
//         <Route path="/admin" element={<AdminPanel />} />

//         <Route path="/:divisionName">
//           {/* /dyeing */}
//           <Route index element={<ConsumptionData />} />

//           {/* /dyeing/list */}
//           <Route path="list" element={<ReportPage />} />

//           {/* /dyeing/Finishing */}
//           <Route path=":department" element={<PerDepartmentPage />} />

//           {/* /dyeing/Finishing/list */}
//           <Route path=":department/list" element={<PerDepartmentPage />} />
//         </Route>
//       </Routes>
//     </main>
//   );
// }

// export default App;

// =========================================
// =========================================
// =========================================

// import "./App.css";

// import { useCallback, useEffect, useState } from "react";
// import { Navigate, Route, Routes } from "react-router";

// import Navbar from "./components/Navbar";
// import DashboardPage from "./page/dashboard";
// import ConsumptionData from "./page/consuptionData";
// import ReportPage from "./page/reportPage";
// import PerDepartmentPage from "./page/perDepartmentPage";
// import IsAuthenticate from "./components/auth/isAuthenticate";
// import AdminPanel from "./page/AdminPanel";
// import { checkUserIsLogin } from "./api/api";

// const PageNotFound = () => (
//   <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
//     <h1 className="text-4xl font-bold text-white">404</h1>
//     <p className="mt-3 text-slate-400">Page not found.</p>
//   </div>
// );

// function App() {
//   const [user, setUser] = useState(null);
//   const [isChecking, setIsChecking] = useState(true);

//   const isAdmin =
//     String(user?.role ?? user?.type ?? "").toLowerCase() === "admin";

//   const checkLogin = useCallback(async () => {
//     try {
//       const response = await checkUserIsLogin();

//       console.log("Authentication response:", response);

//       if (response?.isLoggedIn === true && response?.user) {
//         setUser(response.user);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Unable to check login status:", error);
//       setUser(null);
//     } finally {
//       setIsChecking(false);
//     }
//   }, []);

//   useEffect(() => {
//     checkLogin();
//   }, [checkLogin]);

//   // Called when IsAuthenticate confirms a successful login.
//   const handleAuthChange = (authenticatedUser) => {
//     if (authenticatedUser) {
//       setUser(authenticatedUser);
//     } else {
//       setUser(null);
//     }
//   };

//   if (isChecking) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-[#070a0e] text-white">
//         Checking login status...
//       </main>
//     );
//   }

//   const username = String(user?.username ?? "").trim();

//   return (
//     <main className="min-h-screen bg-[#070a0e] text-white">
//       {user && <Navbar userData={user} />}

//       <IsAuthenticate onAuthChange={handleAuthChange} />

//       {user && (
//         <Routes>
//           {/* Admin home page */}
//           <Route
//             path="/"
//             element={
//               isAdmin ? (
//                 <DashboardPage />
//               ) : (
//                 <Navigate
//                   to={username ? `/${encodeURIComponent(username)}` : "/login"}
//                   replace
//                 />
//               )
//             }
//           />

//           {/* Only admins can open the admin panel */}
//           <Route
//             path="/admin"
//             element={isAdmin ? <AdminPanel /> : <PageNotFound />}
//           />

//           {/* Normal users can only open their own username URL */}
//           {!isAdmin && username && (
//             <>
//               <Route
//                 path={`/${encodeURIComponent(username)}`}
//                 element={<ConsumptionData />}
//               />

//               <Route
//                 path={`/${encodeURIComponent(username)}/list`}
//                 element={<ReportPage />}
//               />

//               <Route
//                 path={`/${encodeURIComponent(username)}/:department`}
//                 element={<PerDepartmentPage />}
//               />

//               <Route
//                 path={`/${encodeURIComponent(username)}/:department/list`}
//                 element={<PerDepartmentPage />}
//               />
//             </>
//           )}

//           {/* Admin department routes */}
//           {isAdmin && (
//             <Route path="/:divisionName">
//               <Route index element={<ConsumptionData />} />
//               <Route path="list" element={<ReportPage />} />
//               <Route path=":department" element={<PerDepartmentPage />} />
//               <Route
//                 path=":department/list"
//                 element={<PerDepartmentPage />}
//               />
//             </Route>
//           )}

//           {/* Any unknown URL */}
//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       )}
//     </main>
//   );
// }

// export default App;

// =============================================
// =============================================
// =============================================

import "./App.css";

import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";

import Navbar from "./components/Navbar";
import DashboardPage from "./page/dashboard";
import ConsumptionData from "./page/consuptionData";
import ReportPage from "./page/reportPage";
import PerDepartmentPage from "./page/perDepartmentPage";
import IsAuthenticate from "./components/auth/isAuthenticate";
import AdminPanel from "./page/AdminPanel";
import { checkUserIsLogin } from "./api/api";

const PageNotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <h1 className="text-4xl font-bold text-white">404</h1>
    <p className="mt-3 text-slate-400">Page not found.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Admin detection
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

  // Normal user's allowed division
  const userType = String(user?.type ?? "")
    .trim()
    .toLowerCase();

  const userPath = userType ? `/${encodeURIComponent(userType)}` : null;

  // Check login status
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await checkUserIsLogin();

        if (!isMounted) return;

        if (response?.isLoggedIn === true && response?.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Unable to check authentication:", error);

        if (isMounted) {
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

  // Update user after login/logout
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
          {/* Home route */}
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

          {/* Admin panel: admin only */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminPanel /> : <PageNotFound />}
          />

          {/* Normal user: own division only */}
          {!isAdmin && userType && (
            <>
              <Route path={userPath} element={<ConsumptionData />} />

              <Route path={`${userPath}/list`} element={<ReportPage />} />

              <Route
                path={`${userPath}/:department`}
                element={<PerDepartmentPage />}
              />

              <Route
                path={`${userPath}/:department/list`}
                element={<PerDepartmentPage />}
              />
            </>
          )}

          {/* Admin can access all division routes */}
          {isAdmin && (
            <Route path="/:divisionName">
              <Route index element={<ConsumptionData />} />

              <Route path="list" element={<ReportPage />} />

              <Route path=":department" element={<PerDepartmentPage />} />

              <Route path=":department/list" element={<PerDepartmentPage />} />
            </Route>
          )}

          {/* Block every URL that is not allowed */}
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
