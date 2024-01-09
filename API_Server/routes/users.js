import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import Account from "../models/account.js";

import GenerateToken from "../utilities/GenerateToken.js";
import Authenticate from "../utilities/Authenticate.js";

import protect from "../auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  let user = await Account.findAll({ where: { email: email } });

  if (user.length != 0) {
    return res.status(400).json({
      error: true,
      message: "Account already exists with this email",
    });
  }

  user = await Account.findAll({ where: { username: username } });

  if (user.length != 0) {
    return res.status(400).json({
      error: true,
      message: "Account already exists with this username",
    });
  }

  const hash_password = await bcryptjs.hash(password, 10);

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
        message: error.message,
        error: true,
      });
    });
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  let user = await Account.findOne({ where: { email: identifier } });
  let response = await Authenticate(user, password);

  if (response.data.type == "account_not_found") {
    user = await Account.findOne({ where: { username: identifier } });
    response = await Authenticate(user, password);
  }

  return res.status(response.status).json(response.data);
});

router.post("/verify", protect, async (req, res) => {
  return res.status(200).json({
    message: "OK",
    error: false,
  });
});

router.get("/getdata", protect, async (req, res) => {
  return res.status(200).json({
    user_data: req.user_data,
    error: false,
  });
});

router.post("/update", protect, async (req, res) => {
  const { username, email } = req.body;

  const user_data = req.user_data;

  try {
    const data_to_update = {
      username: user_data.username,
      email: user_data.email,
    };

    if (username != "") {
      const user = await Account.findOne({ where: { username: username } });

      if (user != null) {
        return res.status(400).json({
          data: {
            error: true,
            message: "Username already exists",
          },
        });
      }

      data_to_update.username = username;
    }

    if (email != "") {
      const user = await Account.findOne({ where: { email: email } });

      if (user != null) {
        return res.status(400).json({
          data: {
            error: true,
            message: "Email already exists",
          },
        });
      }

      data_to_update.email = email;
    }

    const updated_user = await Account.update(data_to_update, {
      where: {
        id: user_data.id,
      },
    });

    return res.status(200).json({
      data: {
        token: await GenerateToken(updated_user),
        message: "user updated successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      data: {
        error: true,
        message: error.message,
      },
    });
  }
});

router.post("/updatepassword", protect, async (req, res) => {
  const { old_password, new_password } = req.body;
  const user_data = req.user_data;

  try {
    const user = await Account.findOne({ where: { id: user_data.id } });

    const response = await Authenticate(user, old_password);

    if (response.data.error) {
      return res.status(response.status).json(response.data);
    }

    if (await bcryptjs.compare(new_password, user.password)) {
      return res.status(400).json({
        data: {
          error: true,
          message: "New password cannot be same as old password",
        },
      });
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

    return res.status(200).json({
      data: {
        message: "Password updated successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      data: {
        error: true,
        message: error.message,
      },
    });
  }
});

router.delete("/delete", protect, async (req, res) => {
  const user_data = req.user_data;

  try {
    await Account.destroy({
      where: {
        id: user_data.id,
      },
    });

    return res.status(200).json({
      data: {
        message: "user deleted successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      data: {
        error: true,
        message: error.message,
      },
    });
  }
});

export default router;
