import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PrivateLobby from "../components/PrivateLobby";

import GetUser from "../utilities/GetUser";

const PrivateLobbyPage = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const getUser = async () => {
    const user = await GetUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return <PrivateLobby user={user} />;
};

export default PrivateLobbyPage;
