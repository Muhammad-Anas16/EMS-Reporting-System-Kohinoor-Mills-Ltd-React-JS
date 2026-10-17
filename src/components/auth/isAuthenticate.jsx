import LoginDialog from "./LoginDialog";
import { LoginUser, checkUserIsLogin } from "@/api/api";

const extractUser = (payload) => {
  const candidates = [
    payload?.user,
    payload?.data?.user,
    payload?.data?.data?.user,
    payload?.data?.data,
    payload?.data,
    payload,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (candidate.username ||
        candidate._id ||
        candidate.id ||
        candidate.type ||
        candidate.role)
    ) {
      return candidate;
    }
  }

  return null;
};

const IsAuthenticate = ({ isAuthenticated, onAuthChange }) => {
  const handleLogin = async ({ username, password }) => {
    const normalizedUsername = String(username ?? "").trim();

    if (!normalizedUsername || !password) {
      return {
        success: false,
        message: "Username and password are required.",
      };
    }

    try {
      const loginResponse = await LoginUser(normalizedUsername, password);

      if (loginResponse?.success !== true) {
        return {
          success: false,
          message:
            loginResponse?.message ||
            loginResponse?.data?.message ||
            "Invalid username or password.",
        };
      }

      let authenticatedUser = extractUser(loginResponse);

      // Some login APIs return success without the user profile.
      // Verify the session rather than inventing a role or division.
      if (!authenticatedUser) {
        const sessionResponse = await checkUserIsLogin();

        if (sessionResponse?.success === false) {
          return {
            success: false,
            message:
              sessionResponse?.message ||
              "Login succeeded, but the user session could not be verified.",
          };
        }

        authenticatedUser = extractUser(sessionResponse);
      }

      if (!authenticatedUser) {
        return {
          success: false,
          message:
            "Login succeeded, but the user profile is missing. Check the login and /auth/me API responses.",
        };
      }

      // Update App.jsx without reloading the page.
      onAuthChange?.(authenticatedUser);

      return {
        success: true,
        data: loginResponse?.data ?? loginResponse,
      };
    } catch (error) {
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
