import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import styles from "../styles/MainMenu.module.css";

import GetUser from "../utilities/GetUser";

import MenuUser from "./User/MenuUser";
import NoConnectedPopUP from "./NotConnectedPopUP";

export default function MainMenu() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [popUp, setPopUp] = useState(false);

  const getUser = async () => {
    const user = await GetUser();
    setUser(user);
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
        else setPopUp(true);
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
            disabled={popUp}
          >
            Classic 2048
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="multiplayer"
            disabled={popUp}
          >
            Multiplayer
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="speedrun"
            disabled={popUp}
          >
            Speedrun
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="private"
            disabled={popUp}
          >
            Private Lobby
          </button>
        </div>
        {popUp && <NoConnectedPopUP setPopUp={setPopUp} />}
      </div>
    </>
  );
}
