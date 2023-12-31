import { useState } from "react";

import GetAPIUrl from "../utilities/GetAPIUrl";

import LoginForm from "../components/LoginForm";

export default function Login() {
  const [user, setUser] = useState({ identifier: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user);
  };

  return (
    <>
      <LoginForm handleSubmit={handleSubmit} user={user} setUser={setUser} />
    </>
  );
}
