import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Matchmaking from "../components/Matchmaking";

import GetUser from "../utilities/GetUser";

const MatchmakingPage = () => {
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

  return <Matchmaking user={user} />;
};

export default MatchmakingPage;
