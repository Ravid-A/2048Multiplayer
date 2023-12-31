import GetAPIUrl from "./GetAPIUrl";

const CheckUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      return verifyUser(token);
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    if (response.status == 400) {
      return false;
    }

    const data = await response.json();
    return data.found;
  } catch (error) {
    return false;
  }
};

export default CheckUser;
