// import axios from "axios";

// const ServerIP = "/api";

// const api = axios.create({
//   baseURL: ServerIP,
//   withCredentials: true,
// });

// const getCsrfToken = () => sessionStorage.getItem("csrfToken");

// const getErrorMessage = (error, fallback) =>
//   error?.response?.data?.message || error?.message || fallback;

// // Trend Log
// export const getTrendLog = async () => {
//   try {
//     const res = await api.get("/data/trendlog");
//     return res?.data?.data?.response;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "Trend log fetch failed"),
//     };
//   }
// };

// // Energy Log
// export const getEnergyLog = async () => {
//   try {
//     const res = await api.get("/data/energylog");
//     return res?.data?.data?.response;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "Energy log fetch failed"),
//     };
//   }
// };

// // BACnet Read
// export const bacnetRead = async (instances) => {
//   try {
//     const res = await api.post("/bacnet/read", { instances });
//     return res.data?.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "BACnet read failed"),
//     };
//   }
// };

// // Login
// export const LoginUser = async (username, password) => {
//   try {
//     const res = await api.post("/auth/login", {
//       username,
//       password,
//     });

//     const data = res.data?.data ?? res.data;
//     const csrfToken = data?.csrfToken;

//     if (res.data?.success && csrfToken) {
//       sessionStorage.setItem("csrfToken", csrfToken);
//       api.defaults.headers.common["X-CSRF-Token"] = csrfToken;
//     }

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "Login failed. Please try again."),
//     };
//   }
// };

// // Check Current Login Session
// export const checkUserIsLogin = async () => {
//   try {
//     const res = await api.get("/auth/me");

//     const data = res.data?.data ?? res.data;
//     const user = data?.user ?? (data?.username ? data : null);

//     if (user) {
//       if (data?.csrfToken) {
//         sessionStorage.setItem("csrfToken", data.csrfToken);
//         api.defaults.headers.common["X-CSRF-Token"] = data.csrfToken;
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
//     return {
//       success: false,
//       isLoggedIn: false,
//       user: null,
//       message: getErrorMessage(error, "Unable to verify login session."),
//     };
//   }
// };

// // logout user
// export const LogoutUser = async () => {
//   const response = await api.post("/auth/logout");
//   return response.data;
// };

// // Create User (Admin)
// export const CreateUser = async (username, password, type) => {
//   try {
//     console.log(`username : ${username} password : ${password} type : ${type}`);
//     const token = getCsrfToken();
//     console.log(token);
//     const res = await api.post(
//       "/admin/users",
//       { username, password, type },
//       {
//         headers: {
//           "X-CSRF-Token": token,
//         },
//       },
//     );

//     console.log("API : ", sessionStorage.getItem("csrfToken"));

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "User create karne mein error aaya."),
//     };
//   }
// };

// // get all the users
// export const GetAllUser = async () => {
//   try {
//     const token = getCsrfToken();
//     const res = await api.get("/admin/users", {
//       headers: {
//         "X-CSRF-Token": token,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "User create karne mein error aaya."),
//     };
//   }
// };

// // Update Admin Settings
// export const UpdateAdminSettings = async (settingsData) => {
//   try {
//     const res = await api.put("/admin/settings", settingsData, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRF-Token": getCsrfToken(),
//       },
//     });

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(
//         error,
//         "Admin settings save karne mein error aaya.",
//       ),
//     };
//   }
// };

// // update project configurations
// export const ProjectConfiguration = async (
//   ipAddress,
//   ipPassword,
//   deviceId,
//   targetPort,
//   corsOrigin,
// ) => {
//   try {
//     console.log(
//       `ipAddress : ${ipAddress} ipPassword : ${ipPassword} deviceId : ${deviceId} targetPort : ${targetPort} corsOrigin : ${corsOrigin}`,
//     );
//     const token = getCsrfToken();
//     console.log(token);
//     const res = await api.post(
//       "/admin/users",
//       {
//         ipAddress: ipAddress || "192.168.1.20",
//         ipPassword,
//         deviceId,
//         targetPort: targetPort || "47808",
//         corsOrigin: corsOrigin || "http://localhost:5173",
//       },
//       {
//         headers: {
//           "X-CSRF-Token": token,
//         },
//       },
//     );

//     console.log("API : ", sessionStorage.getItem("csrfToken"));

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "User create karne mein error aaya."),
//     };
//   }
// };

