import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/User/MenuUser.module.css";

export default function MenuUser({ user }) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleClick = () => {
    router.push("/profile");
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
