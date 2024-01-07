import { useRouter } from "next/router";

import styles from "../../styles/User/Profile.module.css";

const Profile = ({ handleSubmit, user, setUser, loading }) => {
  const router = useRouter();

  const handleBackButton = () => {
    router.push("/");
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleUpdate = () => {
    handleSubmit();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profile_container}>
        <div className={styles.backButton} onClick={handleBackButton}>
          ←
        </div>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <h2 className={styles.page_title}>Profile</h2>
        <div className={styles.profile_form}>
          <div className={styles.profile_form}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              onChange={handleChange}
              disabled={loading}
              placeholder={user.placeholder.username}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              onChange={handleChange}
              disabled={loading}
              placeholder={user.placeholder.email}
            />
            <button
              className={styles.update_button}
              onClick={handleUpdate}
              disabled={loading}
            >
              Update
            </button>
            {user.msg && <div className={styles.error}>{user.msg}</div>}
          </div>
          <br />
          <br />

          <button className={styles.change_password_button} disabled={loading}>
            Change Password
          </button>
          <br />
          <br />
          <button className={styles.delete_button} disabled={loading}>
            Delete Account
          </button>
          <br />
          <br />
          <button
            className={styles.logout_button}
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
