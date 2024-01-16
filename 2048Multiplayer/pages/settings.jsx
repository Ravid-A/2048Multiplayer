import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import GetUser from "../utilities/GetUser";
import GetAPIUrl from "../utilities/GetAPIUrl";

import Settings from "../components/User/Settings";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const user_data = await GetUser();

    if (!user_data) {
      router.push("/");
      return;
    }

    setUser({
      placeholder: {
        username: user_data.username,
        email: user_data.email,
      },
      username: "",
      email: "",
      msg: "",
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const url = GetAPIUrl() + "/users/update";
      const data = {
        username: user.username,
        email: user.email,
      };

      if (!token) {
        router.push("/");
      }

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const update = await response.data;
      if (update.error) {
        setUser({ ...user, msg: update.message });
        return;
      }

      getUser();
      setUser(null);
    } catch (error) {
      if (!error.response) {
        setUser({
          ...user,
          msg: `Internal Server Error: ${error.message}`,
        });
        return;
      }

      setUser({
        ...user,
        msg: `Internal Server Error: ${error.response.data.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!user.username && !user.email) {
      return;
    }

    handleUpdate();
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {user && (
        <Settings
          handleSubmit={handleSubmit}
          user={user}
          setUser={setUser}
          loading={loading}
        />
      )}
    </>
  );
}
