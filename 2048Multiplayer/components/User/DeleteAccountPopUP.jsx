import { useRouter } from "next/router";
import { useState } from "react";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import styles from "../../styles/User/DeleteAccountPopUP.module.css";
import GetAPIUrl from "../../utilities/GetAPIUrl";

export default function DeleteAccountPopUP({ setPopup }) {
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setPopup("none");
  };

  const handleSure = async () => {
    const url = GetAPIUrl() + "/users/delete";
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      if (!token) {
        router.push("/");
      }

      const respone = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const data = await respone.data;
      if (data.error) {
        setMsg(data.message);
        return;
      }

      localStorage.removeItem("token");
      router.push("/");
    } catch (err) {
      if (!err.response) {
        setMsg(`Internal Server Error: ${err.message}`);
        return;
      }

      setMsg(`Internal Server Error: ${err.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.PopUp}>
      <h1>Account Delete!</h1>
      <p>Are you sure you want to delete your account?</p>
      <button
        className={styles.SureButton}
        onClick={handleSure}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Sure"}
      </button>
      <button
        className={styles.CancelButton}
        onClick={handleCancel}
        disabled={loading}
      >
        Cancel
      </button>

      <div className={styles.msg}>{msg}</div>
    </div>
  );
}
