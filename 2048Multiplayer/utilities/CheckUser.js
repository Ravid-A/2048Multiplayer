import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import GetAPIUrl from "./GetAPIUrl";

const CheckUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const user = await verifyUser(token);

      if (!user) {
        localStorage.removeItem("token");
      }

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
    const response = await axios.get(`${GetAPIUrl()}/users/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => {
        return status < 500;
      },
    });

    const data = await response.data;
    return !data.error;
  } catch (error) {
    return false;
  }
};

export default CheckUser;
