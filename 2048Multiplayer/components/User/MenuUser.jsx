import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/User/MenuUser.module.css";

export default function MenuUser({ user, popUp }) {
  const router = useRouter();

  const handleLogin = () => {
    if (popUp) return;

    router.push("/login");
  };

  const handleClick = () => {
    if (popUp) return;

    router.push("/settings");
  };

  return (
    <>
      <div className={styles.User} onClick={user ? handleClick : handleLogin}>
        <div className={styles.UserIcon}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        {user ? (
          <div className={styles.UserName}>{user.username}</div>
        ) : (
          <div className={styles.UserName}>Login / Register</div>
        )}
      </div>
    </>
  );
}
