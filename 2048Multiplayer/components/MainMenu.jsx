import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import styles from "../styles/MainMenu.module.css";

import GetUser from "../utilities/GetUser";

import MenuUser from "./User/MenuUser";

export default function MainMenu() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const getUser = async () => {
    const user = await GetUser();
    console.log(user);
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  const onClick = (event) => {
    router.push("/" + event.target.value);
  };

  return (
    <>
      <div className={styles.MainMenu}>
        <MenuUser user={user} />
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <div className={styles.Menu}>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="classic"
          >
            Classic 2048
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="multiplayer"
          >
            Multiplayer
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="speedrun"
          >
            Speedrun
          </button>
          <button
            className={styles.MenuButton}
            onClick={onClick}
            value="private"
          >
            Private Lobby
          </button>
        </div>
      </div>
    </>
  );
}
