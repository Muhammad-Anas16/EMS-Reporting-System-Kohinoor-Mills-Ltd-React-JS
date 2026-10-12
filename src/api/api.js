// import axios from "axios";

// const ServerIP = "http://192.168.1.57:3000/api";

// export const getTrendLog = async () => {
//   try {
//     const res = await axios.get(`${ServerIP}/data/trendlog`);

//     return res?.data?.data?.response;
//   } catch (error) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Authentication failed",
//     };
//   }
// };

// export const getEnergyLog = async () => {
//   try {
//     const res = await axios.get(`${ServerIP}/data/energylog`);

//     return res?.data?.data?.response;
//   } catch (error) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Authentication failed",
//     };
//   }
// };

// export const bacnetRead = async (instances) => {
//   try {
//     const res = await axios.post(`${ServerIP}/bacnet/read`, {
//       instances,
//     });

//     return res.data?.data;
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error?.response?.data?.message ||
//         error?.message ||
//         "BACnet read failed",
//     };
//   }
// };

// export const LoginUser = async (username, password) => {
//   try {
//     const res = await axios.post(
//       `${ServerIP}/auth/login`,
//       {
//         username,
//         password,
//       },
//       { withCredentials: true },
//     );
//     const csrfToken = res?.data?.data?.csrfToken;

//     console.log("csrToken in API : ", csrfToken);

//     if (res.data?.success) {
//       console.log(res.data?.success);
//       sessionStorage.setItem("csrfToken", csrfToken);
//       axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
//       return res.data;
//     }

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error.response?.data?.message || "Login failed. Please try again.",
//     };
//   }
// };

// export const checkUserIsLogin = async () => {
//   try {
//     const res = await axios.get(`${ServerIP}/auth/me`, {
//       withCredentials: true,
//     });

//     console.log("AUTH ME RESPONSE:", res.data);

//     const data = res.data?.data ?? res.data;
//     const user = data?.user ?? (
//       data?.username ? data : null
//     );

//     if (user) {
//       console.log("LOGIN STATUS: User is logged in", user);

//       if (data?.csrfToken) {
//         sessionStorage.setItem("csrfToken", data.csrfToken);
//         axios.defaults.headers.common["X-CSRF-Token"] =
//           data.csrfToken;
//       }

//       return {
//         success: true,
//         isLoggedIn: true,
//         user,
//       };
//     }

//     return {
//       success: false,
//       isLoggedIn: false,
//       user: null,
//     };
//   } catch (error) {
//     console.error(
//       "AUTH ME ERROR:",
//       error.response?.status,
//       error.response?.data || error.message
//     );

//     return {
//       success: false,
//       isLoggedIn: false,
//       user: null,
//       message:
//         error.response?.data?.message ||
//         "Unable to verify login session.",
//     };
//   }
// };

// export const CreateUser = async (username, password, type = "user") => {
//   try {
//     const res = await axios.post(
//       `${ServerIP}/admin/users`,
//       {
//         username,
//         password,
//         type,
//       },
//       {
//         withCredentials: true,
//         headers: {
//           "X-CSRF-Token": sessionStorage.getItem("csrfToken"),
//         },
//       },
//     );

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error.response?.data?.message || "User create karne mein error aaya.",
//     };
//   }
// };

// export const UpdateAdminSettings = async (settingsData) => {
//   try {
//     const res = await axios.put(`${ServerIP}/admin/settings`, settingsData, {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRF-Token": sessionStorage.getItem("csrfToken"),
//       },
//     });

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error.response?.data?.message ||
//         "Admin settings save karne mein error aaya.",
//     };
//   }
// };

import axios from "axios";

// Vite proxy: /api -> http://localhost:3000
const ServerIP = "/api";

const api = axios.create({
  baseURL: ServerIP,
  withCredentials: true,
});

const getCsrfToken = () => sessionStorage.getItem("csrfToken");

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Trend Log
export const getTrendLog = async () => {
  try {
    const res = await api.get("/data/trendlog");
    return res?.data?.data?.response;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Trend log fetch failed"),
    };
  }
};

// Energy Log
export const getEnergyLog = async () => {
  try {
    const res = await api.get("/data/energylog");
    return res?.data?.data?.response;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Energy log fetch failed"),
    };
  }
};

// BACnet Read
export const bacnetRead = async (instances) => {
  try {
    const res = await api.post("/bacnet/read", { instances });
    return res.data?.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "BACnet read failed"),
    };
  }
};

// Login
export const LoginUser = async (username, password) => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
    });

    const data = res.data?.data ?? res.data;
    const csrfToken = data?.csrfToken;

    if (res.data?.success && csrfToken) {
      sessionStorage.setItem("csrfToken", csrfToken);
      api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    }

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Login failed. Please try again."),
    };
  }
};

// Check Current Login Session
export const checkUserIsLogin = async () => {
  try {
    const res = await api.get("/auth/me");

    const data = res.data?.data ?? res.data;
    const user = data?.user ?? (data?.username ? data : null);

    if (user) {
      if (data?.csrfToken) {
        sessionStorage.setItem("csrfToken", data.csrfToken);
        api.defaults.headers.common["X-CSRF-Token"] = data.csrfToken;
      }

      return {
        success: true,
        isLoggedIn: true,
        user,
      };
    }

    return {
      success: false,
      isLoggedIn: false,
      user: null,
    };
  } catch (error) {
    return {
      success: false,
      isLoggedIn: false,
      user: null,
      message: getErrorMessage(error, "Unable to verify login session."),
    };
  }
};

// Create User (Admin)
export const CreateUser = async (username, password, type = "user") => {
  try {
    const res = await api.post(
      "/admin/users",
      { username, password, type },
      {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
        },
      },
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "User create karne mein error aaya."),
    };
  }
};

// Update Admin Settings
export const UpdateAdminSettings = async (settingsData) => {
  try {
    const res = await api.put("/admin/settings", settingsData, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Admin settings save karne mein error aaya.",
      ),
    };
  }
};

export default api;
