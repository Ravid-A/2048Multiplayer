import { useRouter } from "next/router";
import styles from "../styles/NotConnectedPopUP.module.css";

export default function NoConnectedPopUP({ setPopUp }) {
  const router = useRouter();

  const handleYes = () => {
    router.push("/login");
  };

  const handleNo = () => {
    setPopUp(false);
  };

  return (
    <div className={styles.PopUp}>
      <h1>Not Logged In!</h1>
      <p>You cannot play this mode because you are not logged in!</p>
      <p>Want to Login?</p>
      <button onClick={handleYes}>Yes</button>
      <button onClick={handleNo}>No</button>
    </div>
  );
}
