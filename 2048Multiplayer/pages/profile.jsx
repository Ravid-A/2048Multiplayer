import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import GetUser from "../utilities/GetUser";
import GetAPIUrl from "../utilities/GetAPIUrl";

import Profile from "../components/User/Profile";

export default function ProfilePage() {
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

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const update = await response.json();
      if (update.data.error) {
        setUser({ ...user, msg: update.data.message });
        return;
      }

      router.reload();
    } catch (error) {
      console.error("Error during update:", error);
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
        <Profile
          handleSubmit={handleSubmit}
          user={user}
          setUser={setUser}
          loading={loading}
        />
      )}
    </>
  );
}
