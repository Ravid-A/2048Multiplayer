import { useRouter } from "next/router";
import { useState } from "react";

import styles from "../../../styles/MultiplayerStatusPopUP.module.css";

export default function MultiplayerStatusPopUP({ status, error }) {
  const title = error ? "Error" : "Status";

  const router = useRouter();

  const handleReturn = () => {
    router.push("/");
  };

  return (
    <div className={styles.PopUp}>
      <h1>{title}:</h1>
      <p>{status}</p>
      {error && <button onClick={handleReturn}>Go Home</button>}
    </div>
  );
}
