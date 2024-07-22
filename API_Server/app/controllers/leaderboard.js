import services from "../services/leaderboard.js";

const GetScore = async (req, res) => {
  // type and part are passed as query parameters
  const type = req.query.type;
  const part = req.query.part;

  const user_data = req.user_data;

  try {
    const response = await services.GetScore(type, part, user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

const UpdateScore = async (req, res) => {
  const { type, part, score } = req.body;
  const user_data = req.user_data;

  try {
    const response = await services.UpdateScore(type, part, score, user_data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

export default {
  GetScore,
  UpdateScore,
};
