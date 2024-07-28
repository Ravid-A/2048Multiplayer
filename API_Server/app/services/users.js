import bcryptjs from "bcryptjs";

import Account from "../models/account.js";

import CheckIfUserExists, {
  ExistsError,
} from "../utilities/CheckIfUserExists.js";
import GenerateToken from "../utilities/GenerateToken.js";
import Authenticate from "../utilities/Authenticate.js";

const Register = async (email, password, username) => {
  const userExists = await CheckIfUserExists(email, username);

  if (userExists) {
    return {
      status: 400,
      data: {
        error: true,
        message: `Account already exists with this ${
          userExists == ExistsError.Email ? "email" : "username"
        }`,
      },
    };
  }

  const hash_password = await bcryptjs.hash(password, 10);

  const user = await Account.create({
    email: email,
    password: hash_password,
    username: username,
  });

  const access_token = await GenerateToken(user);

  return {
    status: 201,
    data: {
      error: false,
      message: "Account created successfully",
      token: access_token,
    },
  };
};

const Login = async (identifier, password) => {
  let user = await Account.findOne({ where: { email: identifier } });
  let response = await Authenticate(user, password);

  if (response.data.type == "account_not_found") {
    user = await Account.findOne({ where: { username: identifier } });
    response = await Authenticate(user, password);
  }

  return response;
};

const Update = async (username, email, user_data) => {
  const data_to_update = {
    username: user_data.username,
    email: user_data.email,
  };

  const userExists = await CheckIfUserExists(email, username);
  if (userExists) {
    return {
      status: 400,
      data: {
        error: true,
        message: `Account already exists with this ${
          userExists == ExistsError.Email ? "email" : "username"
        }`,
      },
    };
  }

  if (username) {
    data_to_update.username = username;
  }

  if (email) {
    if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) === null) {
      return {
        status: 400,
        data: {
          message: "Invalid Email Format",
          error: true,
        },
      };
    }

    data_to_update.email = email;
  }

  await Account.update(data_to_update, {
    where: {
      id: user_data.id,
    },
  });

  return {
    status: 200,
    data: {
      error: false,
      message: "Account updated successfully",
    },
  };
};

const UpdatePassword = async (old_password, new_password, user_data) => {
  const user = await Account.findOne({ where: { id: user_data.id } });

  const response = await Authenticate(user, old_password);

  if (response.data.error) {
    return response;
  }

  if (await bcryptjs.compare(new_password, user.password)) {
    return {
      status: 400,
      data: {
        error: true,
        message: "New password cannot be same as old password",
      },
    };
  }

  const hash_password = await bcryptjs.hash(new_password, 10);

  await Account.update(
    { password: hash_password },
    {
      where: {
        id: user_data.id,
      },
    }
  );

  return {
    status: 200,
    data: {
      message: "Password updated successfully",
    },
  };
};

const Delete = async (user_data) => {
  await Account.destroy({
    where: {
      id: user_data.id,
    },
  });

  return {
    status: 200,
    data: {
      message: "user deleted successfully",
    },
  };
};

export default { Register, Login, Update, UpdatePassword, Delete };