// // Get current server configuration
// export const getProjectConfiguration = async () => {
//   try {
//     const res = await api.get("/admin/settings");
//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(
//         error,
//         "Server settings load nahi ho sakin."
//       ),
//     };
//   }
// };

// // Create initial server configuration
// export const createProjectConfiguration = async (settings) => {
//   try {
//     const token = getCsrfToken();

//     const res = await api.post(
//       "/admin/settings",
//       settings,
//       {
//         headers: {
//           "X-CSRF-Token": token,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(
//         error,
//         "Server configuration create nahi ho saki."
//       ),
//     };
//   }
// };

// // Update existing server configuration
// export const updateProjectConfiguration = async (settings) => {
//   try {
//     const token = getCsrfToken();

//     const res = await api.put(
//       "/admin/settings",
//       settings,
//       {
//         headers: {
//           "X-CSRF-Token": token,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(
//         error,
//         "Server settings update nahi ho sakin."
//       ),
//     };
//   }
// };

// // Delete server connection configuration
// export const deleteProjectConfiguration = async () => {
//   try {
//     const token = getCsrfToken();

//     const res = await api.delete(
//       "/admin/settings",
//       {
//         headers: {
//           "X-CSRF-Token": token,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: getErrorMessage(
//         error,
//         "Server configuration delete nahi ho saki."
//       ),
//     };
//   }
// };

// export default api;

import axios from "axios";

const API_BASE_URL = "/api";
const CSRF_STORAGE_KEY = "csrfToken";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// Helpers
// =========================================================

const getCsrfToken = () => {
  try {
    return sessionStorage.getItem(CSRF_STORAGE_KEY);
  } catch {
    return null;
  }
};

const setCsrfToken = (token) => {
  if (!token) return;

  try {
    sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    api.defaults.headers.common["X-CSRF-Token"] = token;
  } catch {
    // Session storage unavailable; request interceptor
    // will still use the in-memory default header if set.
    api.defaults.headers.common["X-CSRF-Token"] = token;
  }
};

const clearCsrfToken = () => {
  try {
    sessionStorage.removeItem(CSRF_STORAGE_KEY);
  } catch {
    // Ignore unavailable session storage.
  }

  delete api.defaults.headers.common["X-CSRF-Token"];
};

const getErrorMessage = (error, fallback = "Request failed.") => {
  if (error?.response?.status === 403) {
    return (
      error?.response?.data?.message ||
      "Request forbidden. Session ya CSRF token check karein."
    );
  }

  if (error?.response?.status === 401) {
    return (
      error?.response?.data?.message ||
      "Session expire ho gaya hai. Dobara login karein."
    );
  }

  return error?.response?.data?.message || error?.message || fallback;
};

const getResponseData = (response) => response?.data;

const getApiError = (error, fallback) => ({
  success: false,
  message: getErrorMessage(error, fallback),
});

