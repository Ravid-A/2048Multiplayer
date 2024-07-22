import Leaderboard from "../models/leaderboard.js";

const GetScore = async (type, part, user_data) => {
  const id = user_data.id;
  const score = await Leaderboard.findOne({
    where: {
      type: type,
      part: part,
      user: id,
    },
    order: [["score", "DESC"]],
    limit: 10,
  });

  if (!score) {
    return {
      status: 404,
      data: {
        error: true,
        message: "Score not found",
      },
    };
  }

  return {
    status: 200,
    data: {
      error: false,
      message: "Score retrieved successfully",
      score: score.score,
    },
  };
};

const UpdateScore = async (type, part, score, user_data) => {
  const id = user_data.id;
  const leaderboard = await Leaderboard.findOne({
    where: {
      type: type,
      part: part,
      user: id,
    },
  });

  if (!leaderboard) {
    await Leaderboard.create({
      user: id,
      type: type,
      part: part,
      score: score,
    });

    return {
      status: 201,
      data: {
        error: false,
        message: "Score added successfully",
      },
    };
  }

  if (type === "speedrun" && leaderboard.score > score) {
    leaderboard.score = score;
    await leaderboard.save();

    return {
      status: 200,
      data: {
        error: false,
        message: "Score updated successfully",
      },
    };
  }

  if (type === "classic" && leaderboard.score < score) {
    leaderboard.score = score;
    await leaderboard.save();

    return {
      status: 200,
      data: {
        error: false,
        message: "Score updated successfully",
      },
    };
  }

  return {
    status: 200,
    data: {
      error: false,
      message: "Score not updated",
    },
  };
};

export default {
  GetScore,
  UpdateScore,
};
