import express from "express";
import bcryptjs from "bcryptjs";

import Account from "../models/account.js";

import GenerateToken from "../utilities/GenerateToken.js";
import Authnticate from "../utilities/Authenticate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  const hash_password = await bcryptjs.hash(password, 10);

  let user = await Account.findAll({ where: { email: email } });

  if (user.length != 0) {
    return res.status(400).json({
      message: "Account already exists with this email",
    });
  }

  user = await Account.findAll({ where: { username: username } });

  if (user.length != 0) {
    return res.status(400).json({
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
  let response = await Authnticate(user, password);

  if (response.status == 400) {
    user = await Account.findOne({ where: { username: identifier } });
    response = await Authnticate(user, password);
  }

  return res.status(response.status).json(response.data);
});

router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (token == null) {
    return res.status(400).json({
      message: "Token not found",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await Account.findByPk(decoded.id);

    return res.status(200).json({
      message: "OK",
      found: user != null,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
});

export default router;
