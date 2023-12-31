import jwt from "jsonwebtoken";

const GenerateToken = async (user) => {
  const data_to_token = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const access_token = await jwt.sign(data_to_token, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });

  return access_token;
};

export default GenerateToken;
