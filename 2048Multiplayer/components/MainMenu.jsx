import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import styles from "../styles/MainMenu.module.css";

import GetUser from "../utilities/GetUser";

import MenuUser from "./User/MenuUser";
import NoConnectedPopUP from "./NotConnectedPopUP";

export default function MainMenu() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [popUp, setPopUp] = useState("none");

  const getUser = async () => {
    setPopUp("getting_user");
    const user = await GetUser();

    if (!user) {
      setPopUp("none");
      return;
    }

    setUser(user);
    setPopUp("none");
  };

  useEffect(() => {
    getUser();
  }, []);

  const onClick = (event) => {
    const page = event.target.value;

    // alert("Coming soon! " + page + " mode");
    // return;

    switch (page) {
      case "classic":
        router.push("/classic");
        break;
      default:
        if (user) router.push("/" + page);
        else setPopUp("not_connected");
        break;
    }
  };

  return (
    <>
      <div className={styles.MainMenu}>
        <MenuUser user={user} popUp={popUp} />
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <div className={styles.Menu}>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="classic"
            disabled={popUp != "none"}
          >
            Classic 2048
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="multiplayer"
            disabled={popUp != "none"}
          >
            Multiplayer
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="speedrun"
            disabled={popUp != "none"}
          >
            Speedrun
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="private"
            disabled={popUp != "none"}
          >
            Private Lobby
          </button>
        </div>
        {popUp == "not_connected" && <NoConnectedPopUP setPopUp={setPopUp} />}
      </div>
    </>
  );
}
