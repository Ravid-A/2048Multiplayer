import { useEffect } from "react";

import MainMenu from "../components/MainMenu";

import CheckUser from "../utilities/CheckUser";

export default function App() {
  useEffect(() => {
    document.title = "2048 Multiplayer";

    if (!CheckUser()) window.location.href = "/login";
  });

  return (
    <>
      <MainMenu />
    </>
  );
}
