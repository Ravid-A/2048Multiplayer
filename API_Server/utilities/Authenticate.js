import bcryptjs from "bcryptjs";

import GenerateToken from "./GenerateToken.js";

const Authenticate = async (user, password) => {
  if (user == null) {
    return {
      status: 200,
      data: {
        error: true,
        message: "Account not found",
      },
    };
  }

  try {
    if (await bcryptjs.compare(password, user.password)) {
      const access_token = await GenerateToken(user);

      return {
        status: 200,
        data: {
          message: "OK",
          token: access_token,
        },
      };
    } else {
      return {
        status: 200,
        data: {
          error: true,
          message: "Incorrect password",
        },
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: {
        message: "Internal server error: Cannot compare password",
        error: error.message,
      },
    };
  }
};

export default Authenticate;
