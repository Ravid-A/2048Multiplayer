import Sequelize from "sequelize";
import database from "./database.js";
import Account from "./account.js";

const Leaderboard = database.define(
  "leaderboard",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    part: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      uniqueLeaderboard: {
        fields: ["user", "type", "part"],
      },
    },
  }
);

Leaderboard.belongsTo(Account, { foreignKey: "user", onDelete: "cascade" });

export default Leaderboard;
