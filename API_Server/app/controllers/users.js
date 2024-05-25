import services from "../services/users.js";

const Register = async (req, res) => {
  const { email, password, username } = req.body;

  if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) === null) {
    return res.status(400).json({
      message: "Invalid Email Format",
      error: true,
    });
  }

  try {
    const response = await services.Register(email, password, username);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const Login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const response = await services.Login(identifier, password);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const Verify = async (req, res) => {
  return res.status(200).json({
    message: "User verified successfully",
    error: false,
  });
};

const GetData = async (req, res) => {
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

const Update = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user_data = req.user_data;

    const response = await services.Update(username, email, user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const UpdatePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const user_data = req.user_data;

  try {
    const response = await services.UpdatePassword(
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

const Delete = async (req, res) => {
  const user_data = req.user_data;

  try {
    const response = await services.Delete(user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

export default {
  Register,
  Login,
  Verify,
  GetData,
  Update,
  UpdatePassword,
  Delete,
};
