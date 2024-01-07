import GetAPIUrl from "./GetAPIUrl.js";

const GetUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const user = await getUser(token);

      if (!user.found) {
        localStorage.removeItem("token");
      }

      return user.data;
    }
  } catch (error) {
    return {
      message: error.message,
      found: false,
    };
  }
};

const getUser = async (token) => {
  try {
    const response = await fetch(`${GetAPIUrl()}/users/getdata/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      message: error.message,
      found: false,
    };
  }
};

export default GetUser;
