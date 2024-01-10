import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

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
    const response = await axios.get(`${GetAPIUrl()}/users/getdata`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => {
        return status < 500;
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    return {
      message: error.response.message,
      error: true,
    };
  }
};

export default GetUser;
