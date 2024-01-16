import Head from "next/head";

import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>2048 Multiplayer</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
