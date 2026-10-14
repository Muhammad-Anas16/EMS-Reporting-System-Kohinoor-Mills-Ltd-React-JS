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

// logout user
export const LogoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Create User (Admin)
export const CreateUser = async (username, password, type) => {
  try {
    console.log(`username : ${username} password : ${password} type : ${type}`);
    const token = getCsrfToken();
    console.log(token);
    const res = await api.post(
      "/admin/users",
      { username, password, type },
      {
        headers: {
          "X-CSRF-Token": token,
        },
      },
    );

    console.log("API : ", sessionStorage.getItem("csrfToken"));

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "User create karne mein error aaya."),
    };
  }
};

// get all the users
export const GetAllUser = async () => {
  try {
    const token = getCsrfToken();
    const res = await api.get("/admin/users", {
      headers: {
        "X-CSRF-Token": token,
      },
    });

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

// update project configurations
export const ProjectConfiguration = async (
  ipAddress,
  ipPassword,
  deviceId,
  targetPort,
  corsOrigin,
) => {
  try {
    console.log(
      `ipAddress : ${ipAddress} ipPassword : ${ipPassword} deviceId : ${deviceId} targetPort : ${targetPort} corsOrigin : ${corsOrigin}`,
    );
    const token = getCsrfToken();
    console.log(token);
    const res = await api.post(
      "/admin/users",
      {
        ipAddress: ipAddress || "192.168.1.20",
        ipPassword,
        deviceId,
        targetPort: targetPort || "47808",
        corsOrigin: corsOrigin || "http://localhost:5173",
      },
      {
        headers: {
          "X-CSRF-Token": token,
        },
      },
    );

    console.log("API : ", sessionStorage.getItem("csrfToken"));

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "User create karne mein error aaya."),
    };
  }
};

// Get current server configuration
export const getProjectConfiguration = async () => {
  try {
    const res = await api.get("/admin/settings");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Server settings load nahi ho sakin."
      ),
    };
  }
};

// Create initial server configuration
export const createProjectConfiguration = async (settings) => {
  try {
    const token = getCsrfToken();

    const res = await api.post(
      "/admin/settings",
      settings,
      {
        headers: {
          "X-CSRF-Token": token,
        },
      }
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Server configuration create nahi ho saki."
      ),
    };
  }
};

// Update existing server configuration
export const updateProjectConfiguration = async (settings) => {
  try {
    const token = getCsrfToken();

    const res = await api.put(
      "/admin/settings",
      settings,
      {
        headers: {
          "X-CSRF-Token": token,
        },
      }
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Server settings update nahi ho sakin."
      ),
    };
  }
};

// Delete server connection configuration
export const deleteProjectConfiguration = async () => {
  try {
    const token = getCsrfToken();

    const res = await api.delete(
      "/admin/settings",
      {
        headers: {
          "X-CSRF-Token": token,
        },
      }
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(
        error,
        "Server configuration delete nahi ho saki."
      ),
    };
  }
};


export default api;
