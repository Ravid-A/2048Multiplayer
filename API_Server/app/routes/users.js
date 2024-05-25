import express from "express";

import controllers from "../controllers/users.js";

import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", controllers.Register);
router.post("/login", controllers.Login);

router.get("/verify", protect, controllers.Verify);
router.get("/getdata", protect, controllers.GetData);

router.patch("/update", protect, controllers.Update);
router.patch("/updatepassword", protect, controllers.UpdatePassword);

router.delete("/delete", protect, controllers.Delete);

export default router;
