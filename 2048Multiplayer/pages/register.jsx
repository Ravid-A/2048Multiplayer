import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CheckUser from "../utilities/CheckUser";
import GetAPIUrl from "../utilities/GetAPIUrl";

import RegisterForm from "../components/RegisterForm";

export default function Register() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    msg: "",
  });
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
    if (
      !user.username ||
      !user.email ||
      !user.password ||
      !user.confirm_password
    ) {
      setUser({ ...user, msg: "Please fill all the fields" });
      return;
    }

    if (user.password.length < 8) {
      setUser({ ...user, msg: "Password must be at least 8 characters" });
      return;
    }

    if (user.password.match(/[A-Z]/) == null) {
      setUser({ ...user, msg: "Password must contain at least 1 uppercase" });
      return;
    }

    if (
      user.password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) == null
    ) {
      setUser({ ...user, msg: "Password must contain at least 1 symbol" });
      return;
    }

    if (user.password !== user.confirm_password) {
      setUser({ ...user, msg: "Passwords do not match" });
      return;
    }

    handleRegister();
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const url = GetAPIUrl() + "/users/register";

      const data = {
        username: user.username,
        email: user.email,
        password: user.password,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const register = await response.json();

      if (response.status === 200) {
        if (register.error) {
          setUser({ ...user, msg: register.message });
          return;
        }

        localStorage.setItem("token", register.token);
        router.push("/");
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RegisterForm
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