import { useState } from "react";
import Link from "next/link";

import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoggedInPopUP from "./PopUps/LoggedInPopUP";

import styles from "../styles/LoginForm.module.css";

export default function LoginForm({
  handleSubmit,
  user,
  setUser,
  loggedIn,
  loading,
  handleDisconnect,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.login}>
      <div className={styles.login_container}>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>
        <div className={styles.login_form}>
          <input
            id="identifier"
            type="text"
            onChange={handleChange}
            disabled={loggedIn || loading}
            placeholder="Email / Username"
            value={user.identifier}
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            disabled={loggedIn || loading}
            placeholder="Password"
            value={user.password}
          />
          <div
            className={styles.showPasswordButton}
            onClick={handleShowPassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </div>
          <Link className={styles.Link} href="/register">
            Don't have an account? Register here
          </Link>
          <br />
          <br />
          <button
            className={styles.login_button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                {"Logging in "}
                <FontAwesomeIcon icon={faSpinner} spinPulse />
              </>
            ) : (
              "Login"
            )}
          </button>
          {user.msg && <div className={styles.error}>{user.msg}</div>}
        </div>
      </div>
      {loggedIn && <LoggedInPopUP handleDisconnect={handleDisconnect} />}
    </div>
  );
}
