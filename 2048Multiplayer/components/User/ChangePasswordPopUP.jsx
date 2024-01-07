import { useRouter } from "next/router";
import { useState } from "react";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/User/ChangePasswordPopUP.module.css";

import GetAPIUrl from "../../utilities/GetAPIUrl";

export default function ChangePasswordPopUP({ setPopup }) {
  const router = useRouter();

  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    msg: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleCancel = () => {
    setPopup("none");
  };

  const handleUpdate = () => {
    if (!user.oldPassword || !user.newPassword || !user.confirmPassword) {
      setUser({ ...user, msg: "Please fill all the fields" });
      return;
    }

    if (user.oldPassword === user.newPassword) {
      setUser({
        ...user,
        msg: "New password must be different from old password",
      });
      return;
    }

    if (user.newPassword.length < 8) {
      setUser({ ...user, msg: "Password must be at least 8 characters" });
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      setUser({ ...user, msg: "Passwords do not match" });
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const url = GetAPIUrl() + "/users/updatepassword";
      const data = {
        old_password: user.oldPassword,
        new_password: user.newPassword,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const update = await response.json();
      if (update.data.error) {
        setUser({ ...user, msg: update.data.message });
        return;
      }

      router.reload();
    } catch (error) {
      console.error("Error during update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.PopUp}>
      <h1>Change Password</h1>

      <div>
        <input
          id="oldPassword"
          type={showOldPassword ? "text" : "password"}
          placeholder="Old Password"
          value={user.oldPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <button
          type="button"
          className={styles.showPasswordButton}
          onClick={handleShowOldPassword}
        >
          <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
        </button>
      </div>
      <input
        id="newPassword"
        type={showNewPassword ? "text" : "password"}
        placeholder="New Password"
        value={user.newPassword}
        onChange={handleChange}
        disabled={loading}
      />
      <button
        type="button"
        className={styles.showPasswordButton}
        onClick={handleShowNewPassword}
      >
        <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
      </button>
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm New Password"
        value={user.confirmPassword}
        onChange={handleChange}
        disabled={loading}
      />
      <button
        type="button"
        className={styles.showPasswordButton}
        onClick={handleShowConfirmPassword}
      >
        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
      </button>

      <br />
      <br />

      <button
        className={styles.UpdateButton}
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
      <button
        className={styles.CancelButton}
        onClick={handleCancel}
        disabled={loading}
      >
        Cancel
      </button>

      <div className={styles.msg}>{user.msg}</div>
    </div>
  );
}
