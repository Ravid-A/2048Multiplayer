import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import styles from "../styles/MainMenu.module.css";

import GetUser from "../utilities/GetUser";

import MenuUser from "./User/MenuUser";
import NoConnectedPopUP from "./PopUps/NotConnectedPopUP";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faUserGroup,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

export default function MainMenu() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [popUp, setPopUp] = useState("none");

  const getUser = async () => {
    setPopUp("getting_user");
    const user = await GetUser();

    if (!user) {
      setPopUp("none");
      router.push("/login");
      return;
    }

    setUser(user);
    setPopUp("none");
  };

  useEffect(() => {
    getUser();
  }, []);

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
            onClick={() => router.push("/classic")}
            disabled={popUp != "none"}
          >
            <div className={styles.SideIcon}>
              <FontAwesomeIcon icon={faPlay} />
            </div>
            <div className={styles.ButtonText}>Classic 2048</div>
          </button>
          <button
            className={styles.MenuButton}
            onClick={() => router.push("/matchmaking")}
            value="multiplayer"
            disabled={popUp != "none"}
          >
            <div className={styles.SideIcon}>
              <FontAwesomeIcon icon={faUserGroup} />
            </div>
            <div className={styles.ButtonText}>Multiplayer</div>
          </button>
          <button
            className={styles.MenuButton}
            onClick={() => router.push("/speedrun")}
            value="speedrun"
            disabled={popUp != "none"}
          >
            <div className={styles.SideIcon}>
              <FontAwesomeIcon icon={faStopwatch} />
            </div>
            <div className={styles.ButtonText}>Speedrun</div>
          </button>
          <button
            className={styles.MenuButton}
            onClick={() => router.push("/private")}
            value="private"
            disabled={popUp != "none"}
          >
            <div className={styles.SideIcon}>
              <FontAwesomeIcon icon={faUserGroup} />
            </div>
            <div className={styles.ButtonText}>Private Lobby</div>
          </button>
        </div>
        {popUp == "not_connected" && <NoConnectedPopUP setPopUp={setPopUp} />}
      </div>
    </>
  );
}
