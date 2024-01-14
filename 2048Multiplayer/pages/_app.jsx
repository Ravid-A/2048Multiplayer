import { useEffect } from "react";

import "../styles/global.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.title = "2048 Multiplayer";

    return () => {
      document.title = "2048 Multiplayer";
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
