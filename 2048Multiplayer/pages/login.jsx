import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import LoginForm from "../components/LoginForm";
import CheckUser from "../utilities/CheckUser";
import GetAPIUrl from "../utilities/GetAPIUrl";

export default function Login() {
  const router = useRouter();

  const [user, setUser] = useState({ identifier: "", password: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleDisconnect = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  const checkUser = async () => {
    const isLoggedIn = await CheckUser();
    setLoggedIn(isLoggedIn);
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleSubmit = () => {
    if (!user.identifier || !user.password) {
      setUser({ ...user, msg: "Please fill all the fields" });
      return;
    }

    if (user.password.length < 8) {
      setUser({ ...user, msg: "Password must be at least 8 characters" });
      return;
    }

    handleLogin();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const url = GetAPIUrl() + "/users/login";
      const data = {
        identifier: user.identifier,
        password: user.password,
      };

      const response = await axios.post(url, data, {
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const login = await response.data;

      if (login.error) {
        setUser({ ...user, msg: login.message });
        return;
      }

      localStorage.setItem("token", login.token);
      router.push("/");
    } catch (error) {
      setUser({
        ...user,
        msg: `Internal Server Error: ${error.response.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginForm
        handleSubmit={handleSubmit}
        user={user}
        setUser={setUser}
        loggedIn={loggedIn}
        loading={loading}
        handleDisconnect={handleDisconnect}
      />
    </>
  );
}
