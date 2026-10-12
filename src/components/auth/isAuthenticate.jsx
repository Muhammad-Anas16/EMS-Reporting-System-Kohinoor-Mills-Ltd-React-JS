import React, { useEffect, useState } from "react";
import LoginDialog from "./LoginDialog";
import { checkUserIsLogin, LoginUser } from "@/api/api";

const IsAuthenticate = () => {
  const [isUser, setIsUser] = useState(false);
  useEffect(() => {
    const res = async () => {
      const abc = await checkUserIsLogin();
      console.log();
      setIsUser(abc?.isLoggedIn);
    };
    res();
  }, [isUser]);

  const handleLogin = async ({ username, password }) => {
    const res = await LoginUser(username, password);

    if (!res?.success) {
      throw new Error(result.message || "Invalid email or password.");
    }

    console.log("Login successful", res?.data);
  };

  return <LoginDialog onLogin={handleLogin} islogin={isUser} />;
};

export default IsAuthenticate;
