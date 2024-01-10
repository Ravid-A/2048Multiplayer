import express from "express";

import {
  RegisterController,
  LoginController,
  VerifyController,
  GetDataController,
  UpdateController,
  UpdatePasswordController,
  DeleteController,
} from "../controllers/users.js";

import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);

router.get("/verify", protect, VerifyController);
router.get("/getdata", protect, GetDataController);

router.patch("/update", protect, UpdateController);
router.patch("/updatepassword", protect, UpdatePasswordController);

router.delete("/delete", protect, DeleteController);

export default router;
