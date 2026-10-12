// import { useEffect, useState } from "react";
// import LoginDialog from "./LoginDialog";
// import { checkUserIsLogin, LoginUser } from "@/api/api";

// const IsAuthenticate = () => {
//   const [isUser, setIsUser] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const checkLoginStatus = async () => {
//       try {
//         const res = await checkUserIsLogin();

//         if (!isMounted) return;

//         // console.log("Login status response:", res);

//         setIsUser(res?.isLoggedIn === true);
//       } catch (error) {
//         console.error("Login status check failed:", error);

//         if (isMounted) {
//           setIsUser(false);
//         }
//       } finally {
//         if (isMounted) {
//           setIsChecking(false);
//         }
//       }
//     };

//     checkLoginStatus();

//     return () => {
//       isMounted = false;
//     };
//   }, [isUser]);

//   const handleLogin = async ({ username, password }) => {
//     try {
//       const res = await LoginUser(username.trim(), password);

//       console.log("Login API response:", res);

//       // LoginUser ke response mein success true hona zaroori hai.
//       if (res?.success !== true) {
//         return {
//           success: false,
//           message:
//             res?.message ||
//             res?.data?.message ||
//             "Invalid username or password.",
//         };
//       }

//       // Update UI after the API confirms successful login.
//       setIsUser(true);

//       return {
//         success: true,
//         data: res?.data,
//       };
//     } catch (error) {
//       console.error("Login failed:", error);

//       setIsUser(false);

//       return {
//         success: false,
//         message:
//           error?.response?.data?.message ||
//           error?.message ||
//           "Login failed. Please check your credentials and try again.",
//       };
//     }
//   };

//   if (isChecking) {
//     return (
//       <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
//         Checking login status...
//       </div>
//     );
//   }

//   return <LoginDialog onLogin={handleLogin} islogin={isUser} />;
// };

// export default IsAuthenticate;
import LoginDialog from "./LoginDialog";
import { LoginUser } from "@/api/api";

const IsAuthenticate = ({ isAuthenticated, onAuthChange }) => {
  const handleLogin = async ({ username, password }) => {
    try {
      const res = await LoginUser(username.trim(), password);

      console.log("Login API response:", res);

      if (res?.success !== true) {
        return {
          success: false,
          message:
            res?.message ||
            res?.data?.message ||
            "Invalid username or password.",
        };
      }

      const authenticatedUser = res?.user ??
        res?.data?.user ??
        res?.data?.data?.user ?? {
          username: username.trim(),
          type: username.trim(),
        };

      // Update App.jsx immediately; no page reload needed.
      onAuthChange?.(authenticatedUser);

      return {
        success: true,
        data: res?.data,
      };
    } catch (error) {
      console.error("Login failed:", error);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials and try again.",
      };
    }
  };

  return <LoginDialog onLogin={handleLogin} islogin={isAuthenticated} />;
};

export default IsAuthenticate;
