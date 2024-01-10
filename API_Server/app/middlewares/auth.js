import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";

import Account from "../models/account.js";

const protect = asynchandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    (token = req.headers.authorization.split(" ")[1]) != null
  ) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await Account.findByPk(decoded.id);

      if (user == null) {
        return res.status(401).json({
          message: "Not Authorized: User not found",
          error: true,
        });
      }

      req.user_data = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error: true,
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Authorized: No Token Specified",
      error: true,
    });
  }
});

export default protect;
