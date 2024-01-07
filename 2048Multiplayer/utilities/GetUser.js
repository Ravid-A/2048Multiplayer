import GetAPIUrl from "./GetAPIUrl.js";

const GetUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const user = await getUser(token);

      if (user.error) {
        localStorage.removeItem("token");
      }

      return user.user_data;
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
    const response = await fetch(`${GetAPIUrl()}/users/getdata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      message: error.message,
      error: true,
    };
  }
};

export default GetUser;
