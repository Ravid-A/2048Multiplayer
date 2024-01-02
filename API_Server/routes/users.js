import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import Account from "../models/account.js";

import GenerateToken from "../utilities/GenerateToken.js";
import Authenticate from "../utilities/Authenticate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  const hash_password = await bcryptjs.hash(password, 10);

  let user = await Account.findAll({ where: { email: email } });

  if (user.length != 0) {
    return res.status(200).json({
      error: true,
      message: "Account already exists with this email",
    });
  }

  user = await Account.findAll({ where: { username: username } });

  if (user.length != 0) {
    return res.status(200).json({
      error: true,
      message: "Account already exists with this username",
    });
  }

  Account.create({
    email: email,
    password: hash_password,
    username: username,
  })
    .then(async (account) => {
      const access_token = await GenerateToken(account);

      res.status(200).json({
        message: "User created successfully",
        token: access_token,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Internal server error: Cannot create account",
        error: error.message,
      });
    });
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  let user = await Account.findOne({ where: { email: identifier } });
  let response = await Authenticate(user, password);

  if (response.data.error) {
    user = await Account.findOne({ where: { username: identifier } });
    response = await Authenticate(user, password);
  }

  return res.status(response.status).json(response.data);
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;

  if (token == null) {
    return res.status(200).json({
      message: "Token not found",
      found: false,
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_TOKEN);

    const user = await Account.findByPk(decoded.id);

    return res.status(200).json({
      message: "OK",
      found: user != null,
    });
  } catch (error) {
    return res.status(200).json({
      message: "Invalid token",
      found: false,
    });
  }
});

export default router;
