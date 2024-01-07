import { useRouter } from "next/router";
import { useState } from "react";

import styles from "../../styles/User/DeleteAccountPopUP.module.css";
import GetAPIUrl from "../../utilities/GetAPIUrl";

export default function DeleteAccountPopUP({ setPopup }) {
  const router = useRouter();

  const [msg, setMsg] = useState("");

  const handleCancel = () => {
    setPopup("none");
  };

  const handleSure = async () => {
    const url = GetAPIUrl() + "/users/delete";
    const token = localStorage.getItem("token");

    const respone = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await respone.json();
    if (data.data.error) {
      setMsg(data.data.message);
      return;
    }

    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className={styles.PopUp}>
      <h1>Account Delete!</h1>
      <p>Are you sure you want to delete your account?</p>
      <button className={styles.SureButton} onClick={handleSure}>
        I'm Sure
      </button>
      <button className={styles.CancelButton} onClick={handleCancel}>
        Cancel
      </button>

      <div className={styles.msg}>{msg}</div>
    </div>
  );
}