// Automatically attach CSRF token to write requests.
// GET/HEAD/OPTIONS requests do not need this header.
api.interceptors.request.use(
  (config) => {
    const method = (config.method || "get").toLowerCase();
    const safeMethods = ["get", "head", "options"];

    if (!safeMethods.includes(method)) {
      const token = getCsrfToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers["X-CSRF-Token"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =========================================================
// Trend Log
// =========================================================

export const getTrendLog = async () => {
  try {
    const response = await api.get("/data/trendlog");

    return (
      response.data?.data?.response ?? response.data?.data ?? response.data
    );
  } catch (error) {
    return getApiError(error, "Trend log fetch failed.");
  }
};

// =========================================================
// Energy Log
// =========================================================

export const getEnergyLog = async () => {
  try {
    const response = await api.get("/data/energylog");

    return (
      response.data?.data?.response ?? response.data?.data ?? response.data
    );
  } catch (error) {
    return getApiError(error, "Energy log fetch failed.");
  }
};

// =========================================================
// BACnet Read
// =========================================================

export const bacnetRead = async (instances) => {
  try {
    if (!Array.isArray(instances) || instances.length === 0) {
      return {
        success: false,
        message: "Valid BACnet instances provide karein.",
      };
    }

    const response = await api.post("/bacnet/read", {
      instances,
    });

    return getResponseData(response)?.data ?? getResponseData(response);
  } catch (error) {
    return getApiError(error, "BACnet read failed.");
  }
};

// =========================================================
// Login
// =========================================================

export const LoginUser = async (username, password) => {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    const result = response.data;
    const data = result?.data ?? result;
    const csrfToken = data?.csrfToken;

    if (result?.success && csrfToken) {
      setCsrfToken(csrfToken);
    }

    return result;
  } catch (error) {
    return getApiError(error, "Login failed. Please try again.");
  }
};

// =========================================================
// Check Current Login Session
// =========================================================

export const checkUserIsLogin = async () => {
  try {
    const response = await api.get("/auth/me");

    const result = response.data;
    const data = result?.data ?? result;
    const user = data?.user ?? (data?.username ? data : null);

    if (!user) {
      return {
        success: false,
        isLoggedIn: false,
        user: null,
      };
    }

    if (data?.csrfToken) {
      setCsrfToken(data.csrfToken);
    }

    return {
      success: true,
      isLoggedIn: true,
      user,
    };
  } catch (error) {
    if (error?.response?.status === 401) {
      clearCsrfToken();
    }

    return {
      success: false,
      isLoggedIn: false,
      user: null,
      message: getErrorMessage(error, "Unable to verify login session."),
    };
  }
};

// =========================================================
// Logout
// =========================================================

export const LogoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");

    clearCsrfToken();

    return response.data;
  } catch (error) {
    // Keep the token if logout failed; the server session
    // may still be active. Clear it after successful logout.
    return getApiError(error, "Logout failed.");
  }
};

// =========================================================
// Create User (Admin)
// =========================================================

export const CreateUser = async (username, password, type) => {
  try {
    const response = await api.post("/admin/users", {
      username,
      password,
      type,
    });

    return response.data;
  } catch (error) {
    return getApiError(error, "User create karne mein error aaya.");
  }
};

// =========================================================
// Get All Users
// =========================================================

export const GetAllUser = async () => {
  try {
    const response = await api.get("/admin/users");

    return response.data;
  } catch (error) {
    return getApiError(error, "Users load nahi ho sake.");
  }
};

// =========================================================
// Update Admin Settings
// =========================================================

export const UpdateAdminSettings = async (settingsData) => {
  try {
    const response = await api.put("/admin/settings", settingsData);

    return response.data;
  } catch (error) {
    return getApiError(error, "Admin settings save karne mein error aaya.");
  }
};

// =========================================================
// Project Configuration
// =========================================================

// Compatibility helper for existing components.
// Uses /admin/settings rather than /admin/users.
// Backend settings schema must accept these field names.
export const ProjectConfiguration = async (
  ipAddress,
  ipPassword,
  deviceId,
  targetPort,
  corsOrigin,
) => {
  try {
    const settings = {
      ipAddress,
      ipPassword,
      deviceId,
      targetPort: targetPort || 47808,
      corsOrigin,
    };

    const response = await api.put("/admin/settings", settings);

    return response.data;
  } catch (error) {
    return getApiError(error, "Project configuration update nahi ho saki.");
  }
};

// =========================================================
// Get Current Server Configuration
// =========================================================

export const getProjectConfiguration = async () => {
  try {
    const response = await api.get("/admin/settings");

    return response.data;
  } catch (error) {
    return getApiError(error, "Server settings load nahi ho sakin.");
  }
};

// =========================================================
// Create Initial Server Configuration
// =========================================================

export const createProjectConfiguration = async (settings) => {
  try {
    const response = await api.post("/admin/settings", settings);

    return response.data;
  } catch (error) {
    return getApiError(error, "Server configuration create nahi ho saki.");
  }
};

// =========================================================
// Update Existing Server Configuration
// =========================================================

export const updateProjectConfiguration = async (settings) => {
  try {
    const response = await api.put("/admin/settings", settings);

    return response.data;
  } catch (error) {
    return getApiError(error, "Server settings update nahi ho sakin.");
  }
};

// =========================================================
// Delete Server Configuration
// =========================================================

export const deleteProjectConfiguration = async () => {
  try {
    const response = await api.delete("/admin/settings");

    return response.data;
  } catch (error) {
    return getApiError(error, "Server configuration delete nahi ho saki.");
  }
};

export default api;
