import GetAPIUrl from "./GetAPIUrl";

const CheckUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const user = await verifyUser(token);
      return user;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const verifyUser = async (token) => {
  try {
    const response = await fetch(`${GetAPIUrl()}/users/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    const data = await response.json();
    return data.found;
  } catch (error) {
    return false;
  }
};

export default CheckUser;
