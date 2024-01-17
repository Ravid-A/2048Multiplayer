import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../styles/RegisterForm.module.css";

import LoggedInPopUP from "./LoggedInPopUP";

export default function RegisterForm({
  handleSubmit,
  user,
  setUser,
  loggedIn,
  loading,
  handleDisconnect,
}) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleBackButton = () => {
    if (loading || loggedIn) return;
    router.push("/");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.register}>
      <div className={styles.register_container}>
        <div className={styles.backButton} onClick={handleBackButton}>
          ←
        </div>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>
        <div className={styles.register_form}>
          <input
            id="username"
            type="text"
            onChange={handleChange}
            placeholder="Username"
            value={user.username}
            disabled={loggedIn || loading}
          />
          <input
            id="email"
            type="text"
            onChange={handleChange}
            placeholder="Email"
            value={user.email}
            disabled={loggedIn || loading}
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            placeholder="Password"
            value={user.password}
            disabled={loggedIn || loading}
          />
          <div
            className={styles.showPasswordButton}
            onClick={handleShowPassword}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </div>
          <input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            onChange={handleChange}
            placeholder="Confirm Password"
            value={user.confirm_password}
            disabled={loggedIn || loading}
          />
          <div
            className={styles.showPasswordButton}
            onClick={handleShowConfirmPassword}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
          </div>
          <Link className={styles.Link} href="/login">
            Have an account? Login here
          </Link>
          <br />
          <br />
          <button
            className={styles.register_button}
            onClick={handleSubmit}
            disabled={loggedIn || loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {user.msg && <div className={styles.error}>{user.msg}</div>}
        </div>
      </div>
      {loggedIn && <LoggedInPopUP handleDisconnect={handleDisconnect} />}
    </div>
  );
}
