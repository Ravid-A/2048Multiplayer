import {
  Register,
  Login,
  Update,
  UpdatePassword,
  Delete,
} from "../services/users.js";

const RegisterController = async (req, res) => {
  const { email, password, username } = req.body;

  if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) === null) {
    return res.status(400).json({
      message: "Invalid Email Format",
      error: true,
    });
  }

  try {
    const response = await Register(email, password, username);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const LoginController = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const response = await Login(identifier, password);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const VerifyController = async (req, res) => {
  return res.status(200).json({
    message: "User verified successfully",
    error: false,
  });
};

const GetDataController = async (req, res) => {
  const user_data = req.user_data;
  return res.status(200).json({
    user_data: {
      id: user_data.id,
      username: user_data.username,
      email: user_data.email,
    },
    error: false,
  });
};

const UpdateController = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user_data = req.user_data;

    const response = await Update(username, email, user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const UpdatePasswordController = async (req, res) => {
  const { old_password, new_password } = req.body;
  const user_data = req.user_data;

  try {
    const response = await UpdatePassword(
      old_password,
      new_password,
      user_data
    );
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const DeleteController = async (req, res) => {
  const user_data = req.user_data;

  try {
    const response = await Delete(user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

export {
  RegisterController,
  LoginController,
  VerifyController,
  GetDataController,
  UpdateController,
  UpdatePasswordController,
  DeleteController,
};
